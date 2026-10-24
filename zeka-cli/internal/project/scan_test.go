// Scanner tests exercise real temporary business files, not the framework checkout.
package project

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func write(t *testing.T, root, name, text string) {
	t.Helper()
	path := filepath.Join(root, name)
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, []byte(text), 0644); err != nil {
		t.Fatal(err)
	}
}

// TestBusinessFindings validates cross-layer problems and actionable line numbers.
func TestBusinessFindings(t *testing.T) {
	root := t.TempDir()
	write(t, root, "pom.xml", `<project><parent><artifactId>arco-business-parent</artifactId></parent>
<dependencies>
<dependency><groupId>dev.dong4j</groupId><artifactId>cubo-ssm-spring-boot-starter</artifactId></dependency>
<dependency><groupId>dev.dong4j</groupId><artifactId>cubo-rest-reactive-spring-boot-starter</artifactId></dependency>
</dependencies></project>`)
	write(t, root, "src/main/java/AccountController.java", `package com.example.account;
import dev.dong4j.zeka.demo.account.entity.po.Account;
@RestControllerWrapper("/accounts")
class AccountController {
    // @Autowired private FakeMapper ignored;
    @Autowired
    private AccountMapper mapper;
    public Account detail(Long id) { return mapper.selectById(id); }
}`)
	report, err := Scan(context.Background(), root, "lint")
	if err != nil {
		t.Fatal(err)
	}
	got := map[string]int{}
	for _, f := range report.Findings {
		got[f.Rule] = f.Line
	}
	if got["FIELD_INJECTION"] != 6 || got["CONTROLLER_DAO"] != 7 || got["CONTROLLER_PO"] != 8 {
		t.Fatalf("unexpected findings: %+v", report.Findings)
	}
	report, err = Scan(context.Background(), root, "doctor")
	if err != nil {
		t.Fatal(err)
	}
	found := map[string]bool{}
	for _, f := range report.Findings {
		found[f.Rule] = true
	}
	if !found["WEB_STACK"] || !found["PACKAGE_PREFIX"] || len(report.Dependencies) != 2 {
		t.Fatalf("missing evidence: %+v", report)
	}
}

// TestScanBoundaries checks exclusions, malformed POM errors, and cancellation.
func TestScanBoundaries(t *testing.T) {
	root := t.TempDir()
	write(t, root, "target/Broken.java", "System.out.println();")
	write(t, root, "src/main/java/Good.java", `class Good { String url = "https://example.com"; }`)
	outside := t.TempDir()
	write(t, outside, "Evil.java", "System.out.println();")
	if err := os.Symlink(outside, filepath.Join(root, "external")); err != nil {
		t.Fatal(err)
	}
	r, err := Scan(context.Background(), root, "lint")
	if err != nil || len(r.Findings) != 0 || r.FilesScanned != 1 {
		t.Fatalf("unexpected scan: %+v, %v", r, err)
	}
	for _, path := range []string{"../", outside, "external"} {
		if _, err := Resolve(root, path); err == nil {
			t.Fatalf("allowed outside workspace: %s", path)
		}
	}
	if _, err := Resolve(root, "."); err != nil {
		t.Fatal(err)
	}
	write(t, root, "pom.xml", "<project>")
	if _, err := Scan(context.Background(), root, "usage"); err == nil || !strings.Contains(err.Error(), "invalid POM") {
		t.Fatalf("expected POM error, got %v", err)
	}
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if _, err := Scan(ctx, root, "lint"); err == nil {
		t.Fatal("cancelled scan should fail")
	}
}

// TestSiblingStacks must not mistake independent reactor modules for one mixed stack.
func TestSiblingStacks(t *testing.T) {
	root := t.TempDir()
	for module, artifact := range map[string]string{"mvc": "cubo-ssm-spring-boot-starter", "flux": "cubo-rest-reactive-spring-boot-starter"} {
		write(t, root, module+"/pom.xml", "<project><dependencies><dependency><groupId>dev.dong4j</groupId><artifactId>"+artifact+"</artifactId></dependency></dependencies></project>")
	}
	r, err := Scan(context.Background(), root, "doctor")
	if err != nil {
		t.Fatal(err)
	}
	for _, f := range r.Findings {
		if f.Rule == "WEB_STACK" {
			t.Fatalf("independent modules were combined: %+v", r.Findings)
		}
	}
}
