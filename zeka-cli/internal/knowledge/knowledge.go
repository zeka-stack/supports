// Package knowledge serves the same immutable source snapshot to CLI and MCP.
// Generated assets are checked against their maintained sources before release.
package knowledge

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
)

//go:embed assets/metadata.json
var metadata []byte

//go:embed assets/arch.md
var Architecture string

//go:embed assets/demo.md
var Demo string

// Source identifies a maintained file, independently of local checkout location.
type Source struct {
	Path   string `json:"path"`
	SHA256 string `json:"sha256"`
}

// Dependency describes a declared Maven dependency; properties are not resolved.
type Dependency struct {
	GroupID    string `json:"group_id"`
	ArtifactID string `json:"artifact_id"`
	Version    string `json:"version"`
	Scope      string `json:"scope"`
}

// Configuration keeps original property source to avoid inventing resolved defaults.
type Configuration struct {
	Class             string   `json:"class"`
	Source            Source   `json:"source"`
	BindingExpression string   `json:"binding_expression"`
	Declarations      []string `json:"declarations"`
	SourceText        string   `json:"source_text,omitempty"`
}

// AutoConfiguration records the actual Spring Boot import descriptor.
type AutoConfiguration struct {
	Source     Source   `json:"source"`
	Classes    []string `json:"classes"`
	Origin     string   `json:"origin"`
	SourceText string   `json:"source_text,omitempty"`
}

// Starter is a business-consumable JAR entrance and its transitive local modules.
type Starter struct {
	ArtifactID        string              `json:"artifact_id"`
	Dependencies      []Dependency        `json:"dependencies"`
	ParentArtifactID  string              `json:"parent_artifact_id"`
	Packaging         string              `json:"packaging"`
	Source            Source              `json:"source"`
	Skill             string              `json:"skill"`
	SkillSource       Source              `json:"skill_source"`
	Modules           []string            `json:"modules"`
	Configurations    []Configuration     `json:"configurations"`
	AutoConfiguration []AutoConfiguration `json:"auto_configuration"`
}

// JavaType is a source declaration index, not a Java compatibility guarantee.
type JavaType struct {
	Name          string   `json:"name"`
	QualifiedName string   `json:"qualified_name"`
	Summary       string   `json:"summary"`
	Methods       []string `json:"methods"`
	Line          int      `json:"line"`
	Source        Source   `json:"source"`
}

// Catalog binds the engineering rules to a particular framework source snapshot.
type Catalog struct {
	SchemaVersion       int            `json:"schema_version"`
	FrameworkVersion    string         `json:"framework_version"`
	Scope               string         `json:"scope"`
	Coverage            map[string]int `json:"coverage"`
	Starters            []Starter      `json:"starters"`
	Types               []JavaType     `json:"types"`
	BusinessSkill       string         `json:"business_skill"`
	BusinessSkillSource Source         `json:"business_skill_source"`
	ArchitectureSource  Source         `json:"architecture_source"`
	DemoSource          Source         `json:"demo_source"`
}

// Load rejects malformed bundled data so a broken release never serves empty advice.
func Load() (*Catalog, error) {
	var c Catalog
	if err := json.Unmarshal(metadata, &c); err != nil {
		return nil, fmt.Errorf("read embedded knowledge: %w", err)
	}
	if c.SchemaVersion != 1 || len(c.Starters) == 0 {
		return nil, fmt.Errorf("unsupported or empty knowledge schema")
	}
	return &c, nil
}

// Find accepts an exact artifact or an unambiguous fragment and explains ambiguity.
func (c *Catalog) Find(name string) (Starter, error) {
	if strings.TrimSpace(name) == "" {
		return Starter{}, fmt.Errorf("starter is required; use zeka list")
	}
	var matches []Starter
	for _, s := range c.Starters {
		if s.ArtifactID == name {
			return s, nil
		}
		if strings.Contains(s.ArtifactID, strings.ToLower(name)) {
			matches = append(matches, s)
		}
	}
	if len(matches) == 1 {
		return matches[0], nil
	}
	var names []string
	for _, s := range matches {
		names = append(names, s.ArtifactID)
	}
	return Starter{}, fmt.Errorf("starter %q has %d matches (%s); use zeka list and an exact artifactId",
		name, len(matches), strings.Join(names, ", "))
}

// Info defaults to compact declarations; full source is opt-in to bound agent context.
func (c *Catalog) Info(name string, detail bool) (Starter, error) {
	s, err := c.Find(name)
	if err != nil || detail {
		return s, err
	}
	s.Skill = ""
	s.Configurations = append([]Configuration(nil), s.Configurations...)
	s.AutoConfiguration = append([]AutoConfiguration(nil), s.AutoConfiguration...)
	for i := range s.Configurations {
		s.Configurations[i].SourceText = ""
	}
	for i := range s.AutoConfiguration {
		s.AutoConfiguration[i].SourceText = ""
	}
	return s, nil
}

// Search ranks exact class names first, then text matches, with bounded output.
func (c *Catalog) Search(query string, limit int) ([]JavaType, error) {
	query = strings.ToLower(strings.TrimSpace(query))
	if query == "" {
		return nil, fmt.Errorf("a nonempty search keyword is required")
	}
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		return nil, fmt.Errorf("limit must be at most 100")
	}
	out := []JavaType{}
	for _, t := range c.Types {
		if strings.Contains(strings.ToLower(t.QualifiedName+" "+t.Summary+" "+strings.Join(t.Methods, " ")), query) {
			out = append(out, t)
		}
	}
	sort.SliceStable(out, func(i, j int) bool {
		return strings.EqualFold(out[i].Name, query) && !strings.EqualFold(out[j].Name, query)
	})
	if len(out) > limit {
		out = out[:limit]
	}
	return out, nil
}
