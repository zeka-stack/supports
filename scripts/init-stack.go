// main.go
package main

import (
	"bufio"
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

var (
	baseDir       = "zeka.stack"
	reposFile     = "repos.txt"
	reposURL      = "https://raw.githubusercontent.com/zeka-stack/supports/main/scripts/repos.txt"
	mavenTmpDir   = "/tmp/zeka-stack-maven-template"
	groupID       = "dev.dong4j"
	version       = "hello.world"
	mavenFiles    = []string{
		"mvnw",
		"mvnw.cmd",
		".mvn/maven.config",
		".mvn/jvm.config",
		".mvn/zeka.stack.settings.xml",
		".mvn/wrapper/maven-wrapper.properties",
		".mvn/wrapper/MavenWrapperDownloader.java",
	}
)

func main() {
	showBanner()

	checkCommands("git", "curl")
	repoGroups, err := loadRepos()
	if err != nil {
		die("加载 repos.txt 失败: %v", err)
	}

	downloadMavenTemplate()
	os.MkdirAll(baseDir, 0755)
	os.Chdir(baseDir)

	for group, repos := range repoGroups {
		buildGroup(group, repos)
	}

	generateRootPom(repoGroups)
	fmt.Println("\033[1;32m✅ 所有项目克隆并处理完成。\033[0m")
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
	fmt.Println("                        \033[1;36m🚀 Zeka-Stack 初始化工具 - 一键克隆、多模块构建、Maven 配置集成\033[0m")
	fmt.Println()
}

func checkCommands(cmds ...string) {
	for _, cmd := range cmds {
		if _, err := exec.LookPath(cmd); err != nil {
			die("依赖缺失: %s", cmd)
		}
	}
}

func loadRepos() (map[string][]string, error) {
	if _, err := os.Stat(reposFile); os.IsNotExist(err) {
		fmt.Println("📥 下载 repos.txt...")
		resp, err := http.Get(reposURL)
		if err != nil {
			return nil, err
		}
		defer resp.Body.Close()
		b, _ := io.ReadAll(resp.Body)
		ioutil.WriteFile(reposFile, b, 0644)
	}

	file, err := os.Open(reposFile)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	repoGroups := make(map[string][]string)
	var group string
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		if strings.HasPrefix(line, "[") && strings.HasSuffix(line, "]") {
			group = line[1 : len(line)-1]
			continue
		}
		repoGroups[group] = append(repoGroups[group], line)
	}
	return repoGroups, nil
}

func downloadMavenTemplate() {
	if _, err := os.Stat(mavenTmpDir); err == nil {
		fmt.Println("✅ maven 模板已存在，跳过下载")
		return
	}

	fmt.Println("⬇️  正在下载 maven 模板...")
	for _, file := range mavenFiles {
		url := "https://ghfast.top/https://raw.githubusercontent.com/zeka-stack/supports/refs/heads/main/maven/" + file
		path := filepath.Join(mavenTmpDir, file)
		os.MkdirAll(filepath.Dir(path), 0755)
		resp, err := http.Get(url)
		if err != nil {
			die("下载失败: %s", file)
		}
		defer resp.Body.Close()
		b, _ := io.ReadAll(resp.Body)
		ioutil.WriteFile(path, b, 0644)
		fmt.Println("下载", file)
	}
	fmt.Println("✅ 下载完成")
}

func buildGroup(group string, repos []string) {
	if group == "" {
		cloneRepos(repos)
		return
	}
	os.MkdirAll(group, 0755)
	os.Chdir(group)
	cloneRepos(repos)
	if len(repos) == 1 {
		fixSingleRepoLayout(group, repos[0])
	}
	generatePom(group, repos)
	os.Chdir("..")
}

func cloneRepos(repos []string) {
	for _, repo := range repos {
		name := strings.TrimSuffix(filepath.Base(repo), ".git")
		if _, err := os.Stat(name); err == nil {
			fmt.Printf("⚠️  %s 已存在，跳过\n", name)
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

func fixSingleRepoLayout(group, repo string) {
	name := strings.TrimSuffix(filepath.Base(repo), ".git")
	if name != group {
		return
	}
	fmt.Printf("🛠️  修复目录结构: 将 ./%s/%s 提升至 ./%s\n", group, name, group)
	src := filepath.Join(name)
	dst := "."
	entries, _ := ioutil.ReadDir(src)
	for _, entry := range entries {
		srcPath := filepath.Join(src, entry.Name())
		dstPath := filepath.Join(dst, entry.Name())

		// 判断目标文件是否已经存在
		if _, err := os.Stat(dstPath); err == nil {
			fmt.Printf("⚠️  文件 %s 已存在，跳过移动\n", dstPath)
			continue
		}

		// 移动文件/目录
		if err := os.Rename(srcPath, dstPath); err != nil {
			fmt.Fprintf(os.Stderr, "❌ 移动文件失败: %v\n", err)
		}
	}
	os.RemoveAll(src)
}

func generatePom(group string, repos []string) {
	if len(repos) <= 1 {
		return
	}
	f, err := os.Create("pom.xml")
	if err != nil {
		die("生成 pom.xml 失败: %v", err)
	}
	defer f.Close()

	var buffer bytes.Buffer
	buffer.WriteString(`<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>` + groupID + `</groupId>
    <artifactId>` + group + `</artifactId>
    <version>` + version + `</version>
    <packaging>pom</packaging>
    <modules>
`)
	for _, repo := range repos {
		name := strings.TrimSuffix(filepath.Base(repo), ".git")
		buffer.WriteString("        <!-- <module>" + name + "</module> -->\n")
	}
	buffer.WriteString(`    </modules>
    <properties>
        <maven.install.skip>true</maven.install.skip>
        <maven.deploy.skip>true</maven.deploy.skip>
    </properties>
</project>
`)
	f.Write(buffer.Bytes())
	copyMavenTemplate()
}

func generateRootPom(groups map[string][]string) {
	if _, err := os.Stat("pom.xml"); err == nil {
		fmt.Println("⚠️  根 pom.xml 已存在，跳过生成")
		return
	}
	f, err := os.Create("pom.xml")
	if err != nil {
		die("生成根 pom.xml 失败: %v", err)
	}
	defer f.Close()
	buffer := &bytes.Buffer{}
	buffer.WriteString(`<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>` + groupID + `</groupId>
    <artifactId>zeka.stack</artifactId>
    <version>` + version + `</version>
    <packaging>pom</packaging>
    <modules>
`)
	for group := range groups {
		buffer.WriteString("        <module>" + group + "</module>\n")
	}
	buffer.WriteString(`    </modules>
    <properties>
        <maven.install.skip>true</maven.install.skip>
        <maven.deploy.skip>true</maven.deploy.skip>
    </properties>
</project>
`)
	f.Write(buffer.Bytes())
	copyMavenTemplate()
}

func copyMavenTemplate() {
	fileList := mavenFiles
	for _, file := range fileList {
		src := filepath.Join(mavenTmpDir, file)
		dst := file
		os.MkdirAll(filepath.Dir(dst), 0755)
		b, _ := ioutil.ReadFile(src)
		ioutil.WriteFile(dst, b, 0644)
	}
	ioutil.WriteFile(".maven-copied", []byte(""), 0644)
}

func die(format string, args ...interface{}) {
	fmt.Fprintf(os.Stderr, "❌ "+format+"\n", args...)
	os.Exit(1)
}