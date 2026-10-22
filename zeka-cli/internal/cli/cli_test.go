// CLI tests verify developer-facing errors, non-overwrite behavior and selected skills.
package cli

import (
	"bytes"
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestQueryAndErrors(t *testing.T) {
	for _, args := range [][]string{{"list"}, {"info", "mybatis"}, {"search", "BaseDao"}, {"arch", "--format", "json"}} {
		var out, errors bytes.Buffer
		if code := Run(args, &out, &errors); code != 0 || !json.Valid(out.Bytes()) || errors.Len() != 0 {
			t.Fatalf("%v: output=%s errors=%s", args, out.String(), errors.String())
		}
	}
	for _, args := range [][]string{{"info"}, {"info", "rest"}, {"unknown"}, {"arch", "--format", "xml"}, {"list", "extra"}} {
		var out, errors bytes.Buffer
		if code := Run(args, &out, &errors); code == 0 || out.Len() != 0 || !json.Valid(errors.Bytes()) {
			t.Fatalf("%v: output=%s errors=%s", args, out.String(), errors.String())
		}
	}
}

func TestSelectedExtractionAndConflict(t *testing.T) {
	root := t.TempDir()
	var out, errors bytes.Buffer
	args := []string{"skills", "extract", "--dir", root, "--starter", "cubo-ssm-spring-boot-starter"}
	if code := Run(args, &out, &errors); code != 0 {
		t.Fatal(errors.String())
	}
	for _, name := range []string{"zeka-stack-business-dev", "cubo-ssm-spring-boot-starter", "cubo-rest-servlet-spring-boot-starter"} {
		if _, err := os.Stat(filepath.Join(root, name, "SKILL.md")); err != nil {
			t.Fatal(err)
		}
	}
	if _, err := os.Stat(filepath.Join(root, "cubo-rest-reactive-spring-boot-starter")); !os.IsNotExist(err) {
		t.Fatal("an unrelated Reactive skill was exported")
	}
	path := filepath.Join(root, "zeka-stack-business-dev", "SKILL.md")
	if err := os.WriteFile(path, []byte("local instructions"), 0644); err != nil {
		t.Fatal(err)
	}
	out.Reset()
	errors.Reset()
	if code := Run(args, &out, &errors); code == 0 {
		t.Fatal("overwrote a locally modified skill")
	}
	got, _ := os.ReadFile(path)
	if string(got) != "local instructions" {
		t.Fatal("modified skill was not preserved")
	}
}

func TestStrictAndSetup(t *testing.T) {
	root := t.TempDir()
	if err := os.WriteFile(filepath.Join(root, "Bad.java"), []byte("class Bad { @Autowired private Service service; }"), 0644); err != nil {
		t.Fatal(err)
	}
	var out, errors bytes.Buffer
	if code := Run([]string{"lint", root, "--strict"}, &out, &errors); code != 3 {
		t.Fatalf("expected exit 3, got %d: %s", code, errors.String())
	}
	for _, client := range []string{"claude", "cursor", "vscode", "codex"} {
		out.Reset()
		errors.Reset()
		if code := Run([]string{"setup", "--client", client, "--workspace", root}, &out, &errors); code != 0 ||
			!strings.Contains(out.String(), root) {
			t.Fatalf("bad setup for %s: %s", client, errors.String())
		}
	}
}
