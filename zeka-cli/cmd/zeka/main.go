// Command zeka serves offline framework knowledge and an optional MCP stdio server.
package main

import (
	"os"

	"github.com/zeka-stack/supports/zeka-cli/internal/cli"
)

// main returns meaningful exit codes to both developers and agent shell tools.
func main() {
	os.Exit(cli.Run(os.Args[1:], os.Stdout, os.Stderr))
}
