// Business lint checks guide review; they do not rewrite source or emulate a compiler.
package project

import (
	"regexp"
	"strings"
)

type rule struct {
	id      string
	pattern *regexp.Regexp
	message string
}

var rules = []rule{
	{"FIELD_INJECTION", regexp.MustCompile(`@(?:Autowired|Resource)(?:\([^)]*\))?\s*(?:(?:private|protected|public|final)\s+)*[\w.<>?, \[\]]+\s+\w+\s*;`),
		"Use constructor injection (final dependencies) instead of field injection"},
	{"BASE_MAPPER", regexp.MustCompile(`\bextends\s+BaseMapper\s*<`),
		"Use Zeka BaseDao<PO> and its supported persistence conventions"},
	{"RAW_SERVICE_IMPL", regexp.MustCompile(`\bextends\s+ServiceImpl\s*<`),
		"Use Zeka BaseServiceImpl<Mapper, PO> for business persistence"},
	{"CUSTOM_RESPONSE", regexp.MustCompile(`\bclass\s+(?:ApiResponse|CommonResponse|ResponseResult)\b`),
		"Verify need before creating a new response wrapper; Servlet uses Result and automatic wrapping"},
	{"UNKNOWN_RESULT_CODE", regexp.MustCompile(`\bResultCodeEnum\b`),
		"Framework has no ResultCodeEnum; use BaseCodes or your LowestExceptionAssert enum"},
	{"MESSAGING_TOPICS", regexp.MustCompile(`@MessagingListener\s*\([^)]*\btopics\s*=`),
		"MessagingListener uses topic and required groupId, not topics"},
	{"MESSAGING_SEND", regexp.MustCompile(`\bmessagingTemplate\s*\.\s*send\s*\(`),
		"Use sendSync/sendAsync/sendOneWay with UnifiedMessage"},
	{"STDOUT", regexp.MustCompile(`\bSystem\.(?:out|err)\.print`),
		"Use parameterized SLF4J logging and avoid exposing private data"},
}

var daoField = regexp.MustCompile(`\b(?:private|protected|public)\s+(?:final\s+)?\w*(?:Mapper|Dao)\s+\w+\s*;`)

// lintJava applies independent rules while preserving source locations from the scanner.
func lintJava(r *Report, file, code string) {
	active := rules
	if strings.Contains(code, "@RestController") || strings.Contains(file, "Controller.java") {
		active = append(append([]rule(nil), rules...), rule{"CONTROLLER_DAO", daoField,
			"Controller should call a Service instead of directly injecting a DAO/Mapper"})
		// Imported PO names allow a narrow return-type check without guessing suffixes.
		poImports := regexp.MustCompile(`import\s+[\w.]+\.entity\.po\.(\w+)\s*;`)
		for _, m := range poImports.FindAllStringSubmatch(code, -1) {
			active = append(active, rule{"CONTROLLER_PO", regexp.MustCompile(
				`\bpublic\s+(?:List<|IPage<)?` + regexp.QuoteMeta(m[1]) + `>?\s+\w+\s*\(`),
				"Public Controller responses should use an explicit DTO instead of the persistence PO"})
		}
	}
	for _, rule := range active {
		for _, loc := range rule.pattern.FindAllStringIndex(code, -1) {
			r.Findings = append(r.Findings, Finding{rule.id, "warning", file,
				strings.Count(code[:loc[0]], "\n") + 1, rule.message})
		}
	}
}
