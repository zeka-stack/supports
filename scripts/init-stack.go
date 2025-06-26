package main

import (
	"bufio"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

const (
	baseDir        = "zeka.stack"
	mavenTmpDir    = "/tmp/zeka-stack-maven-template"
	mavenGroupId   = "dev.dong4j"
	mavenVersion   = "hello.world"
	mavenFilesRepo = "https://raw.githubusercontent.com/zeka-stack/supports/main/maven/"
)

var mavenFiles = []string{
	"mvnw", "mvnw.cmd",
	".mvn/maven.config", ".mvn/jvm.config", ".mvn/zeka.stack.settings.xml",
	".mvn/wrapper/maven-wrapper.properties", ".mvn/wrapper/MavenWrapperDownloader.java",
}

func main() {
	showBanner()
	
	if len(os.Args) < 2 {
		fmt.Println("用法: init_stack <repo_list.txt>")
		os.Exit(1)
	}
	repoFile := os.Args[1]
	groups, err := parseRepoFile(repoFile)
	if err != nil {
		fmt.Printf("❌ 解析仓库列表失败: %v\n", err)
		os.Exit(1)
	}

	if err := os.MkdirAll(baseDir, 0755); err != nil {
		fmt.Printf("❌ 创建目录失败: %v\n", err)
		os.Exit(1)
	}
	if err := os.Chdir(baseDir); err != nil {
		fmt.Printf("❌ 进入目录失败: %v\n", err)
		os.Exit(1)
	}

	for group, repos := range groups {
    	if group == "" {
    		cloneRepos(".", repos)
    	} else {
    		fmt.Printf("📦 处理分组: %s\n", group)
    		os.MkdirAll(group, 0755)
    		os.Chdir(group)
    		cloneRepos(".", repos)

    		if len(repos) == 1 {
    			// 尝试修复 group/group 重复结构
    			fixSingleRepoLayout(".", repos[0])
    		}

    		if len(repos) > 1 {
    			generatePom(group, repos)
    			downloadMavenTemplate()
    			copyMavenTemplate(".")
    		}
    		os.Chdir("..")
    	}
    }

	// todo 处理单项目目录
	fmt.Println("\n✅ 所有项目克隆并处理完成。")
	fmt.Println("🧩 所有聚合 pom.xml 中的 <module> 标签默认已被注释；如需启用模块构建，请手动取消对应注释。")
}

func showBanner() {
	fmt.Println("\033[1;35m")
	fmt.Println(`                 ███████╗███████╗██╗  ██╗ █████╗       ███████╗████████╗ █████╗  ██████╗██╗  ██╗`)
	fmt.Println(`                 ╚══███╔╝██╔════╝██║ ██╔╝██╔══██╗      ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝`)
	fmt.Println(`                   ███╔╝ █████╗  █████╔╝ ███████║█████╗███████╗   ██║   ███████║██║     █████╔╝`)
	fmt.Println(`                  ███╔╝  ██╔══╝  ██╔═██╗ ██╔══██║╚════╝╚════██║   ██║   ██╔══██║██║     ██╔═██╗`)
	fmt.Println(`                 ███████╗███████╗██║  ██╗██║  ██║      ███████║   ██║   ██║  ██║╚██████╗██║  ██╗`)
	fmt.Println(`                 ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝      ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝`)
	fmt.Println("\033[0m")
	fmt.Println("                            \033[1;36m🚀 Zeka-Stack 初始化工具 - 一键克隆、多模块构建、Maven 配置集成\033[0m")
	fmt.Println()
}

func parseRepoFile(filename string) (map[string][]string, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()
	groups := make(map[string][]string)
	scanner := bufio.NewScanner(file)
	group := ""
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		if strings.HasPrefix(line, "[") && strings.HasSuffix(line, "]") {
			group = strings.Trim(line, "[]")
			continue
		}
		groups[group] = append(groups[group], line)
	}
	return groups, scanner.Err()
}

func cloneRepos(dir string, repos []string) {
	for _, repo := range repos {
		repoName := strings.TrimSuffix(filepath.Base(repo), ".git")
		if _, err := os.Stat(filepath.Join(dir, repoName)); err == nil {
			fmt.Printf("%s 已存在，跳过克隆。\n", repoName)
			continue
		}
		fmt.Printf("⬇️  克隆仓库: %s\n", repo)
		cmd := exec.Command("git", "clone", repo)
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			fmt.Printf("❌ 克隆失败: %v\n", err)
		}
	}
}

// 修正目录结构: 如果分组只有一个 git 项目, 为避免存在 2 级同名目录,需要特殊处理
func fixSingleRepoLayout(group string, repo string) {
	repoName := strings.TrimSuffix(filepath.Base(repo), ".git")
	srcPath := filepath.Join(group, repoName)

	// 如果存在重复的 group/group 结构，就进行修正
	if stat, err := os.Stat(srcPath); err == nil && stat.IsDir() {
		fmt.Printf("🛠️  修复目录结构: %s -> %s\n", srcPath, group)
		entries, _ := os.ReadDir(srcPath)
		for _, entry := range entries {
			src := filepath.Join(srcPath, entry.Name())
			dst := filepath.Join(group, entry.Name())
			_ = os.RemoveAll(dst)
			_ = os.Rename(src, dst)
		}
		_ = os.RemoveAll(srcPath)
	}
}

func generatePom(group string, repos []string) {
	pomPath := "pom.xml"
	if _, err := os.Stat(pomPath); err == nil {
		return
	}
	fmt.Printf("📦 生成聚合 pom.xml: %s\n", pomPath)
	f, err := os.Create(pomPath)
	if err != nil {
		fmt.Printf("❌ 创建 pom.xml 失败: %v\n", err)
		return
	}
	defer f.Close()
	fmt.Fprintf(f, `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>%s</groupId>
    <artifactId>%s</artifactId>
    <version>%s</version>
    <packaging>pom</packaging>

    <modules>
`, mavenGroupId, group, mavenVersion)
	for _, repo := range repos {
		name := strings.TrimSuffix(filepath.Base(repo), ".git")
		fmt.Fprintf(f, "        <!-- <module>%s</module> -->\n", name)
	}
	fmt.Fprintf(f, `    </modules>

    <properties>
        <maven.install.skip>true</maven.install.skip>
        <maven.deploy.skip>true</maven.deploy.skip>
    </properties>
</project>
`)
}

func downloadMavenTemplate() {
	if _, err := os.Stat(mavenTmpDir); err == nil {
		fmt.Println("✅ 已下载过 maven 模板，跳过重新下载")
		return
	}
	fmt.Println("⬇️  正在下载 maven 模板文件...")
	for _, file := range mavenFiles {
		dir := filepath.Dir(file)
		os.MkdirAll(filepath.Join(mavenTmpDir, dir), 0755)
		url := mavenFilesRepo + file
		target := filepath.Join(mavenTmpDir, file)
		resp, err := http.Get(url)
		if err != nil {
			fmt.Printf("❌ 下载失败: %s\n", file)
			os.Exit(1)
		}
		defer resp.Body.Close()
		out, err := os.Create(target)
		if err != nil {
			fmt.Printf("❌ 创建文件失败: %s\n", target)
			os.Exit(1)
		}
		io.Copy(out, resp.Body)
		out.Close()
	}
	fmt.Println("✅ maven 模板文件下载完成")
}

func copyMavenTemplate(dest string) {
	filepath.Walk(mavenTmpDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		rel, _ := filepath.Rel(mavenTmpDir, path)
		if rel == "." {
			return nil
		}
		target := filepath.Join(dest, rel)
		if info.IsDir() {
			os.MkdirAll(target, 0755)
		} else {
			from, _ := os.Open(path)
			defer from.Close()
			to, _ := os.Create(target)
			defer to.Close()
			io.Copy(to, from)
		}
		return nil
	})
}