# 更新当前目录下所有的 .gitignore 文件(.gitignore 模板在 supports/.gitignore
update-ignore:
	./scripts/update-ignore.sh .

deploy-private:
	jdk 17 && cd ../ && mvn clean deploy -Pprivate -Dcheckstyle.skip=true -Dpmd.skip=true -Dmaven.test.skip=true -e -Ddockerfile.skip=true -T12

# maven-gpg-plugin 不支持并行, 所以设置为 -T1
deploy-central:
	jdk 17 && cd ../ && mvn clean deploy -Pcentral -Dcheckstyle.skip=true -Dpmd.skip=true -Dmaven.test.skip=true -e -Ddockerfile.skip=true -T1

# 按照顺序构建所有模块
install:
	cd ../ && \
	cd arco-meta/arco-supreme && ./mvnw clean install -Ppackage-source -Dcheckstyle.skip=true -Dpmd.skip=true -Dmaven.test.skip=true -e && \
	cd ../arco-processor && ./mvnw clean install -Ppackage-source -Dcheckstyle.skip=true -Dpmd.skip=true -Dmaven.test.skip=true -e && \
	cd ../arco-maven-plugin && ./mvnw clean install -Ppackage-source -Dcheckstyle.skip=true -Dpmd.skip=true -Dmaven.test.skip=true -e && \
	cd ../arco-builder && ./mvnw clean install -Ppackage-source -Dcheckstyle.skip=true -Dpmd.skip=true -Dmaven.test.skip=true -e  && \
	cd ../../blen-kernel && ./mvnw clean install -Ppackage-source -Dcheckstyle.skip=true -Dpmd.skip=true -Dmaven.test.skip=true -e && \
	cd ../cubo-starter && ./mvnw clean install -Ppackage-source -Dcheckstyle.skip=true -Dpmd.skip=true -Dmaven.test.skip=true -e && \
	cd ../cubo-starter-examples && ./mvnw clean install -Ppackage-source -Dcheckstyle.skip=true -Dpmd.skip=true -Dmaven.test.skip=true -e


deploy-webui-and-api:
	cd zeka-stack-webui && ./deploy.sh \
	&& cd ../zeka-stack-api && ./deploy.sh
