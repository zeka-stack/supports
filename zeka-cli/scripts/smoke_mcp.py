#!/usr/bin/env python3
"""Exercise real stdio framing and project boundaries without third-party Python packages."""

import json
from pathlib import Path
import select
import subprocess
import sys
import tempfile


def main():
    """Verify a compiled binary, leaving the user's project and client configs untouched."""
    if len(sys.argv) != 2:
        raise SystemExit("usage: smoke_mcp.py <zeka-binary>")
    binary = str(Path(sys.argv[1]).resolve())
    with tempfile.TemporaryDirectory(prefix="zeka-smoke-") as workspace, \
            tempfile.TemporaryFile() as stderr:
        Path(workspace, "pom.xml").write_text("<project/>")
        process = subprocess.Popen([binary, "mcp", "--workspace", workspace],
                                   stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                   stderr=stderr)
        sequence = 0

        def send(method, params=None, notification=False):
            nonlocal sequence
            sequence += 1
            request = {"jsonrpc": "2.0", "method": method}
            if not notification:
                request["id"] = sequence
            if params is not None:
                request["params"] = params
            process.stdin.write((json.dumps(request) + "\n").encode())
            process.stdin.flush()
            if notification:
                return None
            if not select.select([process.stdout], [], [], 15)[0]:
                raise RuntimeError(f"timeout waiting for {method}")
            response = json.loads(process.stdout.readline())
            if response.get("id") != sequence or "error" in response:
                raise RuntimeError(f"invalid {method} response: {response}")
            return response["result"]

        try:
            initialized = send("initialize", {"protocolVersion": "2025-06-18",
                "capabilities": {}, "clientInfo": {"name": "zeka-smoke", "version": "1"}})
            assert initialized["serverInfo"]["name"] == "zeka"
            send("notifications/initialized", notification=True)
            tools = send("tools/list")["tools"]
            assert len(tools) == 9
            result = send("tools/call", {"name": "zeka_search",
                "arguments": {"keyword": "BaseDao", "limit": 1}})
            assert not result.get("isError")
            assert "BaseDao" in json.dumps(result)
            result = send("tools/call", {"name": "zeka_usage", "arguments": {"path": "."}})
            assert not result.get("isError")
            result = send("tools/call", {"name": "zeka_usage", "arguments": {"path": ".."}})
            assert result["isError"]
            resource = send("resources/read", {"uri": "zeka://arch.md"})
            assert "BaseService" in resource["contents"][0]["text"]
            assert len(send("prompts/list")["prompts"]) == 2
            prompt = send("prompts/get", {"name": "zeka-module-generator",
                                         "arguments": {"module": "account"}})
            assert len(prompt["messages"]) == 2
            process.stdin.close()
            code = process.wait(timeout=10)
            stderr.seek(0)
            errors = stderr.read().decode()
            assert code == 0, (code, errors)
            assert not errors, errors
            print(json.dumps({"status": "passed", "transport": "stdio", "tools": 9,
                              "prompts": 2, "workspace_boundary": "enforced"}))
        finally:
            if process.poll() is None:
                process.kill()
                process.wait(timeout=5)


if __name__ == "__main__":
    main()
