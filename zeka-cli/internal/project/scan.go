// Package project performs bounded, read-only checks of a business checkout.
// Rules are deliberately heuristic and never claim Maven or Java semantic resolution.
package project

import (
	"context"
	"encoding/xml"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
)

const maxFileSize = 8 << 20
const maxFiles = 20000

// Finding provides a stable rule ID and enough evidence for a human to act.
type Finding struct {
	Rule     string `json:"rule"`
	Severity string `json:"severity"`
	File     string `json:"file"`
	Line     int    `json:"line"`
	Message  string `json:"message"`
}

// Report distinguishes successful scanning from semantic validation.
type Report struct {
	Root         string         `json:"root"`
	Mode         string         `json:"mode"`
	FilesScanned int            `json:"files_scanned"`
	Dependencies []Dependency   `json:"dependencies"`
	Imports      map[string]int `json:"imports"`
	Findings     []Finding      `json:"findings"`
	Limitation   string         `json:"limitation"`
}

// Dependency contains direct POM declarations, without resolving profiles or parents.
type Dependency struct {
	File       string `json:"file"`
	GroupID    string `json:"group_id"`
	ArtifactID string `json:"artifact_id"`
	Version    string `json:"version,omitempty"`
	Scope      string `json:"scope,omitempty"`
}

type pomDependency struct {
	GroupID    string `xml:"groupId"`
	ArtifactID string `xml:"artifactId"`
	Version    string `xml:"version"`
	Scope      string `xml:"scope"`
}

type pom struct {
	XMLName      xml.Name        `xml:"project"`
	Parent       pomDependency   `xml:"parent"`
	Dependencies []pomDependency `xml:"dependencies>dependency"`
}

// Resolve confines MCP reads to its startup workspace, including symlink resolution.
func Resolve(workspace, requested string) (string, error) {
	root, err := filepath.EvalSymlinks(workspace)
	if err != nil {
		return "", err
	}
	root, err = filepath.Abs(root)
	if err != nil {
		return "", err
	}
	if requested == "" {
		requested = "."
	}
	if !filepath.IsAbs(requested) {
		requested = filepath.Join(root, requested)
	}
	path, err := filepath.EvalSymlinks(requested)
	if err != nil {
		return "", err
	}
	path, err = filepath.Abs(path)
	if err != nil {
		return "", err
	}
	rel, err := filepath.Rel(root, path)
	if err != nil || rel == ".." || strings.HasPrefix(rel, ".."+string(filepath.Separator)) {
		return "", fmt.Errorf("project path must stay inside workspace %s", root)
	}
	stat, err := os.Stat(path)
	if err != nil {
		return "", err
	}
	if !stat.IsDir() {
		return "", fmt.Errorf("project path must be a directory")
	}
	return path, nil
}

var ignoredDirs = map[string]bool{
	".git": true, ".idea": true, ".cursor": true, ".claude": true, ".codex": true,
	"target": true, "node_modules": true, ".vitepress": true, "bin": true,
	"build": true, "dist": true, ".venv": true,
}

var packageRE = regexp.MustCompile(`(?m)^\s*package\s+([\w.]+)\s*;`)
var importRE = regexp.MustCompile(`(?m)^\s*import\s+(?:static\s+)?(dev\.dong4j\.zeka\.[\w.*]+)\s*;`)

// Scan only reads POM/Java files, skips links and build directories, and respects cancellation.
func Scan(ctx context.Context, directory, mode string) (Report, error) {
	if mode != "usage" && mode != "doctor" && mode != "lint" {
		return Report{}, fmt.Errorf("unknown scan mode %q", mode)
	}
	root, err := filepath.Abs(directory)
	if err != nil {
		return Report{}, err
	}
	stat, err := os.Stat(root)
	if err != nil {
		return Report{}, err
	}
	if !stat.IsDir() {
		return Report{}, fmt.Errorf("scan target must be a directory")
	}
	r := Report{Root: root, Mode: mode, Dependencies: []Dependency{},
		Imports: map[string]int{}, Findings: []Finding{},
		Limitation: "Static heuristics only; no Java compilation, Maven profile/inheritance/property resolution, authorization or runtime validation."}
	err = filepath.WalkDir(root, func(path string, entry fs.DirEntry, walkErr error) error {
		if err := ctx.Err(); err != nil {
			return err
		}
		if walkErr != nil {
			return walkErr
		}
		if entry.IsDir() {
			if path != root && (ignoredDirs[entry.Name()] || strings.HasPrefix(entry.Name(), ".")) {
				return filepath.SkipDir
			}
			return nil
		}
		if entry.Type()&os.ModeSymlink != 0 || (entry.Name() != "pom.xml" && filepath.Ext(path) != ".java") {
			return nil
		}
		if !entry.Type().IsRegular() {
			return nil
		}
		info, err := entry.Info()
		if err != nil {
			return err
		}
		rel, err := filepath.Rel(root, path)
		if err != nil {
			return err
		}
		if info.Size() > maxFileSize {
			r.Findings = append(r.Findings, Finding{"SCAN_SIZE", "warning", rel, 1, "File exceeds 8 MiB and was not read"})
			return nil
		}
		r.FilesScanned++
		if r.FilesScanned > maxFiles {
			return fmt.Errorf("scan exceeds %d files; choose a smaller project", maxFiles)
		}
		content, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		if entry.Name() == "pom.xml" {
			var model pom
			if err := xml.Unmarshal(content, &model); err != nil {
				return fmt.Errorf("%s: invalid POM XML: %w", rel, err)
			}
			for _, d := range model.Dependencies {
				if strings.TrimSpace(d.GroupID) == "dev.dong4j" {
					r.Dependencies = append(r.Dependencies, Dependency{rel, d.GroupID, d.ArtifactID, d.Version, d.Scope})
				}
			}
			if mode == "doctor" {
				if rel == "pom.xml" && model.Parent.ArtifactID != "arco-business-parent" {
					r.Findings = append(r.Findings, Finding{"PARENT", "info", rel, 1,
						"Root does not directly inherit arco-business-parent; verify inherited company parent/BOM before changing it"})
				}
				checkStack(&r, rel, model.Dependencies)
			}
			return nil
		}
		code := stripComments(string(content))
		for _, m := range importRE.FindAllStringSubmatch(code, -1) {
			r.Imports[m[1]]++
		}
		if strings.Contains(filepath.ToSlash(rel), "src/test/") {
			return nil
		}
		if mode == "doctor" && strings.Contains(code, "@RestControllerWrapper") {
			if m := packageRE.FindStringSubmatch(code); len(m) == 2 && !strings.Contains(strings.ToLower(m[1]), "dev.dong4j.zeka") {
				r.Findings = append(r.Findings, Finding{"PACKAGE_PREFIX", "warning", rel, 1,
					"Custom Controller package: verify JVM -DPARENT_PACKAGE_NAME and automatic response wrapping"})
			}
		}
		if mode == "lint" {
			lintJava(&r, rel, code)
		}
		return nil
	})
	if err != nil {
		return Report{}, err
	}
	if mode == "doctor" {
		if _, err := os.Stat(filepath.Join(root, "pom.xml")); os.IsNotExist(err) {
			r.Findings = append(r.Findings, Finding{"POM_MISSING", "warning", "pom.xml", 1, "No root pom.xml; scan the Maven business project directory"})
		}
	}
	sort.Slice(r.Findings, func(i, j int) bool {
		a, b := r.Findings[i], r.Findings[j]
		if a.File != b.File {
			return a.File < b.File
		}
		if a.Line != b.Line {
			return a.Line < b.Line
		}
		return a.Rule < b.Rule
	})
	return r, nil
}

// checkStack reports conflicts per module, avoiding false conflicts across reactor siblings.
func checkStack(r *Report, file string, dependencies []pomDependency) {
	servlet, reactive := false, false
	for _, d := range dependencies {
		if d.Scope == "test" || d.Scope == "provided" {
			continue
		}
		if d.GroupID != "dev.dong4j" && d.GroupID != "org.springframework.boot" {
			continue
		}
		a := d.ArtifactID
		servlet = servlet || strings.Contains(a, "-servlet-") || a == "cubo-ssm-spring-boot-starter" ||
			a == "spring-boot-starter-web" || a == "cubo-dict-spring-boot-starter" || a == "cubo-openapi-dubbo-spring-boot-starter"
		reactive = reactive || strings.Contains(a, "-reactive-") || a == "spring-boot-starter-webflux"
		if a == "cubo-rest-spring-boot-starter" || a == "cubo-endpoint-spring-boot-starter" ||
			a == "cubo-messaging-spring-boot-starter" || a == "cubo-openapi-spring-boot-starter" ||
			a == "cubo-logsystem-spring-boot-starter" {
			r.Findings = append(r.Findings, Finding{"AGGREGATOR", "warning", file, 1,
				a + " is an aggregate POM; depend on a concrete starter"})
		}
	}
	if servlet && reactive {
		r.Findings = append(r.Findings, Finding{"WEB_STACK", "warning", file, 1,
			"Servlet and Reactive entrances declared in the same module; select one and verify transitive dependencies"})
	}
}

// stripComments preserves string literals and line offsets so findings point to real code.
func stripComments(s string) string {
	b := []byte(s)
	out := append([]byte(nil), b...)
	state := byte(0)
	for i := 0; i < len(b); i++ {
		switch state {
		case '"', '\'':
			if b[i] == '\\' {
				i++
			} else if b[i] == state {
				state = 0
			}
		case 'l':
			if b[i] == '\n' {
				state = 0
			} else {
				out[i] = ' '
			}
		case 'b':
			if b[i] == '*' && i+1 < len(b) && b[i+1] == '/' {
				out[i], out[i+1] = ' ', ' '
				i++
				state = 0
			} else if b[i] != '\n' {
				out[i] = ' '
			}
		default:
			if b[i] == '"' || b[i] == '\'' {
				state = b[i]
			} else if b[i] == '/' && i+1 < len(b) && (b[i+1] == '/' || b[i+1] == '*') {
				state = 'l'
				if b[i+1] == '*' {
					state = 'b'
				}
				out[i], out[i+1] = ' ', ' '
				i++
			}
		}
	}
	return string(out)
}
