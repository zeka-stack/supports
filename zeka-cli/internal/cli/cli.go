// Package cli provides a script-friendly interface without invoking Maven or a shell.
package cli

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"os"
	"os/signal"
	"path/filepath"
	"sort"
	"strconv"
	"strings"

	"github.com/modelcontextprotocol/go-sdk/mcp"
	"github.com/zeka-stack/supports/zeka-cli/internal/knowledge"
	"github.com/zeka-stack/supports/zeka-cli/internal/project"
	"github.com/zeka-stack/supports/zeka-cli/internal/server"
)

// Version is overridden by release builds; knowledge has its own framework version.
var Version = "0.1.0-dev"

const help = `zeka — Zeka Stack 离线工程知识与业务规范

  list                         starter 列表
  info <starter>               依赖、配置源码、装配入口与来源
  doc <starter>                starter SKILL.md
  arch                         arch.md 工程规范
  demo                         完整业务模块参考代码
  search <keyword>             类型/工具/方法检索 [--limit 20]
  usage|doctor|lint <dir>       只读项目扫描 [--strict]
  skills extract --dir <dir>   导出业务 Skill [--starter <name>] [--all] [--force]
  setup --client <name>        输出配置，不修改用户文件；支持 claude/cursor/vscode/codex
  mcp [--workspace <dir>]      MCP stdio 服务（项目读取限制在工作区内）
  version                      CLI 与框架快照版本

查询/扫描支持 --format json|text（结构化结果默认为 JSON，文档默认纯文本）。
退出码：0 成功，1 命令/IO 错误，2 参数错误，3 --strict 扫描有 warning。
`

// Run isolates streams so MCP stdout remains exclusively newline-delimited JSON-RPC.
func Run(args []string, out, errOut io.Writer) int {
	if len(args) == 0 || args[0] == "help" || args[0] == "--help" || args[0] == "-h" {
		fmt.Fprint(out, help)
		return 0
	}
	c, err := knowledge.Load()
	if err != nil {
		return fail(errOut, err, 1)
	}
	command := args[0]
	flags := flag.NewFlagSet(command, flag.ContinueOnError)
	flags.SetOutput(errOut)
	format := flags.String("format", "", "json or text")
	limit := flags.Int("limit", 20, "search result limit")
	dir := flags.String("dir", "", "skill output directory")
	client := flags.String("client", "", "MCP client")
	workspace := flags.String("workspace", ".", "MCP project workspace")
	starter := flags.String("starter", "", "starter to extract, including its starter dependencies")
	all := flags.Bool("all", false, "extract all starter skills (maintenance only)")
	force := flags.Bool("force", false, "replace conflicting skill content")
	strict := flags.Bool("strict", false, "exit 3 on scan warnings")
	detail := flags.Bool("detail", false, "include original property and auto-configuration source")
	// Accept flags on either side of the target, without shell expansion.
	var options, positional []string
	for i := 1; i < len(args); i++ {
		a := args[i]
		if strings.HasPrefix(a, "-") {
			options = append(options, a)
			key := strings.TrimLeft(strings.SplitN(a, "=", 2)[0], "-")
			if key != "all" && key != "force" && key != "strict" && key != "detail" && !strings.Contains(a, "=") {
				if i+1 < len(args) && !strings.HasPrefix(args[i+1], "-") {
					i++
					options = append(options, args[i])
				}
			}
		} else {
			positional = append(positional, a)
		}
	}
	if err := flags.Parse(options); err != nil {
		return 2
	}
	if *format != "" && *format != "json" && *format != "text" {
		return fail(errOut, fmt.Errorf("--format must be json or text"), 2)
	}
	required := 0
	switch command {
	case "info", "doc", "search", "skills":
		required = 1
	case "usage", "doctor", "lint":
		if len(positional) == 0 {
			positional = []string{"."}
		}
		required = 1
	}
	if len(positional) != required {
		return fail(errOut, fmt.Errorf("%s expects %d positional argument(s); use zeka help", command, required), 2)
	}
	var value any
	text := false
	switch command {
	case "version":
		value = map[string]any{"cli_version": Version, "framework_version": c.FrameworkVersion, "schema_version": c.SchemaVersion}
	case "list":
		items := []map[string]any{}
		for _, s := range c.Starters {
			items = append(items, map[string]any{"artifact_id": s.ArtifactID, "source": s.Source})
		}
		value = map[string]any{"framework_version": c.FrameworkVersion, "coverage": c.Coverage, "starters": items}
	case "info", "doc":
		s, err := c.Info(positional[0], *detail || command == "doc")
		if err != nil {
			return fail(errOut, err, 1)
		}
		value = s
		if command == "doc" {
			value, text = s.Skill, true
		}
	case "arch", "arch.md":
		value, text = knowledge.Architecture, true
	case "demo":
		value, text = knowledge.Demo, true
	case "search":
		value, err = c.Search(positional[0], *limit)
	case "usage", "doctor", "lint":
		ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
		defer cancel()
		var report project.Report
		report, err = project.Scan(ctx, positional[0], command)
		if err == nil {
			if err := printValue(out, report, *format, false); err != nil {
				return fail(errOut, err, 1)
			}
			if *strict {
				for _, f := range report.Findings {
					if f.Severity == "warning" {
						return 3
					}
				}
			}
			return 0
		}
	case "skills":
		if positional[0] != "extract" || *dir == "" {
			return fail(errOut, fmt.Errorf("use skills extract --dir <directory> [--starter <name>]"), 2)
		}
		value, err = extract(c, *dir, *starter, *all, *force)
	case "setup":
		value, err = setup(*client, *workspace)
		text = true
	case "mcp":
		if out != os.Stdout {
			return fail(errOut, fmt.Errorf("MCP transport must use process stdin/stdout"), 1)
		}
		var s *mcp.Server
		s, err = server.New(c, *workspace, Version)
		if err == nil {
			ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
			defer cancel()
			err = s.Run(ctx, &mcp.StdioTransport{})
			if err == nil {
				return 0
			}
		}
	default:
		return fail(errOut, fmt.Errorf("unknown command %q; use zeka help", command), 2)
	}
	if err != nil {
		return fail(errOut, err, 1)
	}
	if err := printValue(out, value, *format, text); err != nil {
		return fail(errOut, err, 1)
	}
	return 0
}

// printValue keeps documents directly pipeable while other responses use stable JSON.
func printValue(out io.Writer, value any, format string, document bool) error {
	if s, ok := value.(string); ok && format != "json" && (document || format == "text") {
		_, err := fmt.Fprintln(out, strings.TrimSuffix(s, "\n"))
		return err
	}
	encoder := json.NewEncoder(out)
	encoder.SetIndent("", "  ")
	encoder.SetEscapeHTML(false)
	return encoder.Encode(value)
}

func fail(out io.Writer, err error, code int) int {
	_ = json.NewEncoder(out).Encode(map[string]any{"error": err.Error(), "exit_code": code})
	return code
}

// setup outputs concrete configuration and deliberately leaves installation to the user.
func setup(client, workspace string) (string, error) {
	if client != "codex" && client != "claude" && client != "cursor" && client != "vscode" {
		return "", fmt.Errorf("--client must be codex, claude, cursor or vscode")
	}
	root, err := project.Resolve(workspace, ".")
	if err != nil {
		return "", err
	}
	executable, err := os.Executable()
	if err != nil {
		return "", err
	}
	args := []string{"mcp", "--workspace", root}
	if client == "codex" {
		return fmt.Sprintf("[mcp_servers.zeka]\ncommand = %s\nargs = [\"mcp\", \"--workspace\", %s]\n",
			strconv.Quote(executable), strconv.Quote(root)), nil
	}
	key := "mcpServers"
	entry := map[string]any{"command": executable, "args": args}
	if client == "vscode" {
		key = "servers"
		entry["type"] = "stdio"
	}
	data, err := json.MarshalIndent(map[string]any{key: map[string]any{"zeka": entry}}, "", "  ")
	return string(data), err
}

// extract only exports selected knowledge; it preflights conflicts before writing any file.
func extract(c *knowledge.Catalog, directory, selected string, all, force bool) ([]string, error) {
	if all && selected != "" {
		return nil, fmt.Errorf("--all and --starter cannot be combined")
	}
	skills := map[string]string{"zeka-stack-business-dev": c.BusinessSkill}
	if all {
		for _, s := range c.Starters {
			skills[s.ArtifactID] = s.Skill
		}
	} else if selected != "" {
		s, err := c.Find(selected)
		if err != nil {
			return nil, err
		}
		for _, module := range s.Modules {
			for _, child := range c.Starters {
				if child.ArtifactID == module {
					skills[module] = child.Skill
				}
			}
		}
	}
	if err := os.MkdirAll(directory, 0755); err != nil {
		return nil, err
	}
	root, err := filepath.Abs(directory)
	if err != nil {
		return nil, err
	}
	var names []string
	for name := range skills {
		names = append(names, name)
	}
	sort.Strings(names)
	var paths []string
	for _, name := range names {
		child := filepath.Join(root, name)
		info, err := os.Lstat(child)
		if err == nil && (!info.IsDir() || info.Mode()&os.ModeSymlink != 0) {
			return nil, fmt.Errorf("refuse non-directory or symlink skill path: %s", child)
		}
		if err != nil && !os.IsNotExist(err) {
			return nil, err
		}
		path := filepath.Join(child, "SKILL.md")
		info, err = os.Lstat(path)
		if err == nil && !info.Mode().IsRegular() {
			return nil, fmt.Errorf("refuse non-regular skill file: %s", path)
		}
		old, err := os.ReadFile(path)
		if err != nil && !os.IsNotExist(err) {
			return nil, err
		}
		if err == nil && string(old) != skills[name] && !force {
			return nil, fmt.Errorf("different skill exists: %s; review before using --force", path)
		}
		paths = append(paths, path)
	}
	for i, name := range names {
		path := paths[i]
		if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
			return nil, err
		}
		if old, err := os.ReadFile(path); err == nil && string(old) == skills[name] {
			continue
		}
		tmp, err := os.CreateTemp(filepath.Dir(path), ".zeka-skill-*")
		if err != nil {
			return nil, err
		}
		_, writeErr := tmp.WriteString(skills[name])
		closeErr := tmp.Close()
		if writeErr == nil {
			writeErr = closeErr
		}
		if writeErr == nil {
			writeErr = os.Rename(tmp.Name(), path)
		}
		if writeErr != nil {
			_ = os.Remove(tmp.Name())
			return nil, writeErr
		}
	}
	return paths, nil
}
