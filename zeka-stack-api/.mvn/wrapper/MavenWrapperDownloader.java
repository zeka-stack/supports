/*
 * Copyright 2007-present the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import java.net.*;
import java.io.*;
import java.nio.channels.*;
import java.util.Properties;

/**
 * Maven 包装器下载器类
 * <p> 用于从指定 URL 下载 Maven 包装器 JAR 文件, 并将其保存到项目目录中的指定路径. 该类支持从项目根目录下的 <code>.mvn/wrapper/maven-wrapper.properties</code> 文件中读取自定义下载地址,
 * 若文件不存在则使用默认地址. 下载完成后, 可被 Maven 项目用于确保使用指定版本的 Maven 运行时.</p>
 * <p> 支持通过环境变量 <code>MVNW_USERNAME</code> 和 <code>MVNW_PASSWORD</code> 进行 HTTP 认证, 适用于私有仓库下载场景.</p>
 * <p> 该类通常作为 Maven 项目初始化脚本的一部分, 确保项目在没有全局安装 Maven 的情况下仍能正确构建.</p>
 *
 * @author dong4j
 * @version 1.0.0
 * @email "mailto:dong4j@gmail.com"
 * @date 2026.01.23
 * @since 1.0.0
 */
public class MavenWrapperDownloader {

    /** Maven Wrapper 版本号, 用于构建时指定下载的 wrapper.jar 版本 */
    private static final String WRAPPER_VERSION = "0.5.6";
    /**
     * Default URL to download the maven-wrapper.jar from, if no 'downloadUrl' is provided.
     */
    private static final String DEFAULT_DOWNLOAD_URL = "https://repo.maven.apache.org/maven2/io/takari/maven-wrapper/"
        + WRAPPER_VERSION + "/maven-wrapper-" + WRAPPER_VERSION + ".jar";

    /**
     * Path to the maven-wrapper.properties file, which might contain a downloadUrl property to
     * use instead of the default one.
     */
    private static final String MAVEN_WRAPPER_PROPERTIES_PATH =
        ".mvn/wrapper/maven-wrapper.properties";

    /**
     * Path where the maven-wrapper.jar will be saved to.
     */
    private static final String MAVEN_WRAPPER_JAR_PATH =
        ".mvn/wrapper/maven-wrapper.jar";

    /**
     * Name of the property which should be used to override the default download url for the wrapper.
     */
    private static final String PROPERTY_NAME_WRAPPER_URL = "wrapperUrl";

    /**
     * 启动 Maven 包装器下载器
     * <p> 从命令行参数指定的基目录开始, 加载 Maven 包装器配置文件 (如果存在), 并根据配置下载对应的 maven-wrapper.jar 文件.
     * 若配置文件不存在, 则使用默认下载地址. 下载完成后退出程序 (成功时返回 0, 失败时返回 1).
     *
     * @param args 命令行参数, 第一个参数为基目录路径
     */
    public static void main(String args[]) {
        System.out.println("- Downloader started");
        File baseDirectory = new File(args[0]);
        System.out.println("- Using base directory: " + baseDirectory.getAbsolutePath());

        // If the maven-wrapper.properties exists, read it and check if it contains a custom
        // wrapperUrl parameter.
        File mavenWrapperPropertyFile = new File(baseDirectory, MAVEN_WRAPPER_PROPERTIES_PATH);
        String url = DEFAULT_DOWNLOAD_URL;
        if (mavenWrapperPropertyFile.exists()) {
            FileInputStream mavenWrapperPropertyFileInputStream = null;
            try {
                mavenWrapperPropertyFileInputStream = new FileInputStream(mavenWrapperPropertyFile);
                Properties mavenWrapperProperties = new Properties();
                mavenWrapperProperties.load(mavenWrapperPropertyFileInputStream);
                url = mavenWrapperProperties.getProperty(PROPERTY_NAME_WRAPPER_URL, url);
            } catch (IOException e) {
                System.out.println("- ERROR loading '" + MAVEN_WRAPPER_PROPERTIES_PATH + "'");
            } finally {
                try {
                    if (mavenWrapperPropertyFileInputStream != null) {
                        mavenWrapperPropertyFileInputStream.close();
                    }
                } catch (IOException e) {
                    // Ignore ...
                }
            }
        }
        System.out.println("- Downloading from: " + url);

        File outputFile = new File(baseDirectory.getAbsolutePath(), MAVEN_WRAPPER_JAR_PATH);
        if (!outputFile.getParentFile().exists()) {
            if (!outputFile.getParentFile().mkdirs()) {
                System.out.println(
                    "- ERROR creating output directory '" + outputFile.getParentFile().getAbsolutePath() + "'");
            }
        }
        System.out.println("- Downloading to: " + outputFile.getAbsolutePath());
        try {
            downloadFileFromURL(url, outputFile);
            System.out.println("Done");
            System.exit(0);
        } catch (Throwable e) {
            System.out.println("- Error downloading");
            e.printStackTrace();
            System.exit(1);
        }
    }

    /**
     * 从指定 URL 下载文件到目标文件
     * <p> 支持通过环境变量 MVNW_USERNAME 和 MVNW_PASSWORD 进行基本认证, 若设置则使用该凭证访问受保护资源.
     * 下载过程使用 {@code java.nio.channels.Channels} 和 {@code java.io.FileOutputStream} 完成, 支持大文件传输.
     *
     * @param urlString   要下载文件的 URL 地址
     * @param destination 下载目标文件路径
     * @throws Exception 当网络连接失败, 认证失败或文件写入异常时抛出
     *
     *                   <pre>{@code
     *                   downloadFileFromURL("https://example.com/file.zip", new File("output.zip"));
     *                   }</pre>
     */
    private static void downloadFileFromURL(String urlString, File destination) throws Exception {
        if (System.getenv("MVNW_USERNAME") != null && System.getenv("MVNW_PASSWORD") != null) {
            String username = System.getenv("MVNW_USERNAME");
            char[] password = System.getenv("MVNW_PASSWORD").toCharArray();
            Authenticator.setDefault(new Authenticator() {
                /**
                 * 获取密码认证信息
                 * <p> 重写父类方法, 返回包含用户名和密码的密码认证对象
                 *
                 * @return PasswordAuthentication 实例, 包含用户名和密码
                 */
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(username, password);
                }
            });
        }
        URL website = new URL(urlString);
        ReadableByteChannel rbc;
        rbc = Channels.newChannel(website.openStream());
        FileOutputStream fos = new FileOutputStream(destination);
        fos.getChannel().transferFrom(rbc, 0, Long.MAX_VALUE);
        fos.close();
        rbc.close();
    }

}
