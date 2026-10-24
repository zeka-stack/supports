#!/usr/bin/env python3
"""Audit source documentation contracts with explicit, bounded checks.

This is a mechanical consistency check, not a claim that all prose was reviewed.
It reads every inventoried Java/Markdown/POM and reports framework import errors,
known invalid examples and starter Skill coverage. Historical plans are not API docs.
"""

from collections import Counter
import json
from pathlib import Path
import re
import sys

from generate import ROOT, files, stripped


def main():
    """Return machine-readable evidence and fail on known API contradictions."""
    paths = list(files())
    actual = set()
    for p in paths:
        if p.suffix != ".java":
            continue
        package = re.search(r"^\s*package\s+([\w.]+);", stripped(p.read_text()), re.M)
        if package:
            actual.add(package[1] + "." + p.stem)
    bad_imports, invalid_examples, style_candidates = [], [], []
    per_root = Counter()
    known_invalid = [
        ("RESULT_FACTORY", re.compile(r"\bResult\.(?:success|fail|error)\s*\(")),
        ("MESSAGING_TOPICS", re.compile(r"@MessagingListener\s*\([^)]*\btopics\s*=")),
        ("MESSAGING_SEND", re.compile(r"\bmessagingTemplate\.send\s*\(")),
        ("FICTIONAL_SERIALIZER", re.compile(r"\bimplements\s+MessageSerializer\b")),
        ("CUSTOM_WRAPPER", re.compile(r"\bclass\s+ApiResponse\b")),
    ]
    for p in paths:
        per_root[p.relative_to(ROOT).parts[0]] += 1
        if p.suffix != ".md" or any(x in p.parts for x in ["plans", "rollout_summaries"]):
            continue
        # Synchronized site copies are validated via site build, not counted twice here.
        if p.relative_to(ROOT).parts[0] == "zeka-stack.github.io":
            continue
        text = p.read_text()
        for m in re.finditer(r"^import\s+(dev\.dong4j\.zeka\.(?:kernel|starter)\.[\w.]+);", text, re.M):
            if m[1] not in actual:
                bad_imports.append({"file": str(p.relative_to(ROOT)),
                                    "line": text[:m.start()].count("\n") + 1,
                                    "type": m[1]})
        for block in re.finditer(r"```java[^\n]*\n([\s\S]*?)```", text):
            code = stripped(block[1])
            base = text[:block.start(1)].count("\n") + 1
            for rule, pattern in known_invalid:
                for m in pattern.finditer(code):
                    invalid_examples.append({"rule": rule, "file": str(p.relative_to(ROOT)),
                                             "line": base + code[:m.start()].count("\n")})
            for m in re.finditer(r"@Autowired\s+(?:private|protected)\s+\w+\s+\w+\s*;", code):
                style_candidates.append({"file": str(p.relative_to(ROOT)),
                                         "line": base + code[:m.start()].count("\n"),
                                         "reason": "Legacy/tutorial field injection; review context before changing mechanism examples"})
    catalog = json.loads((Path(__file__).resolve().parents[1] /
                          "internal/knowledge/assets/metadata.json").read_text())
    result = {"scope": "Mechanical import/example/coverage checks; runtime and semantic prose audit excluded",
              "inventoried_files": len(paths), "files_by_root": dict(sorted(per_root.items())),
              "starter_skills": len(catalog["starters"]), "public_types": len(catalog["types"]),
              "missing_framework_imports": bad_imports, "invalid_examples": invalid_examples,
              "legacy_style_candidates": style_candidates}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 1 if bad_imports or invalid_examples else 0


if __name__ == "__main__":
    sys.exit(main())
