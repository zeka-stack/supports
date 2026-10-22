#!/usr/bin/env python3
"""Build deterministic offline knowledge from maintained source, never target output.

Run inside a full Zeka Stack checkout. --check detects stale generated assets.
Java extraction is a searchable declaration index, not a semantic Java parser.
"""

import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET

CLI = Path(__file__).resolve().parents[1]
ROOT = CLI.parents[1]
NS = {"m": "http://maven.apache.org/POM/4.0.0"}
SKIP = {".git", "target", "node_modules", ".vitepress", "bin", "__pycache__",
        ".idea", ".cursor", ".claude", ".codex", "dist", "build", ".venv"}
ROOTS = ["arco-meta", "blen-kernel", "cubo-starter", "cubo-starter-examples",
         "domi-suite", "eiko-orch", "felo-space", "supports",
         "zeka-idea-plugin", "zeka-stack.github.io", "docs"]
PUBLIC_ROOTS = set(ROOTS[:3] + ["domi-suite", "eiko-orch", "felo-space"])


def source(path):
    """Use content hashes rather than timestamps so regeneration is reproducible."""
    return {"path": path.relative_to(ROOT).as_posix(),
            "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}


def files():
    """Inventory initialized first-party files without following directory symlinks."""
    for p in sorted(ROOT.iterdir()):
        if p.is_file() and p.suffix in {".md", ".xml", ".yml", ".yaml", ".sh"}:
            yield p
    for name in ROOTS:
        for directory, dirs, names in os.walk(ROOT / name, followlinks=False):
            dirs[:] = sorted(d for d in dirs if d not in SKIP and not d.startswith(".")
                             and not (Path(directory) / d).is_symlink())
            for name in sorted(names):
                p = Path(directory) / name
                if p.is_symlink() or "{{" in str(p):
                    continue
                # Generated copies have their original sources elsewhere.
                rel = p.relative_to(ROOT).as_posix()
                if rel.startswith(("supports/zeka-cli/internal/knowledge/assets/",
                                   "zeka-stack.github.io/public/")):
                    continue
                if p.suffix in {".java", ".md", ".xml", ".vm", ".yml", ".yaml",
                                ".go", ".py", ".js", ".ts", ".sh"}:
                    yield p


def stripped(text):
    """Preserve Java literals (including URLs/text blocks) while removing comments."""
    tokens = re.compile(
        r'("""[\s\S]*?"""|"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')'
        r'|(/\*[\s\S]*?\*/|//[^\n]*)')
    return tokens.sub(lambda m: "\n" * m[2].count("\n") if m[2] else m[0], text)


def java_type(p, text):
    """Index a public top-level type and literal method declarations with provenance."""
    body = stripped(text)
    package = re.search(r"^\s*package\s+([\w.]+);", body, re.M)
    declaration = re.search(r"\bpublic\s+(?:(?:abstract|final|sealed)\s+)*"
                            r"(?:class|interface|enum|record|@interface)\s+"
                            + re.escape(p.stem) + r"\b", body)
    if not package or not declaration:
        return None
    prefix = text[:text.find(declaration.group())] if declaration.group() in text else text
    comments = re.findall(r"/\*\*([\s\S]*?)\*/", prefix)
    summary = re.sub(r"<[^>]*>|\s*\*\s?", " ", comments[-1] if comments else "")
    summary = re.split(r"@(?:author|param|since|version)", summary)[0]
    methods = []
    for m in re.finditer(r"^\s*(?:public\s+|protected\s+|default\s+|static\s+)*"
                         r"(?:<[\w ,?]+>\s+)?[\w.$<>?, \[\]@]+\s+\w+\s*"
                         r"\([^;{}]*\)(?:\s*throws\s+[\w., ]+)?\s*[;{]", body, re.M):
        signature = " ".join(m.group().rstrip(";{ \n").split())
        if not signature.startswith(("return ", "throw ", "if ", "for ", "while ", "switch ")):
            methods.append(signature)
    return {"name": p.stem, "qualified_name": package[1] + "." + p.stem,
            "summary": " ".join(summary.split())[:500], "methods": methods,
            "line": body[:declaration.start()].count("\n") + 1, "source": source(p)}


def build():
    """Resolve local Maven relationships, then attach component sources and skills."""
    inventory, types, modules = [], [], {}
    for p in files():
        item = source(p)
        item["kind"] = p.suffix.lstrip(".")
        inventory.append(item)
        if p.suffix == ".java" and p.relative_to(ROOT).parts[0] in PUBLIC_ROOTS \
                and "/src/main/java/" in str(p):
            t = java_type(p, p.read_text())
            if t:
                types.append(t)
        if p.name != "pom.xml":
            continue
        r = ET.parse(p).getroot()
        artifact = r.findtext("m:artifactId", namespaces=NS)
        if not artifact:
            continue
        deps = [{"group_id": d.findtext("m:groupId", "", NS),
                 "artifact_id": d.findtext("m:artifactId", "", NS),
                 "version": d.findtext("m:version", "", NS),
                 "scope": d.findtext("m:scope", "compile", NS)}
                for d in r.findall("m:dependencies/m:dependency", NS)]
        if p.relative_to(ROOT).parts[0] == "cubo-starter":
            modules[artifact] = {"artifact_id": artifact, "dependencies": deps,
                                 "parent_artifact_id": r.findtext("m:parent/m:artifactId", "", NS),
                                 "packaging": r.findtext("m:packaging", "jar", NS),
                                 "source": source(p), "dir": p.parent}
    def inherited_dependencies(artifact, seen=None):
        """Follow local POM inheritance without pretending to resolve Maven profiles."""
        seen = set() if seen is None else seen
        if artifact in seen or artifact not in modules:
            return []
        seen.add(artifact)
        module = modules[artifact]
        return module["dependencies"] + inherited_dependencies(module["parent_artifact_id"], seen)

    starters = []
    for name, module in sorted(modules.items()):
        if not name.endswith("-starter") or module["packaging"] == "pom":
            continue
        skill = module["dir"] / "skills" / name / "SKILL.md"
        if not skill.exists():
            raise ValueError(f"missing starter skill: {skill}")
        content = skill.read_text()
        if not content.startswith(f"---\nname: {name}\n") or "allowed-tools:" in content:
            raise ValueError(f"invalid starter skill: {skill}")
        visited = set()

        def walk(artifact):
            if artifact in visited or artifact not in modules:
                return
            visited.add(artifact)
            for d in inherited_dependencies(artifact):
                if d["scope"] not in {"test", "provided"} and d["group_id"] == "dev.dong4j":
                    walk(d["artifact_id"])

        walk(name)
        configurations, autoconfig = [], []
        for artifact in sorted(visited):
            directory = modules[artifact]["dir"]
            # Only source belonging to this module, not nested sibling modules.
            for p in sorted((directory / "src/main").rglob("*")):
                if not p.is_file():
                    continue
                if p.name == "org.springframework.boot.autoconfigure.AutoConfiguration.imports":
                    autoconfig.append({"source": source(p), "classes": [
                        l.strip() for l in p.read_text().splitlines()
                        if l.strip() and not l.strip().startswith("#")],
                        "origin": "source-descriptor"})
                if p.suffix == ".java":
                    text = p.read_text()
                    code = stripped(text)
                    if "@ConfigurationProperties(" in code:
                        binding = re.search(r"@ConfigurationProperties\(([^)]*)\)", code)
                        declarations = re.findall(
                            r"^\s*(?:private|protected)\s+(?!static\b)[^;\n]+;", code, re.M)
                        configurations.append({"class": p.stem, "source": source(p),
                                               "binding_expression": binding[1].strip(),
                                               "declarations": [d.strip() for d in declarations],
                                               "source_text": text})
                    if re.search(r"@AutoConfiguration\b", code):
                        package = re.search(r"package\s+([\w.]+);", code)[1]
                        # Annotation processors generate import files at compile time.
                        # Record annotation evidence rather than reading stale target files.
                        classes = []
                        # `Foo.class` literals inside annotation attributes must not be
                        # mistaken for the declaration; a real declaration never follows a dot.
                        for match in re.finditer(
                                r"@AutoConfiguration\b[\s\S]*?(?<![.\w])class\s+(\w+)", code):
                            name = match[1]
                            classes.append(package + "." + p.stem +
                                           (("$" + name) if name != p.stem else ""))
                        if not classes:
                            raise ValueError(f"no class declaration found after @AutoConfiguration in {p}")
                        autoconfig.append({"source": source(p), "classes": classes,
                                           "origin": "source-annotation",
                                           "source_text": text})
        starters.append({k: v for k, v in module.items() if k != "dir"} | {
            "skill": content, "skill_source": source(skill),
            "modules": sorted(visited), "configurations": configurations,
            "auto_configuration": autoconfig})
    # The root aggregator uses the placeholder "hello.world", not the framework version.
    pom = ET.parse(ROOT / "arco-meta/arco-supreme/pom.xml").getroot()
    version = pom.findtext("m:properties/m:global.version", "", NS)
    if not version or "${" in version:
        raise ValueError("framework global.version must be explicit")
    counts = {k: sum(i["kind"] == k for i in inventory)
              for k in sorted({i["kind"] for i in inventory})}
    business = ROOT / "supports/skills/zeka-stack-business-dev/SKILL.md"
    metadata = {"schema_version": 1, "framework_version": version,
                "scope": "Current source snapshot; no historical-version compatibility claim.",
                "coverage": counts, "starters": starters,
                "types": sorted(types, key=lambda t: t["qualified_name"]),
                "architecture_source": source(ROOT / "arch.md"),
                "demo_source": source(CLI / "examples/account.md"),
                "business_skill": business.read_text(),
                "business_skill_source": source(business)}
    return metadata, inventory


def main():
    """Publish all generated copies atomically per file, or check without writes."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    metadata, inventory = build()
    assets = CLI / "internal/knowledge/assets"
    arch = (ROOT / "arch.md").read_bytes()
    demo = (CLI / "examples/account.md").read_bytes()
    encode = lambda obj: (json.dumps(obj, ensure_ascii=False, indent=2) + "\n").encode()
    outputs = {
        assets / "metadata.json": encode(metadata),
        CLI / "inventory.json": encode({"schema_version": 1, "files": inventory}),
        assets / "arch.md": arch,
        assets / "demo.md": demo,
        ROOT / "zeka-stack.github.io/public/arch.md": arch,
        ROOT / "zeka-stack.github.io/public/SKILL.md": metadata["business_skill"].encode(),
        ROOT / "zeka-stack.github.io/public/zeka-demo.md": demo,
        # The LLM plugin emits directory index pages as ai.md; keep an explicit alias.
        # VitePress also treats public/*.md as pages, so sibling-relative links would be
        # reported as dead links there; rewrite them to canonical site URLs.
        ROOT / "zeka-stack.github.io/public/ai/index.md":
            re.sub(r"\]\(\./([\w.-]+)\)", r"](https://zekastack.dong4j.site/docs/ai/\1)",
                   (ROOT / "zeka-stack.github.io/ai/index.md").read_text()).encode(),
    }
    skill_index = ["# Zeka Stack Starter Skills", "",
                   "> Current 3.0.0-SNAPSHOT source snapshot. Select actual dependencies.", ""]
    for starter in metadata["starters"]:
        name = starter["artifact_id"]
        outputs[ROOT / f"zeka-stack.github.io/public/skills/{name}/SKILL.md"] = starter["skill"].encode()
        skill_index.append(f"- [{name}](https://zekastack.dong4j.site/docs/skills/{name}/SKILL.md)")
    outputs[ROOT / "zeka-stack.github.io/public/skills/llms.txt"] = ("\n".join(skill_index) + "\n").encode()
    stale = []
    for path, content in outputs.items():
        if not path.exists() or path.read_bytes() != content:
            stale.append(str(path.relative_to(ROOT)))
            if not args.check:
                path.parent.mkdir(parents=True, exist_ok=True)
                temp = path.with_suffix(path.suffix + ".tmp")
                temp.write_bytes(content)
                temp.replace(path)
    if stale and args.check:
        print("Stale generated assets:\n" + "\n".join(stale), file=sys.stderr)
        return 1
    print(json.dumps({"starters": len(metadata["starters"]),
                      "types": len(metadata["types"]), "coverage": metadata["coverage"],
                      "updated": len(stale)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
