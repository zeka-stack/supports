// Knowledge contract tests catch missing components and stale or incomplete snapshots.
package knowledge

import (
	"strings"
	"testing"
)

func TestCatalogContract(t *testing.T) {
	c, err := Load()
	if err != nil {
		t.Fatal(err)
	}
	if len(c.Starters) != 15 || c.FrameworkVersion == "hello.world" {
		t.Fatalf("invalid snapshot: %s, %d starters", c.FrameworkVersion, len(c.Starters))
	}
	for _, s := range c.Starters {
		if len(s.Configurations) == 0 || len(s.AutoConfiguration) == 0 || !strings.Contains(s.Skill, "name: "+s.ArtifactID) {
			t.Errorf("missing component context: %s", s.ArtifactID)
		}
		for _, configuration := range s.AutoConfiguration {
			if len(configuration.Classes) == 0 {
				t.Errorf("missing configuration declarations in %s", configuration.Source.Path)
			}
		}
	}
	ssm, err := c.Find("cubo-ssm-spring-boot-starter")
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(strings.Join(ssm.Modules, " "), "cubo-rest-spring-boot-autoconfigure") {
		t.Fatal("local inherited dependencies were not indexed")
	}
	compact, err := c.Info("cubo-ssm-spring-boot-starter", false)
	if err != nil || compact.Skill != "" || compact.Configurations[0].SourceText != "" {
		t.Fatal("compact info unexpectedly contains full source")
	}
	full, err := c.Info("cubo-ssm-spring-boot-starter", true)
	if err != nil || full.Skill == "" || full.Configurations[0].SourceText == "" {
		t.Fatal("compact query modified the shared knowledge")
	}
	if _, err := c.Find("rest"); err == nil {
		t.Fatal("ambiguous starter must not silently pick Servlet or Reactive")
	}
	types, err := c.Search("StringUtils", 5)
	if err != nil || len(types) == 0 || types[0].Name != "StringUtils" ||
		!strings.Contains(strings.Join(types[0].Methods, " "), "isBlank") {
		t.Fatalf("incomplete utility search: %v, %v", types, err)
	}
	for _, n := range []string{"BaseDao", "ExtendConverter", "DictionaryService", "MessagingTemplate"} {
		found, err := c.Search(n, 1)
		if err != nil || len(found) != 1 || found[0].Name != n || len(found[0].Methods) == 0 {
			t.Fatalf("missing public API %s: %+v, %v", n, found, err)
		}
	}
}
