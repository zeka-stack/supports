// MCP tests use the official client to validate schemas, resources and scoped tools.
package server

import (
	"context"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/modelcontextprotocol/go-sdk/mcp"
	"github.com/zeka-stack/supports/zeka-cli/internal/knowledge"
)

func TestMCPWorkflow(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	c, err := knowledge.Load()
	if err != nil {
		t.Fatal(err)
	}
	root := t.TempDir()
	if err := os.WriteFile(filepath.Join(root, "pom.xml"), []byte("<project/>"), 0644); err != nil {
		t.Fatal(err)
	}
	s, err := New(c, root, "test")
	if err != nil {
		t.Fatal(err)
	}
	ct, st := mcp.NewInMemoryTransports()
	ss, err := s.Connect(ctx, st, nil)
	if err != nil {
		t.Fatal(err)
	}
	defer ss.Close()
	client := mcp.NewClient(&mcp.Implementation{Name: "test", Version: "1"}, nil)
	session, err := client.Connect(ctx, ct, nil)
	if err != nil {
		t.Fatal(err)
	}
	defer session.Close()
	tools, err := session.ListTools(ctx, nil)
	if err != nil || len(tools.Tools) != 9 {
		t.Fatalf("tools/list: %+v, %v", tools, err)
	}
	calls := map[string]map[string]any{
		"zeka_list": {}, "zeka_arch": {}, "zeka_demo": {},
		"zeka_doc": {"starter": "mybatis"}, "zeka_info": {"starter": "cubo-ssm-spring-boot-starter"},
		"zeka_search": {"keyword": "StringUtils", "limit": 1},
		"zeka_doctor": {"path": "."}, "zeka_usage": {"path": "."}, "zeka_lint": {"path": "."},
	}
	for name, args := range calls {
		result, err := session.CallTool(ctx, &mcp.CallToolParams{Name: name, Arguments: args})
		if err != nil || result.IsError || len(result.Content) == 0 {
			t.Fatalf("%s: %+v, %v", name, result, err)
		}
	}
	for _, path := range []string{"..", t.TempDir()} {
		result, err := session.CallTool(ctx, &mcp.CallToolParams{Name: "zeka_usage", Arguments: map[string]any{"path": path}})
		if err != nil || !result.IsError {
			t.Fatalf("outside workspace was not a tool error: %+v, %v", result, err)
		}
	}
	resource, err := session.ReadResource(ctx, &mcp.ReadResourceParams{URI: "zeka://arch.md"})
	if err != nil || len(resource.Contents) != 1 || resource.Contents[0].Text != knowledge.Architecture {
		t.Fatalf("resource mismatch: %v", err)
	}
	prompts, err := session.ListPrompts(ctx, nil)
	if err != nil || len(prompts.Prompts) != 2 {
		t.Fatalf("prompts/list: %+v, %v", prompts, err)
	}
	for name, args := range map[string]map[string]string{
		"zeka-expert":           {"task": "开发账户查询"},
		"zeka-module-generator": {"module": "账户模块"},
	} {
		prompt, err := session.GetPrompt(ctx, &mcp.GetPromptParams{Name: name, Arguments: args})
		if err != nil || len(prompt.Messages) != 2 {
			t.Fatalf("prompts/get: %+v, %v", prompt, err)
		}
	}
}
