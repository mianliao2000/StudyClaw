import type {
  ContentType,
  ExampleChapter,
  ExampleCourse,
  ExampleLesson,
  ExampleSubchapter,
} from "@/types";

type QuizSeed = {
  prompt: string;
  correct: string;
  distractors: [string, string, string];
  explanation: string;
};

type ExampleSubchapterSeed = {
  slug: string;
  title: string;
  titleEn: string;
  learningObjective: string;
  learningObjectiveEn: string;
  overview: string;
  whyImportant: string;
  connection: string;
  intuition: string;
  corePoints: [string, string, string];
  pitfalls: [string, string];
  examples: [string, string];
  scenario: string;
  next: string;
  takeaway: string;
  terms: [string, string, string, string];
  quizFocus: string;
  applyPriority: string;
};

type ExampleChapterSeed = {
  slug: string;
  title: string;
  titleEn: string;
  subchapters: ExampleSubchapterSeed[];
};

type ExampleCourseSeed = {
  slug: string;
  title: string;
  titleEn: string;
  topic: string;
  topicEn: string;
  description: string;
  descriptionEn: string;
  goals: [string, string, string];
  goalsEn: [string, string, string];
  chapters: ExampleChapterSeed[];
};

type ExampleLessonType = ContentType;

function isDetailedAiAgentCourse(courseSlug: string) {
  return courseSlug === "ai-agent-development";
}

function isDetailedLlmCourse(courseSlug: string) {
  return courseSlug === "llm-principles";
}

function isDetailedQuantCourse(courseSlug: string) {
  return courseSlug === "quant-finance-analysis";
}

function isDetailedPowerCourse(courseSlug: string) {
  return courseSlug === "power-electronics";
}

function sanitizeLlmChineseText(text: string) {
  return text
    .replace(/\bLLM\b/g, "大语言模型")
    .replace(/\bToken\b/g, "词元")
    .replace(/\btoken\b/g, "词元")
    .replace(/\bEmbedding\b/g, "向量表示")
    .replace(/\bembedding\b/g, "向量表示")
    .replace(/\bGrounding\b/g, "事实锚定")
    .replace(/\bgrounding\b/g, "事实锚定")
    .replace(/\bRAG\b/g, "检索增强")
    .replace(/\bPretraining\b/g, "预训练")
    .replace(/\bInstruction Tuning\b/g, "指令微调")
    .replace(/\bAlignment\b/g, "对齐")
    .replace(/\bPreference Optimization\b/g, "偏好优化");
}

function sanitizeAiAgentChineseText(text: string) {
  return text
    .replace(/AI Agent/g, "智能体")
    .replace(/\bAgent\b/g, "智能体")
    .replace(/\bagent\b/g, "智能体")
    .replace(/\bLLM\b/g, "大语言模型")
    .replace(/\bTool\b/g, "工具")
    .replace(/\bTools\b/g, "工具")
    .replace(/\bLoop\b/g, "循环闭环")
    .replace(/\bloop\b/g, "循环闭环")
    .replace(/\bGoal-directed behavior\b/g, "目标导向行为")
    .replace(/\bGoal-oriented\b/g, "目标导向")
    .replace(/\bGoal\b/g, "目标")
    .replace(/\bEnvironment\b/g, "环境")
    .replace(/\bEvolution\b/g, "演进")
    .replace(/\bPerception\b/g, "感知")
    .replace(/\bReasoning\b/g, "推理")
    .replace(/\bAction\b/g, "行动")
    .replace(/\bFeedback loop\b/g, "反馈闭环")
    .replace(/\bPlanner\b/g, "规划者")
    .replace(/\bWorker\b/g, "执行者")
    .replace(/\bCritic\b/g, "审查者")
    .replace(/\bMemory\b/g, "记忆")
    .replace(/\bMessage passing\b/g, "消息传递")
    .replace(/\bmessage passing\b/g, "消息传递")
    .replace(/\bShared state\b/g, "共享状态")
    .replace(/\bshared state\b/g, "共享状态")
    .replace(/\bBlackboard\b/g, "共享黑板")
    .replace(/\bInformation flow\b/g, "信息流")
    .replace(/\bProtocol\b/g, "协作协议")
    .replace(/\bRole-based interaction\b/g, "基于角色的交互")
    .replace(/\bHandoff\b/g, "任务交接")
    .replace(/\bEscalation\b/g, "升级处理")
    .replace(/\bPipeline\b/g, "流水线模式")
    .replace(/\bTree\b/g, "树状协作")
    .replace(/\bPattern\b/g, "模式")
    .replace(/\bSync\b/g, "同步")
    .replace(/\bAsync\b/g, "异步")
    .replace(/\bThroughput\b/g, "吞吐量")
    .replace(/\bCoordination overhead\b/g, "协作开销")
    .replace(/\bLayered architecture\b/g, "分层架构")
    .replace(/\bAgent layer\b/g, "智能体层")
    .replace(/\bTool layer\b/g, "工具层")
    .replace(/\bData layer\b/g, "数据层")
    .replace(/\bModularity\b/g, "模块化")
    .replace(/\bScalability\b/g, "可扩展性")
    .replace(/\bInterface stability\b/g, "接口稳定性")
    .replace(/\bReplacement\b/g, "模块替换")
    .replace(/\bModel routing\b/g, "模型路由")
    .replace(/\bStrong model\b/g, "强模型")
    .replace(/\bCheap model\b/g, "低成本模型")
    .replace(/\bCognitive load\b/g, "认知负载")
    .replace(/\bLatency\b/g, "延迟")
    .replace(/\bCost efficiency\b/g, "成本效率")
    .replace(/\bTradeoff\b/g, "权衡")
    .replace(/\bHallucination\b/g, "幻觉")
    .replace(/\bgrounding\b/g, "事实锚定")
    .replace(/\bGrounding\b/g, "事实锚定")
    .replace(/\bError propagation\b/g, "错误传播")
    .replace(/\bStability\b/g, "稳定性")
    .replace(/\bLogging\b/g, "日志记录")
    .replace(/\blogging\b/g, "日志记录")
    .replace(/\bTracing\b/g, "链路追踪")
    .replace(/\btracing\b/g, "链路追踪")
    .replace(/\bReplay\b/g, "回放复现")
    .replace(/\breplay\b/g, "回放复现")
    .replace(/\bObservability\b/g, "可观测性")
    .replace(/\bOutcome evaluation\b/g, "结果评估")
    .replace(/\bProcess evaluation\b/g, "过程评估")
    .replace(/\bRobustness\b/g, "鲁棒性")
    .replace(/\bRecovery\b/g, "恢复能力")
    .replace(/\bAgent-native software\b/g, "智能体原生软件")
    .replace(/\bHuman-AI collaboration\b/g, "人机协作")
    .replace(/\bGovernance\b/g, "治理")
    .replace(/\bSystem evolution\b/g, "系统演进")
    .replace(/\bplanning\b/g, "规划")
    .replace(/\bPlanning\b/g, "规划")
    .replace(/\breflection\b/g, "反思")
    .replace(/\bReflection\b/g, "反思")
    .replace(/\bTask decomposition\b/g, "任务拆解")
    .replace(/\bSelf-correction\b/g, "自我修正");
}

function buildDetailedAiAgentMainContent(seed: ExampleSubchapterSeed) {
  return sanitizeAiAgentChineseText([
    "## 本节讲什么",
    seed.overview,
    "",
    `在理解这部分内容时，不要把它看成一个孤立技巧，也不要把它看成某个框架里的功能点。更好的学习方式，是把它放回完整的 Agent 系统里，去判断它究竟承担什么职责、解决什么问题，以及如果这一层没有设计好，会如何影响上游目标理解和下游执行结果。`,
    "",
    "## 为什么重要",
    seed.whyImportant,
    "",
    `很多学习者在刚接触这类主题时，容易把注意力放在表面能力上，例如“模型会不会调用工具”“链路能不能跑通”“结果看起来聪不聪明”。但真正决定系统质量的，往往是底层判断是否稳固。也正因为如此，这一节的重要性不在于给你一个孤立结论，而在于帮你建立一个可以复用到更多场景中的系统判断框架。`,
    "",
    "## 与课程的关系",
    seed.connection,
    "",
    `从课程结构上说，这一节承担的是“搭骨架”的作用。它会影响你后面对记忆、工具、规划、通信、协作、架构与评估的理解方式。如果这里的主线没有建立起来，后面的章节就很容易被学成一堆彼此分散的概念，而不是一条前后连贯的系统主线。`,
    "",
    "## 直觉理解",
    seed.intuition,
    "",
    `直觉层面的理解很重要，因为很多 Agent 概念如果只停留在术语层面，会显得抽象甚至有些像口号。真正有效的直觉应该帮助你把抽象机制重新翻译成熟悉的工作场景，让你在看到真实系统时，能够迅速判断出它究竟是在做“感知”“判断”“协调”还是“执行”，以及这些环节之间有没有形成稳定关系。`,
    "",
    "## 核心概念",
    `下面这些概念不是并列罗列的知识点，而是一组彼此相关、能共同解释系统行为的结构线索：`,
    ...seed.corePoints.map((point) => `- ${point}`),
    "",
    `学这一部分时，最重要的不是把每一条都机械记下来，而是理解这些点为什么会一起出现。它们共同回答的是同一个问题：一个 Agent 系统为什么会稳定，为什么会失控，又为什么有些表面上“聪明”的系统在真实任务里并不可靠。`,
    "",
    "## 常见误区",
    `下面这些误区之所以常见，是因为它们通常都带有一定的“表面合理性”。也就是说，初看时它们像是捷径，真正进入复杂系统后却会成为结构性问题：`,
    ...seed.pitfalls.map((pitfall) => `- ${pitfall}`),
    "",
    `如果你能在阅读示例系统或分析他人设计时主动识别这些误区，说明你的理解已经开始从“记住内容”走向“会做判断”。这也是这门课希望帮助你建立的能力。`,
    "",
    "## 理解例子",
    `1. ${seed.examples[0]}`,
    `2. ${seed.examples[1]}`,
    "",
    `例子的价值不只是帮助你“看懂”，更重要的是帮助你“迁移”。如果你能从这些例子中抽出共同结构，并把它迁移到别的 Agent 场景里，那这部分内容才算真正进入你的长期理解框架。`,
    "",
    "## 应用场景",
    seed.scenario,
    "",
    `把知识放回场景里时，建议你优先问自己几个问题：这个系统真正要解决的目标是什么？它最关键的状态在哪里？它依赖什么反馈来修正行为？它的失败最可能在哪一层暴露？这些问题会帮助你把本节知识从“会听懂”推进到“会分析”。`,
    "",
    "## 下一步会学什么",
    seed.next,
    "",
    `这一节和下一节之间不是简单并列关系，而是递进关系。也就是说，下一节通常不是换一个全新话题，而是在当前理解框架上再增加新的系统层。你如果能带着这一节的主线继续往下学，后面的内容会更容易形成连续结构。`,
    "",
    "## 一句话总结",
    seed.takeaway,
    "",
    `如果要检验自己是否真的掌握了这一节，一个很有效的方法是：尝试不用原句复述，而是用自己的语言重新解释这句总结，并说明它为什么对 Agent 系统成立。只要你能做到这一点，这一节就不再只是“看过”，而是真正“理解过”。`,
    "",
    "## 关键术语",
    ...seed.terms.map((term) => `- ${term}`),
  ].join("\n"));
}

function explainAiAgentChineseTerm(term: string) {
  const normalized = sanitizeAiAgentChineseText(term).trim();
  const explanations: Record<string, string> = {
    智能体: "能够围绕目标感知信息、做出判断并采取行动的系统单元。",
    感知: "把外部输入转成系统可理解状态的过程，是后续判断的起点。",
    推理: "根据当前信息组织判断路径，决定下一步该做什么、为什么这么做。",
    行动: "把内部决策变成可执行结果，例如调用工具、发出指令或更新状态。",
    大语言模型: "负责语言理解与生成的核心能力来源，但它本身并不等于完整系统。",
    工具: "让系统从“会说”走向“能做”的外部能力接口。",
    记忆: "帮助系统跨轮次保留上下文、历史经验和长期偏好。",
    规划: "把复杂目标拆成阶段性步骤，避免每一步都只靠临场反应。",
    反思: "对结果进行复盘和修正，让系统能在错误后调整策略。",
    规划者: "负责拆解任务和安排协作顺序的角色。",
    执行者: "负责落实具体步骤、调用能力并产出中间结果的角色。",
    审查者: "负责发现漏洞、检查偏差并提出修正意见的角色。",
    消息传递: "通过显式通信交换信息，边界清楚，但往返成本更高。",
    共享状态: "多个角色共同读写同一份状态，同步方便，但更容易互相干扰。",
    流水线模式: "把任务按顺序交给不同角色处理，适合步骤清晰的流程。",
    树状协作: "把大问题向下拆成分支后并行处理，适合大任务拆解。",
    循环闭环: "系统根据反馈反复修正，直到满足停止条件。",
    分层架构: "把职责拆到不同层次，避免模型、工具和数据耦合成一团。",
    模块化: "让系统部件可以独立替换、复用和扩展。",
    可扩展性: "系统在任务变复杂、规模变大时，仍能继续稳定工作的能力。",
    幻觉: "系统给出听起来合理、实际上缺乏依据的内容。",
    日志记录: "记录系统运行细节，帮助定位问题出现在哪一步。",
    链路追踪: "把一次任务的关键决策路径串起来，方便分析过程。",
    回放复现: "把问题场景重新跑一遍，确认错误是否稳定出现。",
    可观测性: "系统内部状态是否足够透明，能不能被人看清和解释。",
    结果评估: "关注最终答案是否正确、是否满足目标。",
    过程评估: "关注系统是如何得到答案的，路径是否可靠。",
    鲁棒性: "面对噪声、异常和环境变化时，系统仍能维持基本能力。",
    恢复能力: "系统出错后能否回到可控状态，而不是继续放大问题。",
    智能体原生软件: "把智能体当成核心执行单元来设计的软件形态。",
    人机协作: "让人和系统分别承担最适合自己的判断与执行任务。",
    治理: "为系统设置边界、规则和责任分工，确保能力可控。",
  };

  return explanations[normalized] ?? "这是本节帮助你建立系统理解框架的关键术语。";
}

function buildConversationalAiAgentMainContent(seed: ExampleSubchapterSeed) {
  const normalizedTerms = seed.terms.map((term) => sanitizeAiAgentChineseText(term));

  return sanitizeAiAgentChineseText([
    "## 本节讲什么",
    seed.overview,
    "",
    `这一节更适合用“**它在整个系统里到底负责什么**”来理解。不要急着背定义，也不要一上来就把它看成某个框架的功能按钮。先弄清它承担什么职责、影响什么环节、出问题时又会把风险传到哪里，学习会稳很多。`,
    "",
    "## 为什么重要",
    seed.whyImportant,
    "",
    `很多人学多智能体系统，容易先被“它会不会做事”吸引住。但真正把系统拉开差距的，往往不是表面上的炫酷，而是 **它为什么能稳定地做对事，又为什么会在压力下突然偏掉**。这一节的价值，就在于帮你把这个判断框架建立起来。`,
    "",
    "## 与课程的关系",
    seed.connection,
    "",
    `整门课后面还会继续出现记忆、工具、通信、协作、架构、评估这些主题，但它们其实都在回答同一个问题：**这套系统是怎么看见问题、理解问题、拆解问题并把结果落地的。** 所以这一节更像搭骨架，把主线先立住。`,
    "",
    "## 直觉理解",
    seed.intuition,
    "",
    `你可以把这类系统想象成一个分工清楚的小团队。有人负责看信息，有人负责做判断，有人负责动手，还有人负责在出问题时把方向拉回来。**真正的直觉，不是记住术语，而是一眼看出这个团队会在哪一步掉链子。**`,
    "",
    `如果你看到一个系统结果不错，但说不清它是靠什么得到这个结果的，那多半还不算真正理解了它。直觉的目的，就是让你在看到真实系统时，能立刻把“看到了什么”“怎么判断的”“如何落地的”分开来看。`,
    "",
    "## 核心概念",
    `这一部分最好不要当成并列知识点，而要当成几条可以串起系统行为的线索。它们共同回答的是：系统为什么会稳，为什么会乱，为什么有时看起来聪明却不可靠。`,
    ...seed.corePoints.map((point, index) => `- **重点 ${index + 1}：** ${point}`),
    "",
    `你可以把这些要点想成三把尺子：第一把看它有没有拿到对的信息，第二把看它有没有做对判断，第三把看它有没有把判断变成稳定动作。**只要有一把尺子失真，系统整体表现就会开始摇晃。**`,
    "",
    "## 常见误区",
    `这些误区最危险的地方，就是它们乍看之下往往都很像捷径。你会觉得“这样也说得通”，但一旦进入复杂系统，就会变成结构性风险。`,
    ...seed.pitfalls.map((pitfall, index) => `- **误区 ${index + 1}：** ${pitfall}`),
    "",
    `你可以用一个很简单的方式检查自己是不是真的理解了：当你看到别人的方案时，你能不能立刻指出“这里看起来合理，但其实埋着风险”。**能看见误区，往往比能复述定义更接近真正理解。**`,
    "",
    "## 理解例子",
    `1. **例子一：** ${seed.examples[0]}`,
    `2. **例子二：** ${seed.examples[1]}`,
    "",
    `例子的作用不只是帮你“看懂这一段”，而是帮你学会迁移。也就是说，下次换一个业务、换一种工具、换一种角色分工，你依然能认出背后还是同一类结构问题。**能迁移，理解才真正算稳。**`,
    "",
    "## 应用场景",
    seed.scenario,
    "",
    `真正把知识放回场景里时，可以先问四个问题：**目标是什么、关键状态在哪里、依赖什么反馈修正、最可能在哪一层出问题。** 这四个问题像一张快速检查表，能帮你把“听懂了”推进到“真能分析”。`,
    "",
    "## 下一步会学什么",
    seed.next,
    "",
    `下一步并不是突然换一个话题，而是在这张地图上继续加细节。你可以把它理解成：先学会看清系统骨架，再学会看清骨架上的零件是如何互相影响的。这样后面的内容就不会变成新名词不断堆积，而是 **同一条系统主线越来越完整**。`,
    "",
    "## 一句话总结",
    `**${seed.takeaway}**`,
    "",
    `最好的自测方式，是试着不看原句，用自己的话把这个总结重新讲一遍。如果你能讲清楚它为什么成立、对系统意味着什么，那就说明你已经不是“看过”，而是真的“理解过”。`,
    "",
    "## 关键术语",
    ...normalizedTerms.map((term) => `- **${term}：** ${explainAiAgentChineseTerm(term)}`),
  ].join("\n"));
}

function explainLlmChineseTerm(term: string) {
  const normalized = sanitizeLlmChineseText(term).trim();
  const explanations: Record<string, string> = {
    词元: "模型处理文本时使用的基本计算单位，不一定等同于一个完整单词或一个汉字。",
    向量表示: "把离散文本单位映射到向量空间的表示方式，帮助模型学习相似性和上下文关系。",
    "上下文窗口": "模型在当前一次推理中能同时看到的信息范围，它直接影响注意力分配与成本。",
    "下一个词预测": "大语言模型最基础的训练目标，即根据已有上下文预测最可能出现的后续内容。",
    "预训练": "在海量语料上学习语言模式和知识压缩能力的阶段，是模型通用能力的底座。",
    "指令微调": "让模型更稳定地理解任务要求、按格式响应并贴近用户意图的训练阶段。",
    "偏好优化": "根据人类偏好或比较反馈继续塑造回答风格和行为边界的优化过程。",
    "对齐": "让模型行为更符合人类期望、规则要求和安全边界的整体过程。",
    "检索增强": "在推理时从外部知识源取回相关资料，再把它放进上下文帮助模型回答。",
    事实锚定: "让回答锚定到外部证据或明确来源，而不是只依赖参数记忆猜测。",
    "引用证据": "在回答中指出支持结论的文本、数据或文档依据，提升可核查性。",
    "离线评测": "在固定测试集上评估模型或系统表现，便于对比不同方案。",
    "线上监控": "在真实流量中持续观察质量、延迟、失败模式和异常行为的机制。",
    "延迟": "从用户发起请求到系统返回结果所需的时间，是体验和吞吐的重要约束。",
    "总拥有成本": "不仅包含模型调用价格，还包括检索、重试、人工兜底和系统运维等整体成本。",
  };

  return (
    explanations[normalized] ?? "这是理解大语言模型系统行为与工程取舍时常用的关键术语。"
  );
}

function buildConversationalLlmMainContent(seed: ExampleSubchapterSeed) {
  return sanitizeLlmChineseText([
    "## 本节讲什么",
    seed.overview,
    "",
    `学习这一节时，最有帮助的方式不是把它当成一个孤立术语，而是不断追问：**这个机制在大语言模型系统里到底负责什么，它解释了模型哪一种真实表现？** 这样读下去，你会更容易把零散概念连成一条主线。`,
    "",
    "## 为什么重要",
    seed.whyImportant,
    "",
    `很多人学大语言模型时，容易被“模型好像很聪明”这层表象带着走。但真正决定你能不能看懂系统的，不是惊讶感，而是你能不能把现象拆回机制：它为什么会这样表现，什么时候会失效，什么条件下会更稳。`,
    "",
    "## 与课程的关系",
    seed.connection,
    "",
    `所以这节内容的价值，不只是帮你记住一个定义，而是帮你建立一个判断支点。后面无论讨论训练阶段、上下文、检索，还是评估与成本，本质上都要回到这些支点上重新理解。`,
    "",
    "## 直觉理解",
    seed.intuition,
    "",
    `如果你发现自己已经能把这个直觉类比迁移到别的场景里，比如从聊天系统迁移到知识助手、写作辅助或企业问答，那通常说明你抓住的已经不是一句定义，而是更底层的运行逻辑。`,
    "",
    "## 核心概念",
    `下面这些点要连起来看，而不是一条条背：`,
    ...seed.corePoints.map((point, index) => `- **关键点 ${index + 1}：** ${point}`),
    "",
    `对大语言模型来说，很多“看起来突然变强”的能力，往往都不是凭空出现的，而是这些机制在规模、数据和系统设计共同作用下逐渐显出来的结果。`,
    "",
    "## 常见误区",
    `这一部分尤其值得慢一点读，因为大语言模型相关讨论里，最容易传播的恰恰就是“听起来很像对，但其实方向偏了”的理解：`,
    ...seed.pitfalls.map((pitfall, index) => `- **常见误区 ${index + 1}：** ${pitfall}`),
    "",
    `真正理解一个模型，不只是知道它“能做什么”，还要知道人们最容易在哪些地方高估它、误读它，或者把系统问题错归到模型本身。`,
    "",
    "## 理解例子",
    `- **例子一：** ${seed.examples[0]}`,
    `- **例子二：** ${seed.examples[1]}`,
    "",
    `例子的意义不只是“更容易懂”，更重要的是帮你把抽象概念落到具体判断上。以后你看到新的模型现象时，也可以反过来问：它更像这里说的哪种机制、哪种误区，还是哪种边界条件？`,
    "",
    "## 放回真实系统里看",
    seed.scenario,
    "",
    `做系统判断时，可以先问自己四个问题：模型当前依赖的信息来自哪里？哪些是参数里的旧知识，哪些是上下文里的即时信息，哪些是外部检索带来的证据？系统真正追求的是更高质量、更低成本，还是更强可控性？这四个问题会帮你把课堂概念真正带进工程视角。`,
    "",
    "## 下一步会学什么",
    seed.next,
    "",
    `如果这一节已经建立了稳定直觉，后面的内容就不再像是“又多了一个术语”，而更像是在同一张地图上继续补上新的区域。`,
    "",
    "## 一句话总结",
    `**${seed.takeaway}**`,
    "",
    `检验自己是否真的掌握了这一节，一个很实用的方法是：试着不用原句，改用自己的语言解释这句话为什么成立，以及它能解释模型的哪一类现象。只要你能做到这一点，理解就已经从“看过”走向“会判断”。`,
    "",
    "## 关键术语",
    ...seed.terms.map((term) => `- **${sanitizeLlmChineseText(term)}：** ${explainLlmChineseTerm(term)}`),
  ].join("\n"));
}

function buildConversationalLlmSummaryContent(seed: ExampleSubchapterSeed) {
  return sanitizeLlmChineseText([
    "## 核心概念",
    `复习这一节时，先不要急着背定义，先回到这条主线：**这一节到底在解释模型的哪种行为，或者系统的哪种取舍？**`,
    ...seed.corePoints.map((point, index) => `- **复习点 ${index + 1}：** ${point}`),
    "",
    `如果你能把这些点串起来讲清楚，而不是一条条孤立复述，说明你已经开始具备结构化理解。`,
    "",
    "## 常见误区",
    ...seed.pitfalls.map((pitfall, index) => `- **需要警惕的误区 ${index + 1}：** ${pitfall}`),
    "",
    `很多误区的问题不在于完全错误，而在于它只说对了一半。复习时要特别留意那些“表面合理、但会把你带偏”的理解。`,
    "",
    "## 理解例子",
    `- ${seed.examples[0]}`,
    `- ${seed.examples[1]}`,
    "",
    `如果换一个业务场景，你仍然能看出这些例子背后的结构相似性，那就说明你真正抓住了可迁移的部分。`,
    "",
    "## 一句话总结",
    seed.takeaway,
    "",
    `这句话可以当作你以后快速判断相关问题时的“检查点”。当你遇到新的模型现象、系统设计或产品讨论时，先用它过一遍，往往能更快看清重点。`,
    "",
    "## 关键术语",
    ...seed.terms.map((term) => `- **${sanitizeLlmChineseText(term)}：** ${explainLlmChineseTerm(term)}`),
  ].join("\n"));
}

function buildDetailedLlmQuizSeeds(seed: ExampleSubchapterSeed): QuizSeed[] {
  return [
    {
      prompt: sanitizeLlmChineseText(`从本节的整体目标来看，你最应该先建立哪种理解？`),
      correct: sanitizeLlmChineseText(seed.quizFocus),
      distractors: [
        "优先记住所有术语的字面定义，系统关系以后再补",
        "先默认模型现象都来自参数规模，其他因素并不重要",
        "把本节只看成一个局部技巧，不需要放回整体系统理解",
      ].map(sanitizeLlmChineseText) as [string, string, string],
      explanation: sanitizeLlmChineseText(
        `本节最重要的是先抓住判断主线。${seed.quizFocus}，这样后续概念才会真正落到可解释的系统框架里。`
      ),
    },
    {
      prompt: sanitizeLlmChineseText(`下面哪一项最符合本节提醒你的常见误区？`),
      correct: sanitizeLlmChineseText(seed.pitfalls[0]),
      distractors: [
        sanitizeLlmChineseText(seed.corePoints[0]),
        sanitizeLlmChineseText(seed.examples[0]),
        sanitizeLlmChineseText(seed.applyPriority),
      ],
      explanation: sanitizeLlmChineseText(
        `这道题考的是你能否区分“正确理解路径”和“听起来合理但会带偏的说法”。${seed.pitfalls[0]} 正是本节明确提醒要避免的误区。`
      ),
    },
    {
      prompt: sanitizeLlmChineseText(`如果把本节知识放回真实的大语言模型系统分析中，最应该优先确认什么？`),
      correct: sanitizeLlmChineseText(seed.applyPriority),
      distractors: [
        "先追求更复杂的提示词写法，系统结构可以以后再看",
        "先假设模型一定知道所有相关知识，再讨论外部信息",
        "先看回答是否足够流畅，机制问题并不影响整体判断",
      ].map(sanitizeLlmChineseText) as [string, string, string],
      explanation: sanitizeLlmChineseText(
        `本节强调的不是表面观感，而是机制判断。先确认 ${seed.applyPriority}，才能避免后续分析建立在错误前提上。`
      ),
    },
    {
      prompt: sanitizeLlmChineseText(`下面哪一项最能代表本节真正希望你带走的结构性认识？`),
      correct: sanitizeLlmChineseText(seed.corePoints[1]),
      distractors: [
        sanitizeLlmChineseText(seed.pitfalls[1]),
        sanitizeLlmChineseText(seed.examples[1]),
        sanitizeLlmChineseText(seed.terms[0]),
      ],
      explanation: sanitizeLlmChineseText(
        `${seed.corePoints[1]} 更接近本节的机制理解。其他选项要么是误区，要么是例子或术语，不能直接代表本节主线。`
      ),
    },
    {
      prompt: sanitizeLlmChineseText(`如果只用一句话概括本节最重要的结论，哪一项最合适？`),
      correct: sanitizeLlmChineseText(seed.takeaway),
      distractors: [
        sanitizeLlmChineseText(seed.pitfalls[0]),
        sanitizeLlmChineseText(seed.examples[0]),
        sanitizeLlmChineseText(seed.terms[3]),
      ],
      explanation: sanitizeLlmChineseText(
        `这道题检验的是压缩总结能力。${seed.takeaway} 最能概括本节真正要你建立的判断。`
      ),
    },
  ];
}

function explainQuantChineseTerm(term: string) {
  const explanations: Record<string, string> = {
    复权: "对历史价格做口径修正，使价格序列能更合理地反映分红、拆股等事件后的连续性。",
    收益率: "把价格变化转换成更适合比较和建模的相对变化指标，是量化分析中的常见基础量。",
    时间对齐: "确保不同来源的数据在真实可见时间上是一致的，避免无意中偷看未来。",
    异常值: "明显偏离常态的数据点，既可能是真实市场事件，也可能是采集或处理错误。",
    因子: "用来解释或预测资产表现的特征变量，通常需要兼具统计证据和经济含义。",
    样本外验证: "把模型或信号放到未参与调参的数据上检验，以减少过拟合假象。",
    经济含义: "一个信号背后为什么可能有效的机制解释，它帮助研究避免只追逐表面曲线。",
    过拟合: "模型或信号在历史样本上学得过于贴合，导致离开原样本后表现迅速变差。",
    前视偏差: "在研究或回测中无意使用了当时其实还不可见的信息，从而高估策略效果。",
    生存者偏差: "只保留活下来的资产或样本，忽略已经退出的失败者，从而扭曲历史判断。",
    滑点: "理论成交价与实际成交价之间的偏差，是实盘摩擦的重要来源。",
    交易成本: "交易过程中必须支付的费用和摩擦，会直接侵蚀策略表面收益。",
    相关性: "不同策略、资产或信号之间同步波动的程度，它决定了分散化是否真的有效。",
    最大回撤: "从峰值到谷值的最大损失幅度，是衡量资金压力和持有体验的重要指标。",
    风险预算: "在多个策略或资产之间分配可承受风险的方式，而不只是分配名义资金。",
    仓位管理: "决定在什么时点、用多大权重参与某个机会的过程，是收益与风险之间的关键接口。",
  };

  return explanations[term] ?? "这是理解量化研究、回测和风险管理时经常出现的关键术语。";
}

function buildConversationalQuantMainContent(seed: ExampleSubchapterSeed) {
  return [
    "## 本节讲什么",
    seed.overview,
    "",
    `学这一节时，最重要的不是把它当成一个“量化术语”，而是把它看成研究流程里的一个判断节点：**它到底帮助你减少哪类错觉，或者建立哪类更可靠的判断？** 只要这个问题抓住了，后面的公式、指标和流程就不容易散。`,
    "",
    "## 为什么重要",
    seed.whyImportant,
    "",
    `量化研究最迷惑人的地方，在于它经常会把错误包装得很“像正确”。曲线可以很好看，统计结果可以很显著，指标也可以很完整，但如果底层假设站不住，整套研究仍然可能只是更精致的错觉。`,
    "",
    "## 与课程的关系",
    seed.connection,
    "",
    `所以这节课的重点，不只是给你一个局部工具，而是帮你在整条研究链路里建立一个更稳的检查点：什么地方最容易自欺，什么地方最值得慢下来重新确认。`,
    "",
    "## 直觉理解",
    seed.intuition,
    "",
    `如果你发现自己已经能把这个直觉迁移到别的市场、别的品种、别的策略上，那通常说明你学到的不是某个表面例子，而是更底层的判断结构。`,
    "",
    "## 核心概念",
    `下面这些点最好连在一起理解：`,
    ...seed.corePoints.map((point, index) => `- **关键点 ${index + 1}：** ${point}`),
    "",
    `量化分析真正值钱的地方，不是你记住了多少指标名词，而是你是否开始能从这些点里看见研究质量、可交易性和风险暴露之间的联系。`,
    "",
    "## 常见误区",
    `这一部分尤其关键，因为量化研究里最常见的问题往往不是“完全不懂”，而是“以为自己已经懂了”：`,
    ...seed.pitfalls.map((pitfall, index) => `- **常见误区 ${index + 1}：** ${pitfall}`),
    "",
    `只要你开始会主动识别这些误区，说明你已经从“会看结果”往“会审结果”走了一步。`,
    "",
    "## 理解例子",
    `- **例子一：** ${seed.examples[0]}`,
    `- **例子二：** ${seed.examples[1]}`,
    "",
    `例子真正有用的地方，不只是让概念更顺口，而是让你以后看到新的策略、因子或回测结果时，也能迅速判断它更像哪一类结构、哪一种风险。`,
    "",
    "## 放回真实研究里看",
    seed.scenario,
    "",
    `做真实判断时，不妨先问自己几个问题：这个结论靠的是什么数据口径？它有没有偷看未来？它在不同样本里还成不成立？它一旦放进实盘，会受什么摩擦和风险约束？这些问题会帮你把课堂内容真正带回量化研究现场。`,
    "",
    "## 下一步会学什么",
    seed.next,
    "",
    `如果这一节已经让你建立了更稳的判断框架，后面的内容就不会只是“又多一个指标或步骤”，而会变成同一条研究主线上的自然延伸。`,
    "",
    "## 一句话总结",
    `**${seed.takeaway}**`,
    "",
    `检验自己是否真的理解这一节，一个很有效的方法是：试着不用原话，改用自己的语言解释这句总结为什么成立，以及它能帮你识别哪一类量化研究里的常见错误。`,
    "",
    "## 关键术语",
    ...seed.terms.map((term) => `- **${term}：** ${explainQuantChineseTerm(term)}`),
  ].join("\n");
}

function buildConversationalQuantSummaryContent(seed: ExampleSubchapterSeed) {
  return [
    "## 核心概念",
    `复习这一节时，先回到一个问题：**这一节帮你在量化研究链路里避免了哪类误判？**`,
    ...seed.corePoints.map((point, index) => `- **复习点 ${index + 1}：** ${point}`),
    "",
    `如果你能把这些点连起来讲，而不是一条条背下来，说明你已经开始建立研究框架感。`,
    "",
    "## 常见误区",
    ...seed.pitfalls.map((pitfall, index) => `- **需要警惕的误区 ${index + 1}：** ${pitfall}`),
    "",
    `量化研究里很多问题之所以顽固，不是因为公式太难，而是因为误区看起来很像“正常研究流程”。所以复习误区，本身就是在训练研究判断。`,
    "",
    "## 理解例子",
    `- ${seed.examples[0]}`,
    `- ${seed.examples[1]}`,
    "",
    `如果换一类资产、换一个频率、换一个样本环境，这些例子背后的结构仍然成立，那说明你抓住的就是能迁移的部分。`,
    "",
    "## 一句话总结",
    seed.takeaway,
    "",
    `这句话适合当作以后快速审视研究结果时的检查点。很多“看起来很强”的结果，先用这句话过一遍，往往就能更快发现问题。`,
    "",
    "## 关键术语",
    ...seed.terms.map((term) => `- **${term}：** ${explainQuantChineseTerm(term)}`),
  ].join("\n");
}

function buildDetailedQuantQuizSeeds(seed: ExampleSubchapterSeed): QuizSeed[] {
  return [
    {
      prompt: "从本节整体目标来看，你最应该先建立哪种理解？",
      correct: seed.quizFocus,
      distractors: [
        "先记住所有指标名字和公式，研究逻辑以后再说",
        "先看历史收益曲线是否漂亮，其他约束可以放到最后",
        "把本节只当成局部技巧，不需要放进完整研究流程中理解",
      ],
      explanation: `本节最重要的是先抓住研究判断主线。${seed.quizFocus}，这样后面的数字和结果才不会失去意义。`,
    },
    {
      prompt: "下面哪一项最符合本节提醒你的常见误区？",
      correct: seed.pitfalls[0],
      distractors: [seed.corePoints[0], seed.examples[0], seed.applyPriority],
      explanation: `这道题考的是你能否识别“看起来像合理流程、实际上会带偏研究”的问题。${seed.pitfalls[0]} 正是本节强调要警惕的误区。`,
    },
    {
      prompt: "如果把本节知识放回真实量化研究里，最应该优先确认什么？",
      correct: seed.applyPriority,
      distractors: [
        "先让策略曲线更好看，再回头补研究假设",
        "先默认历史规律未来会继续存在，不必额外验证",
        "先追求模型更复杂，研究流程是否扎实可以以后再说",
      ],
      explanation: `量化研究里最危险的往往不是不会建模，而是前提判断站不住。本节强调应先确认 ${seed.applyPriority}，再继续推进结论。`,
    },
    {
      prompt: "下面哪一项最能代表本节真正希望你带走的结构性认识？",
      correct: seed.corePoints[1],
      distractors: [seed.pitfalls[1], seed.examples[1], seed.terms[0]],
      explanation: `${seed.corePoints[1]} 更接近本节的核心研究框架。其他选项要么是误区，要么是例子或术语，不能直接代表本节主线。`,
    },
    {
      prompt: "如果只用一句话概括本节最重要的结论，哪一项最合适？",
      correct: seed.takeaway,
      distractors: [seed.pitfalls[0], seed.examples[0], seed.terms[3]],
      explanation: `这道题检验的是你能不能把一整节内容压缩成一个清晰判断。${seed.takeaway} 最能概括本节真正的重点。`,
    },
  ];
}

function explainPowerChineseTerm(term: string) {
  const explanations: Record<string, string> = {
    开关频率:
      "单位时间内开关器件完成导通与关断的次数。它影响磁性元件尺寸、纹波大小、损耗水平和电磁干扰强度。",
    电流路径:
      "某个开关状态下电流真正流过的闭合回路。看懂电流路径，往往比记住公式更能帮助你判断器件在做什么。",
    储能元件:
      "在电力电子里主要指电感和电容。它们不是被动陪衬，而是决定能量怎样被暂存、释放和平滑输出的核心角色。",
    器件应力:
      "器件在工作中承受的电压、电流和温度负担。应力过高时，即便系统短时间能工作，长期可靠性也会迅速变差。",
    伏秒平衡:
      "电感稳态运行时，一个周期内电感两端电压对时间的积分需要平衡，否则电流会持续漂移。",
    电荷平衡:
      "电容稳态运行时，一个周期内流入和流出的净电荷应当平衡，否则电压会持续上升或下降。",
    纹波:
      "叠加在平均值之上的周期性波动。纹波大小会影响器件应力、输出品质以及后续控制设计。",
    导通模式:
      "电感电流在一个周期里是否始终连续。连续导通和断续导通不仅波形不同，系统的小信号特性也会明显改变。",
    平均模型:
      "把高频开关行为转换成平均意义上的连续模型，帮助我们更清楚地理解稳态关系和控制对象特性。",
    小信号模型:
      "围绕工作点观察微小扰动如何传播的模型，是做环路分析和补偿设计的重要基础。",
    交越频率:
      "开环增益下降到 1 倍附近的频率点。它常被用来衡量环路响应速度，但不能脱离稳定裕度单独讨论。",
    相位裕度:
      "系统距离振荡边缘还有多远的一个直观指标。相位裕度过低，瞬态看起来常常会更尖锐、更危险。",
    栅极驱动:
      "为功率开关提供合适开关速度和驱动能力的电路。驱动做得不好，会同时拖累效率、波形和可靠性。",
    死区时间:
      "上下桥臂之间故意留出的短暂空窗，用来避免直通。它太短会冒险，太长又会引入额外损耗和失真。",
    安全工作区:
      "器件在电压、电流、温度共同约束下仍可安全工作的范围。工程上不能只看额定值，还要看动态条件是否越界。",
    磁芯损耗:
      "磁性材料在交变磁场下产生的能量损耗，通常与频率、磁通摆幅和材料本身密切相关。",
    铜损:
      "绕组导体上的电阻损耗。它既与电流均方值相关，也会受到趋肤效应、邻近效应等高频因素影响。",
    漏感:
      "没有被理想耦合利用起来的那部分磁场效应。它常常在开关瞬间制造尖峰、振铃和额外应力。",
    效率预算:
      "把总损耗拆解到不同器件和不同机理上的分析方法。它帮助你知道损耗到底大头在哪里，而不是只看最终效率数字。",
    结温:
      "器件芯片内部真正承受的温度。它比外壳温度更接近可靠性边界，也是寿命判断的重要依据。",
    热路径:
      "热量从结点流向封装、散热器和环境的通道。热路径设计不好，理论效率再高也可能被温升问题击穿。",
    降额设计:
      "不把器件长期工作点压在额定极限附近，而是留出安全余量，以提高可靠性和工况适应性。",
    寄生参数:
      "原理图里往往没画出来，但在真实布局和封装中客观存在的额外电感、电容、电阻。高频下它们常常主导波形细节。",
    回路面积:
      "电流环路围成的空间大小。高频大电流回路面积越大，往往越容易带来辐射、尖峰和测量麻烦。",
    共模噪声:
      "相对于共同参考点一起摆动的噪声成分，常与开关节点快速 dv/dt 和寄生电容耦合有关。",
    差模噪声:
      "在电源线或信号线之间相互表现出来的噪声成分，通常和主功率回路的脉动电流更直接相关。",
    开关节点:
      "电压快速切换、dv/dt 很高的关键节点。它既是能量转换的核心位置，也是 EMI 和振铃问题的高发区域。",
    双脉冲测试:
      "用于观察功率器件开关行为、损耗和应力的经典测试方法，能帮助设计者更真实地评估开关瞬间发生了什么。",
  };

  return explanations[term] ?? "这是理解电力电子系统行为时反复出现的关键术语。";
}

function buildConversationalPowerMainContent(seed: ExampleSubchapterSeed) {
  return [
    "## 本节讲什么",
    seed.overview,
    "",
    `学这一节时，最好不要把它当成“又一个器件名词”或者“又一条公式”。更好的进入方式是先问一句：**这个概念到底改变了哪条能量路径、哪段动态过程，或者哪一个工程边界？** 一旦这个问题抓住了，后面的波形、参数和设计权衡就会自然连起来。`,
    "",
    "## 为什么重要",
    seed.whyImportant,
    "",
    `电力电子最迷惑人的地方在于，很多设计在静态条件下看起来都“差不多能跑”，但一旦负载变化、频率提高、温升上来或者布局落地，问题就会一下子暴露。真正决定方案水平的，往往不是你会不会背拓扑公式，而是你能不能提前看见这些边界。`,
    "",
    "## 与课程主线的关系",
    seed.connection,
    "",
    `所以这一节的作用，不只是告诉你一个局部知识点，而是帮你在整套电力电子系统里多建立一个稳定的观察角度：以后你看到任何功率级、控制环或调试波形时，都能更快判断它到底属于“能量传递问题”“动态控制问题”，还是“工程实现问题”。`,
    "",
    "## 直觉理解",
    seed.intuition,
    "",
    `如果把整个变换器想成一套有节奏地搬运能量的系统，那么有的部分负责“开门关门”，有的部分负责“临时储能”，有的部分负责“纠偏”，还有的部分负责“别让系统在真实环境里出事”。**真正的理解，不是认识这些角色，而是看懂它们什么时候配合良好，什么时候彼此打架。**`,
    "",
    "## 核心概念",
    `下面这几个点最好连起来看，而不是分开背：`,
    ...seed.corePoints.map((point, index) => `- **关键点 ${index + 1}：** ${point}`),
    "",
    `电力电子里很多问题表面上分别叫做效率、稳定性、纹波、温升、噪声，但它们往往并不是彼此独立的。你如果能从这几个点里看见“同一个动作在不同层面产生的后果”，理解就会一下子稳很多。`,
    "",
    "## 常见误区",
    `这一部分尤其值得慢下来读，因为很多工程问题并不是“不会做”，而是**以为自己已经抓住重点，结果抓住的是局部最优**：`,
    ...seed.pitfalls.map((pitfall, index) => `- **常见误区 ${index + 1}：** ${pitfall}`),
    "",
    `只要你开始主动识别这些误区，说明你已经从“会看波形”往“会判断系统”走了一步。工程能力提升，很多时候就是从这里开始的。`,
    "",
    "## 理解例子",
    `- **例子一：** ${seed.examples[0]}`,
    `- **例子二：** ${seed.examples[1]}`,
    "",
    `这些例子的作用，不只是帮助你理解当前这一节，更是帮你建立迁移能力。以后换成别的拓扑、别的功率等级、别的应用场景时，如果你还能看出同样的结构，那就说明你抓住的是底层规律，而不是只记住了一个案例。`,
    "",
    "## 放回真实工程里看",
    seed.scenario,
    "",
    `做真实判断时，不妨先问自己几个问题：这一步影响的是能量流、控制环，还是器件边界？最敏感的应力点在哪里？如果把频率、负载或温度推到更极端，这个结论还站得住吗？这些问题会帮你把课堂内容真正带回工程现场。`,
    "",
    "## 下一步会学什么",
    seed.next,
    "",
    `如果这一节学明白了，后面的内容就不会只是“再多几个模块”，而会像把同一台机器的内部结构一层层拆开看。你会越来越清楚，为什么电力电子从来不是单点优化，而是整机权衡。`,
    "",
    "## 一句话总结",
    `**${seed.takeaway}**`,
    "",
    `检验自己是否真的理解了这一节，一个很有效的方法是：试着不用原话复述，而是用自己的语言解释这句话为什么成立，它在什么工况下尤其重要，又会在哪类设计误区里被忽视。`,
    "",
    "## 关键术语",
    ...seed.terms.map((term) => `- **${term}：** ${explainPowerChineseTerm(term)}`),
  ].join("\n");
}

function buildConversationalPowerSummaryContent(seed: ExampleSubchapterSeed) {
  return [
    "## 核心概念",
    `复习这一节时，先回到一个核心问题：**这一节到底帮你看清了电力电子系统里的哪一种因果关系？**`,
    ...seed.corePoints.map((point, index) => `- **复习点 ${index + 1}：** ${point}`),
    "",
    `如果你已经能把这些点串成“动作 -> 波形 -> 应力 -> 结果”的链条，而不是一条条分散地背下来，说明理解已经开始成体系了。`,
    "",
    "## 常见误区",
    ...seed.pitfalls.map((pitfall, index) => `- **需要警惕的误区 ${index + 1}：** ${pitfall}`),
    "",
    `很多设计失败并不是因为完全不知道原理，而是因为在错误的地方过度乐观。复习误区，实际上是在训练你以后更早发现风险。`,
    "",
    "## 理解例子",
    `- ${seed.examples[0]}`,
    `- ${seed.examples[1]}`,
    "",
    `如果换一个拓扑、换一个功率等级、换一组器件参数，这些例子背后的结构仍然成立，那就说明你抓住的是系统规律，而不只是当前页面里的说法。`,
    "",
    "## 一句话总结",
    seed.takeaway,
    "",
    `这句话适合作为以后读波形、审方案、看测试结果时的快速检查点。先用它过一遍，很多问题会比想象中更早暴露出来。`,
    "",
    "## 关键术语",
    ...seed.terms.map((term) => `- **${term}：** ${explainPowerChineseTerm(term)}`),
  ].join("\n");
}

function buildDetailedPowerQuizSeeds(seed: ExampleSubchapterSeed): QuizSeed[] {
  return [
    {
      prompt: "从本节整体目标来看，你最应该先建立哪种理解？",
      correct: seed.quizFocus,
      distractors: [
        "先把相关公式和参数表全部记熟，系统行为以后再慢慢补",
        "先追求波形看起来漂亮，至于机理和边界可以后补",
        "把本节当成单独知识点理解，不需要放进整机能量流里看",
      ],
      explanation: `本节最重要的是先抓住判断主线。${seed.quizFocus}，这样后面的器件、控制和工程细节才不会变成分散信息。`,
    },
    {
      prompt: "下面哪一项最符合本节提醒你的常见误区？",
      correct: seed.pitfalls[0],
      distractors: [seed.corePoints[0], seed.examples[0], seed.applyPriority],
      explanation: `${seed.pitfalls[0]} 正是本节希望你主动识别并避免的典型误区。它看起来常常像是捷径，实际上会把系统判断带偏。`,
    },
    {
      prompt: "如果把本节知识放回真实电力电子设计里，最应该优先确认什么？",
      correct: seed.applyPriority,
      distractors: [
        "先默认器件额定值足够高，因此长期工况一定安全",
        "先把单个指标做到最好，再考虑是否破坏系统整体平衡",
        "先按理想条件做判断，寄生参数和温升可以后面再看",
      ],
      explanation: `工程上最危险的往往不是不会算，而是前提判断错了。本节强调应先确认 ${seed.applyPriority}，再继续推进设计结论。`,
    },
    {
      prompt: "下面哪一项最能代表本节真正希望你带走的结构性认识？",
      correct: seed.corePoints[1],
      distractors: [seed.pitfalls[1], seed.examples[1], seed.terms[0]],
      explanation: `${seed.corePoints[1]} 更接近本节的核心结构。其他选项要么是误区，要么是例子或术语，不能直接代表本节主线。`,
    },
    {
      prompt: "如果只用一句话概括本节最重要的结论，哪一项最合适？",
      correct: seed.takeaway,
      distractors: [seed.pitfalls[0], seed.examples[0], seed.terms[3]],
      explanation: `${seed.takeaway} 最能压缩本节真正要你带走的工程判断。`,
    },
  ];
}

function buildConversationalAiAgentSummaryContent(seed: ExampleSubchapterSeed) {
  const normalizedTerms = seed.terms.map((term) => sanitizeAiAgentChineseText(term));

  return sanitizeAiAgentChineseText([
    "## 核心概念",
    `复习这一节时，先别问自己背得全不全，而是先问自己有没有抓住主线。这一节真正要留下来的，是一套可以反复用来看系统的判断方式。`,
    ...seed.corePoints.map((point, index) => `- **复习重点 ${index + 1}：** ${point}`),
    "",
    `如果你现在只记得一些词，却说不清它们为什么会一起出现，那通常说明理解还在表层。更好的复习方式，是试着把这些点重新串成一条因果链。`,
    "",
    "## 常见误区",
    `复习阶段最容易被忽略的，其实就是误区。但很多系统真正出问题，正是因为人们以为自己已经理解了。`,
    ...seed.pitfalls.map((pitfall, index) => `- **需要警惕的误区 ${index + 1}：** ${pitfall}`),
    "",
    `所以复习误区并不是为了给自己增压，而是为了让你以后看到类似方案时，能更快发现风险点。**能主动看见风险，表示你开始有结构感了。**`,
    "",
    "## 理解例子",
    `- **例子一：** ${seed.examples[0]}`,
    `- **例子二：** ${seed.examples[1]}`,
    "",
    `复习例子时，不妨再多问一步：如果把业务对象换掉、把工具换掉、把协作角色换掉，这个结构还成立吗？如果还成立，说明你抓住的就是通用机制，而不是表面故事。`,
    "",
    "## 一句话总结",
    `**${seed.takeaway}**`,
    "",
    `这句话值得留下，不是因为它短，而是因为它把本节最重要的判断压缩成了一个快速检查点。以后你看更复杂的智能体系统时，可以先用这句话过一遍，看看它是不是满足这里强调的原则。`,
    "",
    "## 关键术语",
    ...normalizedTerms.map((term) => `- **${term}：** ${explainAiAgentChineseTerm(term)}`),
  ].join("\n"));
}

function buildMainContent(courseSlug: string, seed: ExampleSubchapterSeed) {
  if (isDetailedAiAgentCourse(courseSlug)) {
    return buildConversationalAiAgentMainContent(seed);
  }

  if (isDetailedLlmCourse(courseSlug)) {
    return buildConversationalLlmMainContent(seed);
  }

  if (isDetailedQuantCourse(courseSlug)) {
    return buildConversationalQuantMainContent(seed);
  }

  if (isDetailedPowerCourse(courseSlug)) {
    return buildConversationalPowerMainContent(seed);
  }

  return [
    "## 本节讲什么",
    seed.overview,
    "",
    "## 为什么重要",
    seed.whyImportant,
    "",
    "## 与课程的关系",
    seed.connection,
    "",
    "## 直觉理解",
    seed.intuition,
    "",
    "## 核心概念",
    ...seed.corePoints.map((point) => `- ${point}`),
    "",
    "## 常见误区",
    ...seed.pitfalls.map((pitfall) => `- ${pitfall}`),
    "",
    "## 理解例子",
    `1. ${seed.examples[0]}`,
    `2. ${seed.examples[1]}`,
    "",
    "## 应用场景",
    seed.scenario,
    "",
    "## 下一步会学什么",
    seed.next,
    "",
    "## 一句话总结",
    seed.takeaway,
    "",
    "## 关键术语",
    ...seed.terms.map((term) => `- ${term}`),
  ].join("\n");
}

function buildDetailedAiAgentSummaryContent(seed: ExampleSubchapterSeed) {
  return sanitizeAiAgentChineseText([
    "## 核心概念",
    `回顾这一节时，最值得重新确认的，不是某一个零散定义，而是你是否已经围绕本节主线建立起稳定判断。下面这些概念就是这条主线的关键支点：`,
    ...seed.corePoints.map((point) => `- ${point}`),
    "",
    `如果你在复习时发现自己只能记住术语，却说不清这些概念之间的关系，那通常说明理解还停留在表层。有效的复习，不是重新背诵，而是重新组织。`,
    "",
    "## 常见误区",
    `下面这些误区值得在复习阶段再次强调，因为很多系统问题都不是“完全不懂”造成的，而是“看起来懂了，但判断方向有偏差”造成的：`,
    ...seed.pitfalls.map((pitfall) => `- ${pitfall}`),
    "",
    `复习误区的目的不是增加负担，而是帮助你在未来看到类似设计时更快察觉风险。只要你能主动识别误区，说明你已经开始具备结构判断能力。`,
    "",
    "## 理解例子",
    `- ${seed.examples[0]}`,
    `- ${seed.examples[1]}`,
    "",
    `复习例子时，建议不要停留在“这个例子我看懂了”，而是进一步问：如果把业务对象、工具类型或协作角色换掉，这个例子背后的结构是否仍然成立？一旦答案是成立的，说明你抓住的就是通用机制而不是表面故事。`,
    "",
    "## 一句话总结",
    seed.takeaway,
    "",
    `这句话之所以值得保留，不是因为它短，而是因为它压缩了本节最重要的判断框架。以后你在分析更复杂的 Agent 设计时，完全可以把这句话当作一个快速检查点，看系统是否真正满足了这一节强调的原则。`,
    "",
    "## 关键术语",
    ...seed.terms.map((term) => `- ${term}`),
  ].join("\n"));
}

function buildSummaryContent(courseSlug: string, seed: ExampleSubchapterSeed) {
  if (isDetailedAiAgentCourse(courseSlug)) {
    return buildConversationalAiAgentSummaryContent(seed);
  }

  if (isDetailedLlmCourse(courseSlug)) {
    return buildConversationalLlmSummaryContent(seed);
  }

  if (isDetailedQuantCourse(courseSlug)) {
    return buildConversationalQuantSummaryContent(seed);
  }

  if (isDetailedPowerCourse(courseSlug)) {
    return buildConversationalPowerSummaryContent(seed);
  }

  return [
    "## 核心概念",
    ...seed.corePoints.map((point) => `- ${point}`),
    "",
    "## 常见误区",
    ...seed.pitfalls.map((pitfall) => `- ${pitfall}`),
    "",
    "## 理解例子",
    `- ${seed.examples[0]}`,
    `- ${seed.examples[1]}`,
    "",
    "## 一句话总结",
    seed.takeaway,
    "",
    "## 关键术语",
    ...seed.terms.map((term) => `- ${term}`),
  ].join("\n");
}

function buildDetailedAiAgentQuizSeeds(seed: ExampleSubchapterSeed): QuizSeed[] {
  return [
    {
      prompt: sanitizeAiAgentChineseText(`从本节的整体学习目标来看，最应该优先建立的理解是什么？`),
      correct: sanitizeAiAgentChineseText(seed.quizFocus),
      distractors: [
        "先把所有术语完整背下来，系统关系以后再补",
        "优先追求最复杂的实现细节，而不是先判断结构是否合理",
        "把本节只看成局部技巧，不必考虑它和整门课程主线的关系",
      ].map(sanitizeAiAgentChineseText) as [string, string, string],
      explanation: sanitizeAiAgentChineseText(`本节真正强调的是主线判断，而不是术语记忆或实现堆砌。${seed.quizFocus}，这会决定你后面对系统机制的理解是否有稳定落点。`),
    },
    {
      prompt: sanitizeAiAgentChineseText(`下面哪一项最符合本节提醒你的典型误区？`),
      correct: sanitizeAiAgentChineseText(seed.pitfalls[0]),
      distractors: [
        sanitizeAiAgentChineseText(seed.corePoints[0]),
        sanitizeAiAgentChineseText(seed.examples[0]),
        sanitizeAiAgentChineseText(seed.applyPriority),
      ],
      explanation: sanitizeAiAgentChineseText(`这道题不是在考你是否记住了原句，而是在考你能否区分“结构性错误”和“正确理解路径”。${seed.pitfalls[0]} 是本节明确提醒你要避免的偏差。`),
    },
    {
      prompt: sanitizeAiAgentChineseText(`如果把本节知识放回真实系统分析中，最应该优先确认什么？`),
      correct: sanitizeAiAgentChineseText(seed.applyPriority),
      distractors: [
        "先把所有参数调到极端，再看系统能否继续工作",
        "先追求展示效果和链路长度，原理可以最后再补",
        "默认外部环境始终理想，不必为误差和扰动留下空间",
      ].map(sanitizeAiAgentChineseText) as [string, string, string],
      explanation: sanitizeAiAgentChineseText(`本节并不鼓励从表面效果出发，而是强调先确认结构前提。真实场景里，先确认 ${seed.applyPriority}，后续判断才不会建立在错误基础上。`),
    },
    {
      prompt: sanitizeAiAgentChineseText(`下面哪一项最能代表本节希望你带走的结构性认识？`),
      correct: sanitizeAiAgentChineseText(seed.corePoints[1]),
      distractors: [
        sanitizeAiAgentChineseText(seed.pitfalls[1]),
        sanitizeAiAgentChineseText(seed.examples[1]),
        sanitizeAiAgentChineseText(seed.terms[0]),
      ],
      explanation: sanitizeAiAgentChineseText(`${seed.corePoints[1]} 更接近本节真正要你建立的结构认识。其余选项要么是误区，要么是例子或术语，并不能直接代表本节的核心机制。`),
    },
    {
      prompt: sanitizeAiAgentChineseText(`如果只用一句话概括本节最重要的结论，下面哪一项最合适？`),
      correct: sanitizeAiAgentChineseText(seed.takeaway),
      distractors: [
        sanitizeAiAgentChineseText(seed.pitfalls[0]),
        sanitizeAiAgentChineseText(seed.examples[0]),
        sanitizeAiAgentChineseText(seed.terms[3]),
      ],
      explanation: sanitizeAiAgentChineseText(`这道题检验的是你能否把一整节内容压缩成清晰结论。${seed.takeaway} 最能概括本节要你带走的核心判断。`),
    },
  ];
}

function buildQuizSeeds(courseSlug: string, seed: ExampleSubchapterSeed): QuizSeed[] {
  if (isDetailedAiAgentCourse(courseSlug)) {
    return buildDetailedAiAgentQuizSeeds(seed);
  }

  if (isDetailedLlmCourse(courseSlug)) {
    return buildDetailedLlmQuizSeeds(seed);
  }

  if (isDetailedQuantCourse(courseSlug)) {
    return buildDetailedQuantQuizSeeds(seed);
  }

  if (isDetailedPowerCourse(courseSlug)) {
    return buildDetailedPowerQuizSeeds(seed);
  }

  return [
    {
      prompt: `本节最应该优先建立的理解是什么？`,
      correct: seed.quizFocus,
      distractors: [
        "只要先背下全部术语，机制以后再说",
        "优先追求最复杂的实现细节，而不是判断结构是否合理",
        "把本节看成独立技巧，不必考虑它与整门课的关系",
      ],
      explanation: `这道题的关键在于先抓住本节的主线。${seed.quizFocus}，这样后面的细节才有落点。`,
    },
    {
      prompt: `下面哪一项更像本节提醒你的常见误区？`,
      correct: seed.pitfalls[0],
      distractors: [seed.corePoints[0], seed.examples[0], seed.applyPriority],
      explanation: `本节特别提醒不要犯这个误区：${seed.pitfalls[0]}。其余选项更接近正确做法或理解路径。`,
    },
    {
      prompt: `如果你要把本节知识用于真实问题，最该先确认什么？`,
      correct: seed.applyPriority,
      distractors: [
        "先把所有参数调到最极端，再观察是否还能工作",
        "先追求界面或展示效果，原理可以最后再补",
        "先假设环境永远理想，不必给误差和扰动留空间",
      ],
      explanation: `真实场景里，先确认 ${seed.applyPriority}，才能避免后续判断建立在错误前提上。`,
    },
    {
      prompt: `下面哪一项更能代表本节的核心机制或结构要点？`,
      correct: seed.corePoints[1],
      distractors: [seed.pitfalls[1], seed.examples[1], seed.terms[0]],
      explanation: `这道题关注的是本节对机制结构的主张。${seed.corePoints[1]} 更接近本节要你建立的思考框架。`,
    },
    {
      prompt: `如果只用一句话抓住本节的最终结论，下面哪一项最合适？`,
      correct: seed.takeaway,
      distractors: [seed.pitfalls[0], seed.examples[0], seed.terms[3]],
      explanation: `这道题检验的是总结能力。${seed.takeaway} 最能概括本节要你带走的核心判断。`,
    },
  ];
}

function buildQuizContent(courseSlug: string, seed: ExampleSubchapterSeed) {
  return JSON.stringify(
    {
      questions: buildQuizSeeds(courseSlug, seed).map((question, index) => ({
        id: index + 1,
        question: question.prompt,
        options: [
          question.correct,
          question.distractors[0],
          question.distractors[1],
          question.distractors[2],
        ],
        correctAnswer: 0,
        explanation: question.explanation,
      })),
    },
    null,
    2
  );
}

function translateExampleTermToEnglish(term: string) {
  const glossary: Record<string, string> = {
    上下文: "Context",
    上下文窗口: "Context Window",
    下一个词预测: "Next-Token Prediction",
    二极管: "Diode",
    交易成本: "Transaction Costs",
    人工接管: "Human Override",
    仓位管理: "Position Sizing",
    任务拆解: "Task Decomposition",
    保护栏: "Guardrails",
    偏好优化: "Preference Optimization",
    前视偏差: "Look-Ahead Bias",
    动作: "Action",
    占空比: "Duty Cycle",
    交越频率: "Crossover Frequency",
    伏秒平衡: "Volt-Second Balance",
    共模噪声: "Common-Mode Noise",
    器件应力: "Device Stress",
    反馈闭环: "Feedback Loop",
    因子: "Factor",
    复权: "Adjusted Prices",
    失败回放: "Failure Replay",
    对齐: "Alignment",
    导通损耗: "Conduction Loss",
    导通模式: "Conduction Mode",
    工作记忆: "Working Memory",
    工具调用: "Tool Invocation",
    带宽: "Bandwidth",
    延迟: "Latency",
    开关损耗: "Switching Loss",
    开关节点: "Switch Node",
    开关频率: "Switching Frequency",
    异常值: "Outlier",
    引用证据: "Grounded Evidence",
    总拥有成本: "Total Cost of Ownership",
    成功判据: "Success Criteria",
    指令微调: "Instruction Tuning",
    收益率: "Returns",
    断续导通: "Discontinuous Conduction",
    时间对齐: "Time Alignment",
    最大回撤: "Maximum Drawdown",
    权限边界: "Permission Boundary",
    样本外验证: "Out-of-Sample Validation",
    检索增强: "Retrieval Augmentation",
    检索策略: "Retrieval Strategy",
    滑点: "Slippage",
    漏感: "Leakage Inductance",
    热阻: "Thermal Resistance",
    热路径: "Thermal Path",
    生存者偏差: "Survivorship Bias",
    电容: "Capacitor",
    电感: "Inductor",
    电流路径: "Current Path",
    电荷平衡: "Charge Balance",
    相位裕度: "Phase Margin",
    相关性: "Correlation",
    离线评测: "Offline Evaluation",
    线上监控: "Online Monitoring",
    经济含义: "Economic Rationale",
    纹波: "Ripple",
    补偿器: "Compensator",
    双脉冲测试: "Double-Pulse Test",
    观察: "Observation",
    评测集: "Evaluation Set",
    过拟合: "Overfitting",
    连续导通: "Continuous Conduction",
    安全工作区: "Safe Operating Area",
    寄生参数: "Parasitics",
    小信号模型: "Small-Signal Model",
    平均模型: "Averaged Model",
    回路面积: "Loop Area",
    差模噪声: "Differential-Mode Noise",
    栅极驱动: "Gate Drive",
    死区时间: "Dead Time",
    磁芯损耗: "Core Loss",
    结温: "Junction Temperature",
    储能元件: "Energy Storage Element",
    效率预算: "Efficiency Budget",
    铜损: "Copper Loss",
    降额设计: "Derating",
    重试策略: "Retry Strategy",
    长期记忆: "Long-Term Memory",
    闭环响应: "Closed-Loop Response",
    预训练: "Pretraining",
    风险预算: "Risk Budget",
  };

  return glossary[term] ?? term;
}

function getEnglishCourseLens(courseSlug: string) {
  if (courseSlug === "ai-agent-development") {
    return {
      field: "multi-agent system design",
      metaphor:
        "A useful picture is a small team in which different roles observe, decide, execute, and review one another.",
      scenario:
        "In real agent products, this topic affects whether the system stays reliable when tasks become long, messy, and interdependent.",
      pitfall:
        "confusing visible output quality with real structural reliability",
    };
  }

  if (courseSlug === "llm-principles" || courseSlug === "large-language-models") {
    return {
      field: "LLM behavior and system tradeoffs",
      metaphor:
        "A helpful mental model is a work desk with limited space, where only the most relevant information should be kept in view.",
      scenario:
        "In practical LLM systems, this topic determines whether the model reasons from the right evidence under cost and latency constraints.",
      pitfall:
        "judging the model only by polished answers instead of the mechanism behind them",
    };
  }

  if (courseSlug === "quant-finance-analysis") {
    return {
      field: "quantitative research and backtesting",
      metaphor:
        "It helps to think like a lab researcher who must calibrate instruments before trusting any measurement.",
      scenario:
        "In real quant workflows, this topic affects whether research survives the move from a notebook to live decision-making.",
      pitfall:
        "trusting attractive historical results before checking data quality, assumptions, and constraints",
    };
  }

  return {
    field: "power-electronics system design",
    metaphor:
      "A useful picture is energy flowing through a controlled path, where timing, storage, and feedback must stay balanced.",
    scenario:
      "In real converter design, this topic affects efficiency, thermal stress, controllability, and long-term operating stability.",
    pitfall:
      "optimizing one component or formula while ignoring the behavior of the full energy path",
  };
}

function getEnglishTermExplanations(terms: string[]) {
  return terms.map((term) => {
    const translated = translateExampleTermToEnglish(term);
    return `- **${translated}:** A key concept for understanding how this lesson works inside a real system.`;
  });
}

function getEnglishExamples(
  courseSlug: string,
  titleEn: string,
  termA: string,
  termB: string
) {
  if (courseSlug === "ai-agent-development") {
    return [
      `An agent assistant may produce fluent text, but if its ${termA.toLowerCase()} is weak and its ${termB.toLowerCase()} is uncontrolled, the overall system will still behave unreliably.`,
      `A multi-agent workflow can look impressive in a demo, yet fail in production if responsibilities are unclear and no one catches cascading mistakes.`,
    ] as const;
  }

  if (courseSlug === "llm-principles" || courseSlug === "large-language-models") {
    return [
      `A model may answer confidently from memory, but the result becomes much more trustworthy when the right evidence is retrieved and framed inside the active context.`,
      `A longer context does not automatically mean a better answer; if irrelevant material dominates the prompt, the model often loses the real question.`,
    ] as const;
  }

  if (courseSlug === "quant-finance-analysis") {
    return [
      `A strategy can look strong in a chart, yet the conclusion changes once ${termA.toLowerCase()} and execution frictions are modeled correctly.`,
      `A signal may appear predictive in one sample period, but without stable evidence and clean validation it can disappear when market conditions change.`,
    ] as const;
  }

  return [
    `A converter may meet a target on paper, yet behave very differently once ${termA.toLowerCase()} and ${termB.toLowerCase()} are considered together under switching conditions.`,
    `A fast response can look attractive in isolation, but if the control loop sacrifices stability margins, the full system becomes harder to trust.`,
  ] as const;
}

function buildMainContentEn(courseSlug: string, seed: ExampleSubchapterSeed) {
  const lens = getEnglishCourseLens(courseSlug);
  const translatedTerms = seed.terms.map(translateExampleTermToEnglish);
  const [exampleOne, exampleTwo] = getEnglishExamples(
    courseSlug,
    seed.titleEn,
    translatedTerms[0] ?? "core state",
    translatedTerms[1] ?? "control logic"
  );

  return [
    "## What this section is about",
    `${seed.learningObjectiveEn}`,
    "",
    `This lesson focuses on **${seed.titleEn}** as part of ${lens.field}. Read it as a system concept rather than an isolated definition. The goal is to understand what role this idea plays, what problem it solves, and what tends to fail when it is misunderstood.`,
    "",
    "## Why it matters",
    `This topic matters because it shapes how a real system interprets information, makes decisions, and produces stable outcomes. When learners skip the mechanism and focus only on the visible result, they often miss the deeper reason a design succeeds or breaks.`,
    "",
    "## How this connects to the course",
    `Within the course, **${seed.titleEn}** is not a side topic. It supports later decisions about architecture, reliability, evaluation, and tradeoffs. If this idea is clear, later chapters feel connected; if it is vague, later content becomes a list of disconnected tricks.`,
    "",
    "## Intuitive explanation",
    lens.metaphor,
    "",
    `A useful way to study this lesson is to ask: what does the system need to observe, what does it need to decide, and what must happen for that decision to become a dependable action? That perspective turns terminology into something you can actually reason with.`,
    "",
    "## Core concepts",
    `- **Core idea 1:** ${seed.learningObjectiveEn}`,
    `- **Core idea 2:** The lesson is best understood by linking **${translatedTerms[0] ?? "the main concept"}**, **${translatedTerms[1] ?? "the supporting mechanism"}**, and **${translatedTerms[2] ?? "the operating constraint"}** instead of studying them in isolation.`,
    `- **Core idea 3:** Real understanding comes from seeing how this topic affects reliability, not from memorizing the label alone.`,
    "",
    "## Common misunderstandings",
    `- **Misunderstanding 1:** Treating ${seed.titleEn.toLowerCase()} as a local trick instead of a system-level design choice.`,
    `- **Misunderstanding 2:** ${lens.pitfall.charAt(0).toUpperCase()}${lens.pitfall.slice(1)}.`,
    "",
    "## Minimal examples for understanding",
    `1. **Example one:** ${exampleOne}`,
    `2. **Example two:** ${exampleTwo}`,
    "",
    `These examples matter because they help you transfer the idea. If you can recognize the same structure after the business setting, tools, or operating conditions change, the lesson has moved from short-term recognition to durable understanding.`,
    "",
    "## Real-world or engineering scenarios",
    lens.scenario,
    "",
    `A practical check is to ask four questions: what is the real objective, where does the critical state live, what feedback keeps behavior on track, and where is failure most likely to appear first? Those questions help convert course knowledge into system judgment.`,
    "",
    "## What this prepares you for next",
    `The next lesson builds on this foundation rather than replacing it. You are moving from understanding the role of **${seed.titleEn}** to seeing how it interacts with broader system structure, tradeoffs, and failure handling.`,
    "",
    "## Key takeaway",
    `**${seed.titleEn} should be understood as a structural part of the system, not as a surface-level feature.**`,
    "",
    `If you can restate that idea in your own words and explain why it matters under real constraints, you are already much closer to operational understanding than to simple recall.`,
    "",
    "## Key terms",
    ...getEnglishTermExplanations(translatedTerms),
  ].join("\n");
}

function buildSummaryContentEn(courseSlug: string, seed: ExampleSubchapterSeed) {
  const translatedTerms = seed.terms.map(translateExampleTermToEnglish);

  return [
    "## Core concepts",
    `Review this lesson by returning to the main question: what role does **${seed.titleEn}** play inside a real ${getEnglishCourseLens(courseSlug).field}?`,
    `- **Review point 1:** ${seed.learningObjectiveEn}`,
    `- **Review point 2:** The lesson becomes clearer when you connect ${translatedTerms[0] ?? "the core concept"}, ${translatedTerms[1] ?? "the supporting mechanism"}, and the final system outcome.`,
    `- **Review point 3:** Structural understanding is more valuable than surface familiarity.`,
    "",
    "## Common misunderstandings",
    `- **Watch for this:** treating the topic as an isolated trick instead of part of a larger decision chain.`,
    `- **Watch for this:** focusing on polished results before checking whether the underlying mechanism is reliable.`,
    "",
    "## Minimal examples for understanding",
    `- Ask whether the same logic would still hold if the data source, system role, or operating constraint changed.`,
    `- If the structure still makes sense after that change, you are probably understanding the mechanism rather than the story around it.`,
    "",
    "## Key takeaway",
    `**The value of ${seed.titleEn} lies in how it improves system understanding, control, and reliability under real constraints.**`,
    "",
    "## Key terms",
    ...getEnglishTermExplanations(translatedTerms),
  ].join("\n");
}

function buildQuizSeedsEn(courseSlug: string, seed: ExampleSubchapterSeed): QuizSeed[] {
  const translatedTerms = seed.terms.map(translateExampleTermToEnglish);
  const lens = getEnglishCourseLens(courseSlug);

  return [
    {
      prompt: `What should come first when studying ${seed.titleEn}?`,
      correct: seed.learningObjectiveEn,
      distractors: [
        "Memorizing every term before understanding the system role",
        "Optimizing the final result before identifying the operating mechanism",
        "Treating the topic as a narrow trick with no effect on later lessons",
      ],
      explanation:
        "The right starting point is the learning objective itself. This lesson is designed to build structural understanding before optimization or memorization.",
    },
    {
      prompt: `Which statement best reflects the role of ${translatedTerms[0] ?? "the core concept"} in this lesson?`,
      correct: `It helps explain how ${seed.titleEn.toLowerCase()} works inside a real system.`,
      distractors: [
        "It matters only for terminology recall",
        "It replaces the need to study system constraints",
        "It is useful only after the entire course is complete",
      ],
      explanation:
        "Key terms are valuable because they clarify mechanism and system behavior, not because they are labels to memorize in isolation.",
    },
    {
      prompt: `Which is the strongest system-level question to ask in a real scenario?`,
      correct:
        "What objective the system is pursuing, what state it relies on, and what feedback keeps it on track",
      distractors: [
        "Whether the output looks impressive at first glance",
        "Whether the workflow contains as many steps as possible",
        "Whether one parameter can be pushed to an extreme value",
      ],
      explanation:
        "The lesson emphasizes structural analysis: objective, state, feedback, and failure exposure matter more than surface appearance.",
    },
    {
      prompt: `What is a common misunderstanding related to ${seed.titleEn}?`,
      correct: `${lens.pitfall.charAt(0).toUpperCase()}${lens.pitfall.slice(1)}.`,
      distractors: [
        "Checking how the topic fits into the larger course",
        "Using examples to test whether understanding transfers",
        "Reviewing the topic as part of a broader decision chain",
      ],
      explanation:
        "A common failure pattern is to judge the system by appearance alone instead of by the mechanism that keeps it reliable.",
    },
    {
      prompt: `Which takeaway best captures the purpose of this lesson?`,
      correct: `To understand ${seed.titleEn} as a structural part of the system rather than a surface feature`,
      distractors: [
        "To replace all later lessons with one shortcut",
        "To focus only on the final answer and ignore the process",
        "To memorize terminology without relating it to behavior",
      ],
      explanation:
        "The lesson is meant to strengthen system judgment. Its purpose is to make the mechanism, role, and constraints of the topic visible.",
    },
  ];
}

function buildQuizContentEn(courseSlug: string, seed: ExampleSubchapterSeed) {
  return JSON.stringify(
    {
      questions: buildQuizSeedsEn(courseSlug, seed).map((question, index) => ({
        id: index + 1,
        question: question.prompt,
        options: [
          question.correct,
          question.distractors[0],
          question.distractors[1],
          question.distractors[2],
        ],
        correctAnswer: 0,
        explanation: question.explanation,
      })),
    },
    null,
    2
  );
}

function makeLessonId(
  courseSlug: string,
  chapterSlug: string,
  subchapterSlug: string,
  lessonType: ExampleLessonType
) {
  return `example:${courseSlug}:${chapterSlug}:${subchapterSlug}:${lessonType}:zh`;
}

function buildLesson(
  courseSlug: string,
  chapterSlug: string,
  subchapterSlug: string,
  lessonType: ExampleLessonType,
  body: string,
  bodyEn?: string
): ExampleLesson {
  return {
    id: makeLessonId(courseSlug, chapterSlug, subchapterSlug, lessonType),
    contentType: lessonType,
    lang: "zh",
    status: "ready",
    body,
    bodyEn,
  };
}

function toExampleSubchapter(
  courseSlug: string,
  chapterSlug: string,
  orderIndex: number,
  seed: ExampleSubchapterSeed
): ExampleSubchapter {
  const lessons = {
    main: buildLesson(
      courseSlug,
      chapterSlug,
      seed.slug,
      "main",
      buildMainContent(courseSlug, seed),
      buildMainContentEn(courseSlug, seed)
    ),
    summary: buildLesson(
      courseSlug,
      chapterSlug,
      seed.slug,
      "summary",
      buildSummaryContent(courseSlug, seed),
      buildSummaryContentEn(courseSlug, seed)
    ),
    quiz: buildLesson(
      courseSlug,
      chapterSlug,
      seed.slug,
      "quiz",
      buildQuizContent(courseSlug, seed),
      buildQuizContentEn(courseSlug, seed)
    ),
  } satisfies Record<ContentType, ExampleLesson>;

  return {
    id: `example:${courseSlug}:${chapterSlug}:${seed.slug}`,
    slug: seed.slug,
    title: seed.title,
    titleEn: seed.titleEn,
    orderIndex,
    learningObjective: seed.learningObjective,
    learningObjectiveEn: seed.learningObjectiveEn,
    lessons,
    contents: (["main", "summary", "quiz"] as const).map((contentType) => ({
      id: lessons[contentType].id,
      contentType,
      status: "ready" as const,
      lang: "zh" as const,
    })),
  };
}

function toExampleChapter(
  courseSlug: string,
  orderIndex: number,
  seed: ExampleChapterSeed
): ExampleChapter {
  return {
    id: `example:${courseSlug}:${seed.slug}`,
    slug: seed.slug,
    title: seed.title,
    titleEn: seed.titleEn,
    orderIndex,
    subchapters: seed.subchapters.map((subchapter, subchapterIndex) =>
      toExampleSubchapter(courseSlug, seed.slug, subchapterIndex, subchapter)
    ),
  };
}

function toExampleCourse(seed: ExampleCourseSeed): ExampleCourse {
  return {
    id: `example:${seed.slug}`,
    slug: seed.slug,
    title: seed.title,
    titleEn: seed.titleEn,
    topic: seed.topic,
    topicEn: seed.topicEn,
    description: seed.description,
    descriptionEn: seed.descriptionEn,
    goals: [...seed.goals],
    goalsEn: [...seed.goalsEn],
    chapters: seed.chapters.map((chapter, chapterIndex) =>
      toExampleChapter(seed.slug, chapterIndex, chapter)
    ),
  };
}

const exampleCourseSeeds: ExampleCourseSeed[] = [
  {
    slug: "ai-agent-development",
    title: "AI Agent开发",
    titleEn: "AI Agent Development",
    topic: "AI Agent开发",
    topicEn: "AI Agent Development",
    description:
      "这门官方示例课从 Agent 的最小闭环出发，带你理解工具调用、记忆、工作流编排、评测与安全。它不是演示输入，而是一套已经准备好的完整入门课程。",
    descriptionEn:
      "This official sample course starts from the smallest viable agent loop and walks through tool use, memory, orchestration, evaluation, and safety. It is a fully loaded course, not a prompt demo.",
    goals: [
      "把 AI Agent 看成可观察、可行动、可纠偏的系统，而不是一次模型调用",
      "理解记忆、工具、工作流和评测之间如何配合",
      "具备把 Agent 做成可上线原型的基本判断框架",
    ],
    goalsEn: [
      "See an AI agent as an observable, actionable, corrigible system rather than a single model call",
      "Understand how memory, tools, workflows, and evaluation fit together",
      "Build a practical judgment framework for taking an agent prototype toward production",
    ],
    chapters: [
      {
        slug: "agent-foundations",
        title: "Agent 闭环与能力边界",
        titleEn: "Agent Loops and Capability Boundaries",
        subchapters: [
          {
            slug: "tool-calling-action-loops",
            title: "工具调用与行动闭环",
            titleEn: "Tool Calling and Action Loops",
            learningObjective: "理解 Agent 为什么必须围绕目标、动作、观察和反馈形成闭环。",
            learningObjectiveEn:
              "Understand why agents must be organized around a loop of goal, action, observation, and feedback.",
            overview:
              "本节聚焦 Agent 最小可工作的结构：先有目标，再基于上下文选择动作，随后读取外部结果并决定下一步。你会看到“会调工具”只是表面，真正关键的是闭环是否稳定。",
            whyImportant:
              "如果你把 Agent 理解成“模型 + 一个函数调用”，系统一复杂就会失控。只有把动作和反馈纳入同一回路，才能解释为什么它有时成功、有时会漂移。",
            connection:
              "这是整门课的起点。后面的记忆、编排、评测和安全，都是在这个闭环上增加能力与约束，而不是另起炉灶。",
            intuition:
              "可以把 Agent 想成一个带笔记本的实习生。它先读任务，再决定要不要查资料、调用工具、请示用户，看到结果后再修正动作，而不是一次性把所有答案蒙出来。",
            corePoints: [
              "Agent 的核心不是“会说话”，而是“能在多轮中根据反馈调整动作”。",
              "工具调用把 Agent 的能力从纯文本推理扩展到搜索、计算、检索和执行。",
              "每一轮动作都应该产生可观察结果，否则系统无法判断是否继续、回退或停下。",
            ],
            pitfalls: [
              "把一次模型回答误当成完整 Agent，而没有设计观察结果和下一步决策。",
              "默认工具调用越多越强，忽略了动作成本、错误传播和回退机制。",
            ],
            examples: [
              "让 Agent 查天气时，真正有价值的不是“调用了天气 API”，而是它会先确认城市、读取返回值，再判断是否还要补充穿衣建议。",
              "让 Agent 帮你做调研时，如果搜索结果质量差，它应该重新改写查询词，而不是把第一批噪声结果直接包装成结论。",
            ],
            scenario:
              "在客服自动化、研究助手和办公流程自动化中，闭环都决定了体验上限。一个只会产出漂亮文字、却不会根据外部反馈纠错的系统，很快就会在真实任务里暴露问题。",
            next:
              "下一节会把闭环再推进一步，讨论 Agent 在多轮行动中如何保留状态，避免每一轮都像失忆一样重新开始。",
            takeaway: "Agent 的最小单位不是一次回答，而是“目标 + 动作 + 观察 + 反馈”的循环。",
            terms: ["工具调用", "动作", "观察", "反馈闭环"],
            quizFocus: "先把 Agent 理解成带反馈的行动闭环，而不是一次性回答器",
            applyPriority: "任务目标、可用动作和反馈信号是否定义清楚",
          },
          {
            slug: "memory-and-state",
            title: "记忆、状态与上下文",
            titleEn: "Memory, State, and Context",
            learningObjective: "理解短期上下文、工作记忆和持久记忆在 Agent 中各自承担什么角色。",
            learningObjectiveEn:
              "Understand the roles of short-term context, working memory, and persistent memory in an agent system.",
            overview:
              "本节把“Agent 记住什么、怎么记、记多久”拆开来看。你会区分提示词里的即时上下文、流程内的工作状态，以及跨任务保留的长期记忆。",
            whyImportant:
              "很多 Agent 失败并不是模型不会想，而是系统根本没有把关键状态保存下来，导致重复问问题、上下文打架、或者在长任务里逐步失真。",
            connection:
              "上一节建立了行动闭环，本节补上闭环里的状态容器。没有状态，工作流编排和评测记录都很难稳定落地。",
            intuition:
              "把记忆想成三层抽屉。桌面上摊开的纸是当前上下文，随手记的 TODO 是工作记忆，文件柜里按主题归档的资料才是长期记忆。",
            corePoints: [
              "上下文窗口适合放当前必须参与推理的信息，但不是长期存储系统。",
              "工作记忆负责追踪任务阶段、已调用工具、待确认事项等流程状态。",
              "长期记忆只有在检索规则清楚时才有价值，否则只会把旧噪声不断带回当前推理。",
            ],
            pitfalls: [
              "把所有历史对话无差别塞回上下文，导致重点被淹没、成本升高、判断变慢。",
              "把“保存过数据”误认为“系统真正记住了”，忽略了后续检索和更新策略。",
            ],
            examples: [
              "做面试助手时，候选人的岗位、级别和最近回答属于当前上下文；“已经追问过项目难点”更像工作记忆；候选人历史偏好则适合放长期记忆。",
              "做个人学习助手时，当前课程目标在上下文里，今日任务清单在工作记忆里，长期弱项标签和常见误区则更适合做成可检索资料。",
            ],
            scenario:
              "在长任务、多步骤审批、客户关系维护等场景里，状态设计直接影响用户是否觉得系统“真的记得我在做什么”，还是每走两步就要重新解释背景。",
            next:
              "接下来会进入工作流编排，看看当 Agent 有了状态以后，如何把多步任务拆成可控的执行路径。",
            takeaway: "记忆不是越多越好，而是要让不同层级的信息各待其位、各司其职。",
            terms: ["上下文窗口", "工作记忆", "长期记忆", "检索策略"],
            quizFocus: "先区分不同层级的状态用途，再决定信息应该放在哪里",
            applyPriority: "当前推理必需的信息与长期可复用的信息是否被分开",
          },
        ],
      },
      {
        slug: "reliable-agent-systems",
        title: "可靠 Agent 系统设计",
        titleEn: "Reliable Agent System Design",
        subchapters: [
          {
            slug: "workflow-orchestration",
            title: "工作流编排与任务拆解",
            titleEn: "Workflow Orchestration and Task Decomposition",
            learningObjective: "学会把复杂任务拆成可检查、可回退、可组合的步骤。",
            learningObjectiveEn:
              "Learn how to break complex tasks into steps that can be checked, rolled back, and composed.",
            overview:
              "本节关注 Agent 如何从“能做事”变成“做事可控”。重点不在炫技，而在于怎样把复杂目标切成阶段，让每一步都能判断是否成功。",
            whyImportant:
              "没有编排，Agent 很容易在长链路中越走越偏；有了编排，你才知道失败发生在哪一层，是工具问题、信息不足，还是拆解本身不合理。",
            connection:
              "前两节讲了闭环和状态，本节把它们接成执行路径。后面的评测和安全，也都要围绕这些步骤来观测。",
            intuition:
              "像带团队做项目一样，先分阶段，再定义每阶段的完成标准。不是把一个大任务丢出去等奇迹，而是让系统逐段推进、逐段验收。",
            corePoints: [
              "任务拆解的价值在于降低单步不确定性，而不是机械地把流程切得越碎越好。",
              "每一步都需要输入、输出和成功判据，否则链路很难排错。",
              "编排层决定何时继续、重试、人工接管或终止，是可靠性的核心杠杆。",
            ],
            pitfalls: [
              "只关注链路长度和工具数量，忽略每一步是否真的可验证。",
              "把所有失败都交给模型自己解释，导致流程层没有明确的回退规则。",
            ],
            examples: [
              "生成市场分析报告时，可以先拆成搜集资料、提取结论、生成提纲、撰写正文四步，每一步都有独立的检查点。",
              "做自动化客服时，先识别意图，再查订单，再生成回复，比让模型直接“一口气解决所有问题”更容易排查错误来源。",
            ],
            scenario:
              "在报销审批、销售跟进、代码审查建议等流程里，可编排的步骤能让团队知道系统在哪一步可靠、哪一步还需要人工兜底。",
            next:
              "下一节会讨论如果流程已经拆好了，如何评估它是否稳、是否安全，以及哪些指标值得长期追踪。",
            takeaway: "编排的本质是给复杂任务加上阶段边界和可验证出口。",
            terms: ["任务拆解", "成功判据", "重试策略", "人工接管"],
            quizFocus: "先让每一步变得可验证，再追求更长更复杂的自动化链路",
            applyPriority: "每个步骤的输入、输出和成功判据是否明确",
          },
          {
            slug: "evaluation-and-safety",
            title: "评测、保护栏与上线安全",
            titleEn: "Evaluation, Guardrails, and Launch Safety",
            learningObjective: "理解 Agent 上线前后应如何评估质量、控制风险并设置保护栏。",
            learningObjectiveEn:
              "Understand how to evaluate quality, control risk, and establish guardrails before and after launch.",
            overview:
              "本节讨论“能跑”之后的下一步：怎样证明 Agent 值得信任。你会看到评测不是一次性的验收，而是和监控、保护栏一起构成持续治理机制。",
            whyImportant:
              "真实世界里，Agent 失败的成本往往不只是一次答错，还可能是错误操作、权限越界、误导用户或放大业务损失。",
            connection:
              "前面的闭环、记忆和编排决定了系统结构，本节则给这套结构加上质量门槛，让它从 demo 靠近产品。",
            intuition:
              "像开车一样，动力系统再强也要有仪表盘、刹车和护栏。评测告诉你车况如何，保护栏决定失控时能否及时止损。",
            corePoints: [
              "评测要覆盖正确性、稳定性、延迟、成本和用户可恢复性，而不只是最终答案看起来像不像对。",
              "保护栏包括权限边界、敏感操作确认、工具白名单和高风险场景的人机协作策略。",
              "上线后仍需持续收集失败案例，因为真实流量总会暴露离线评测没覆盖的边角。",
            ],
            pitfalls: [
              "把几次手工演示成功当成系统可靠，忽略不同输入分布下的失效模式。",
              "只在模型层谈安全，不在工具、权限和流程层设置明确约束。",
            ],
            examples: [
              "给邮件助手加保护栏时，不应只评估回复语气，还要限制发送范围、要求关键邮件二次确认，并记录失败回放。",
              "给数据分析 Agent 做评测时，除了看结论是否合理，也要追踪它是否频繁调用无关工具、是否在低价值任务上浪费成本。",
            ],
            scenario:
              "任何会读写外部系统、影响客户体验或消耗预算的 Agent，都需要上线前评测和上线后监控双保险，否则问题只会在真实用户身上首次暴露。",
            next:
              "到这里你已经有了一套 Agent 从原理到上线判断的主线，后续可以继续结合具体业务场景做更深入的实战化扩展。",
            takeaway: "评测决定你看见问题的能力，保护栏决定问题出现时你能否承受后果。",
            terms: ["评测集", "保护栏", "权限边界", "失败回放"],
            quizFocus: "把评测和保护栏看成 Agent 产品化的基础设施，而不是上线前的附属检查",
            applyPriority: "高风险动作的权限边界和失败后的止损机制是否清楚",
          },
        ],
      },
    ],
  },
  {
    slug: "llm-principles",
    title: "大语言模型原理与应用",
    titleEn: "Large Language Models: Principles and Applications",
    topic: "大语言模型原理与应用",
    topicEn: "Large Language Models: Principles and Applications",
    description:
      "这门官方示例课帮助你从 token、预测目标、预训练、指令微调一路走到上下文、检索增强、系统评估与应用取舍，建立理解大语言模型的整体地图。",
    descriptionEn:
      "This official sample course builds a full mental map of large language models from tokens and prediction objectives to pretraining, instruction tuning, context windows, retrieval, evaluation, and practical application tradeoffs.",
    goals: [
      "用系统视角理解 LLM 是如何学会语言模式的",
      "分清预训练、指令对齐、检索增强在系统中的职责",
      "具备讨论模型效果、成本和风险取舍的基础框架",
    ],
    goalsEn: [
      "Understand how LLMs learn language patterns from a systems perspective",
      "Separate the roles of pretraining, alignment, and retrieval augmentation",
      "Build a foundation for reasoning about quality, cost, and risk tradeoffs",
    ],
    chapters: [
      {
        slug: "modeling-basics",
        title: "建模基础与训练阶段",
        titleEn: "Modeling Basics and Training Stages",
        subchapters: [
          {
            slug: "tokens-and-next-token-prediction",
            title: "Token、表示与下一个词预测",
            titleEn: "Tokens, Representations, and Next-Token Prediction",
            learningObjective: "理解 token 化、向量表示和下一个词预测为何构成 LLM 的最小原理。",
            learningObjectiveEn:
              "Understand why tokenization, vector representations, and next-token prediction form the minimal principle behind LLMs.",
            overview:
              "本节从最基本的问题出发：模型究竟在“看见”什么，又在“预测”什么。你会理解 token 化如何把文本变成可计算对象，以及预测目标为何能逼出语言能力。",
            whyImportant:
              "如果不理解模型最底层的训练目标，就很容易把 LLM 的表现误解成神秘智能，而忽略它其实是在海量模式中学习条件分布。",
            connection:
              "这是整门课的地基。后续讨论预训练、对齐和检索增强时，都会回到“模型本质上如何做预测”这一问题。",
            intuition:
              "可以把模型想成一个极其擅长补全句子的系统。它并不是先有完整世界模型再说话，而是在补全过程中逐步显现出对语法、常识和结构的掌握。",
            corePoints: [
              "Token 是模型处理文本的基本颗粒度，颗粒度设计会影响成本、长度和表达效率。",
              "Embedding 把离散 token 投射到连续空间，使模型能够学习相似性与上下文关系。",
              "下一个词预测虽然目标简单，却足以让模型在足够大数据和参数下学到丰富的统计结构。",
            ],
            pitfalls: [
              "把 token 直接等同于“单词”或“汉字”，忽略不同分词策略下的真实计算单位。",
              "以为模型是在检索固定答案，而不是根据上下文动态预测最可能的延续。",
            ],
            examples: [
              "英文里一个长单词可能会被拆成多个 token，所以“更短的回复”并不总意味着更少的计算成本。",
              "当模型看到“如果今天下雨，我会带上____”时，它不是在记忆库里查一个标准答案，而是在当前上下文下预测最合理的后续。",
            ],
            scenario:
              "当你需要控制成本、理解上下文长度限制、或者解释模型为何会在边界案例里犯错时，token 与预测目标都是最先要回到的基础层。",
            next:
              "下一节会继续讨论模型如何通过预训练和指令微调，从会续写逐步变成会配合任务的助手。",
            takeaway: "LLM 的底层机制可以概括为：把文本变成 token，再持续学习“下一步最可能是什么”。",
            terms: ["Token", "Embedding", "上下文", "下一个词预测"],
            quizFocus: "先理解模型是在做条件预测，再去谈更高层的能力表现",
            applyPriority: "输入被切成什么 token、模型在当前上下文里到底在预测什么",
          },
          {
            slug: "pretraining-and-instruction-tuning",
            title: "预训练、指令微调与对齐",
            titleEn: "Pretraining, Instruction Tuning, and Alignment",
            learningObjective: "区分预训练、指令微调和对齐在模型能力形成中的不同作用。",
            learningObjectiveEn:
              "Distinguish the roles of pretraining, instruction tuning, and alignment in shaping model behavior.",
            overview:
              "本节回答一个常见问题：为什么同样是大模型，有的更像续写器，有的更像助手？关键就在于训练阶段不同，各阶段解决的问题也不同。",
            whyImportant:
              "很多对模型能力的误判，来自把“知识储备”“任务服从性”和“安全边界”混成一件事。拆开看，才能知道问题该在哪一层解决。",
            connection:
              "上一节讲了最小训练目标，这一节则说明模型如何在此基础上继续塑形，变得更适合真实人机交互。",
            intuition:
              "预训练像大量阅读，指令微调像学会按题作答，对齐则像学会在社交和规则边界内表达。三者都重要，但解决的不是同一个问题。",
            corePoints: [
              "预训练主要建立广泛模式感知和知识压缩能力。",
              "指令微调让模型更擅长理解任务格式、遵循要求并输出结构化结果。",
              "对齐和偏好优化则更多处理回答风格、安全性与人类可接受性。",
            ],
            pitfalls: [
              "把模型答得礼貌或结构化，误当成它“本质上更懂知识”。",
              "遇到能力缺口时只从对齐层找原因，而不检查是否本来就缺少知识或任务示例。",
            ],
            examples: [
              "一个只做过预训练的模型可能很会续写文章，但面对“请给出三点结论”的指令时未必稳定。",
              "一个经过指令微调的模型更会按格式回答，但如果基础知识本来不足，结构再漂亮也不能凭空补齐事实。",
            ],
            scenario:
              "当你评估企业知识助手、客服机器人或写作助手时，要判断问题出在知识覆盖、任务执行还是安全边界，三者对应的改进路径完全不同。",
            next:
              "后面会进一步讨论上下文窗口、检索增强与 grounding，看看为什么光靠训练并不能解决所有实时知识问题。",
            takeaway: "预训练决定模型知道多少，指令微调决定模型怎么配合，对齐决定模型怎样更稳地表达。",
            terms: ["预训练", "指令微调", "偏好优化", "对齐"],
            quizFocus: "先分清不同训练阶段解决的是哪类问题",
            applyPriority: "当前问题更像知识不足、任务执行不稳，还是安全表达不到位",
          },
        ],
      },
      {
        slug: "reasoning-and-system-design",
        title: "上下文、检索与系统权衡",
        titleEn: "Context, Retrieval, and System Tradeoffs",
        subchapters: [
          {
            slug: "context-retrieval-and-grounding",
            title: "上下文窗口、检索增强与 Grounding",
            titleEn: "Context Windows, Retrieval, and Grounding",
            learningObjective: "理解为什么上下文不是无限记忆，以及检索增强如何帮助模型接入外部事实。",
            learningObjectiveEn:
              "Understand why context is not infinite memory and how retrieval augmentation connects models to external facts.",
            overview:
              "本节讨论模型在回答问题时到底依赖什么信息：是参数里的旧知识、当前上下文，还是临时检索来的资料。你会看到 grounding 的价值在于让回答更贴近外部证据。",
            whyImportant:
              "如果把上下文窗口当成无限黑板，系统很快会变慢、变贵且注意力涣散。检索增强的意义，就是让模型只在需要时看对资料。",
            connection:
              "前两节主要讲训练，本节转向推理时的信息组织方式。它直接决定 LLM 应用能否处理最新知识和长文档。",
            intuition:
              "把上下文想成办公桌，把外部知识库想成档案柜。桌面空间有限，不可能把整个档案馆都摊开；更合理的方式是先找对文件，再放到桌上处理。",
            corePoints: [
              "上下文窗口能容纳的信息有限，长度、顺序和噪声都会影响模型注意力分配。",
              "RAG 的核心不是“先搜再答”这四个字，而是检索内容是否真的与当前问题相关且可被模型利用。",
              "Grounding 让回答可以锚定到外部文档、数据库或证据片段，降低纯凭参数猜测的风险。",
            ],
            pitfalls: [
              "把更多资料一股脑塞进上下文，以为信息越多越安全，结果反而让重点淹没。",
              "把检索命中误认为回答一定可靠，忽略了切片质量、排序和引用使用方式。",
            ],
            examples: [
              "企业知识助手如果把整份几百页手册都塞进上下文，模型反而更难抓重点；挑出相关章节再回答通常更稳。",
              "问财报问题时，仅检索到正确 PDF 还不够，还要让模型引用具体段落或表格，否则仍可能给出似是而非的总结。",
            ],
            scenario:
              "FAQ 系统、法务检索、研报问答和长文档总结都依赖 grounding。系统价值常常不在“模型多聪明”，而在“取来的证据是否刚好够用”。",
            next:
              "最后一节会把这些能力放回整体系统视角，讨论效果、成本和安全之间的真实取舍。",
            takeaway: "上下文负责当下推理，检索负责把对的外部证据放进来，grounding 负责让回答贴住事实。",
            terms: ["上下文窗口", "检索增强", "Grounding", "引用证据"],
            quizFocus: "先区分参数知识、当前上下文和外部检索三种信息来源",
            applyPriority: "当前问题真正需要哪些外部证据，以及这些证据怎样进入上下文",
          },
          {
            slug: "alignment-evaluation-and-cost",
            title: "模型评估、对齐与成本质量权衡",
            titleEn: "Evaluation, Alignment, and Cost-Quality Tradeoffs",
            learningObjective: "建立评估 LLM 应用时关于效果、成本、延迟和风险的综合视角。",
            learningObjectiveEn:
              "Build an integrated view of quality, cost, latency, and risk when evaluating LLM systems.",
            overview:
              "本节收束整门课：真正做应用时，不存在只看“模型聪不聪明”这一件事。你必须同时考虑答案质量、响应速度、调用成本和安全边界。",
            whyImportant:
              "很多系统上线后遇到的不是“模型不够强”，而是预算不匹配、延迟过高、失败不可解释，或者为了追求效果牺牲了稳定性。",
            connection:
              "这一节把训练阶段、上下文设计和检索策略汇总起来，形成你评估一套 LLM 系统是否值得部署的判断框架。",
            intuition:
              "像搭建一条生产线一样，最贵的机器不一定最适合所有工位。要看工位要求、吞吐量、容错空间和整体成本，而不是只看单点性能峰值。",
            corePoints: [
              "离线评测帮助你比较方案，但线上表现还取决于输入分布、用户行为和系统约束。",
              "成本不只是单次调用价格，还包括上下文长度、重试率、检索链路和失败带来的人工兜底成本。",
              "对齐和安全策略需要和业务风险等级匹配，高风险场景通常需要更严格的限制和人工确认。",
            ],
            pitfalls: [
              "只看 benchmark 分数选模型，而不验证它在自己任务分布下的稳定性。",
              "把压低成本理解成只换便宜模型，忽略提示词、检索、缓存和流程设计同样影响总成本。",
            ],
            examples: [
              "内部问答系统若响应快但错误率高，员工可能更不敢使用；反过来，答得准但太慢，也会在真实流程里被放弃。",
              "高风险审批助手即便模型很强，也不能省掉关键确认环节，因为真正要管的是后果可控，而不是单次回答好不好看。",
            ],
            scenario:
              "在客服、财务、法务、研究分析等业务里，模型选择往往是系统工程问题：要同时满足预算、体验、可靠性和合规要求。",
            next:
              "完成这一节后，你已经具备从原理层面解释 LLM 系统为何有效、为何失效，以及怎样做出更稳的工程选择。",
            takeaway: "LLM 系统的好坏从来不是单一维度，而是效果、成本、速度和风险的平衡结果。",
            terms: ["离线评测", "线上监控", "延迟", "总拥有成本"],
            quizFocus: "用系统取舍视角评估 LLM，而不是只盯着单一指标",
            applyPriority: "业务最不能接受的失败类型是什么，以及系统该为此付出多少成本",
          },
        ],
      },
    ],
  },
  {
    slug: "quant-finance-analysis",
    title: "量化金融分析",
    titleEn: "Quantitative Financial Analysis",
    topic: "量化金融分析",
    topicEn: "Quantitative Financial Analysis",
    description:
      "这门官方示例课围绕数据处理、信号构造、回测和风险控制，帮助你建立量化分析的基本工作流，而不是只会堆砌几个技术指标。",
    descriptionEn:
      "This official sample course covers data preparation, signal construction, backtesting, and risk control so you can build a real quant analysis workflow instead of just stacking indicators.",
    goals: [
      "理解量化分析从原始数据到策略判断的主线",
      "分清信号有效、回测可信和风险可控分别意味着什么",
      "建立对偏差、过拟合和资金管理的基本警觉",
    ],
    goalsEn: [
      "Understand the full path from raw market data to strategy judgment",
      "Separate signal validity, backtest credibility, and risk control",
      "Develop practical awareness of bias, overfitting, and portfolio management",
    ],
    chapters: [
      {
        slug: "data-and-signals",
        title: "数据准备与信号构造",
        titleEn: "Data Preparation and Signal Construction",
        subchapters: [
          {
            slug: "data-cleaning-and-returns",
            title: "金融数据清洗与收益率构造",
            titleEn: "Financial Data Cleaning and Return Construction",
            learningObjective: "理解量化分析为何必须先统一口径、处理缺失与异常，再谈收益和因子。",
            learningObjectiveEn:
              "Understand why quant analysis must standardize, clean, and align data before talking about returns or factors.",
            overview:
              "本节关注量化分析里最容易被低估的一层：数据准备。你会看到错误的复权、时间对齐或缺失处理，足以让后续所有信号判断失去意义。",
            whyImportant:
              "量化模型常给人一种“很数学”的错觉，但如果底层数据口径混乱，再精致的模型也只是在放大脏数据里的噪声。",
            connection:
              "这是整门课的入口。只有先把价格、成交量、财报或宏观数据整理清楚，后面的因子和回测结果才有讨论价值。",
            intuition:
              "像做实验前先校准仪器一样，量化研究里先要确认你读到的数据到底是不是同一把尺子量出来的。",
            corePoints: [
              "时间戳、复权方式、停牌缺失和异常值处理都会直接改变收益率序列的统计性质。",
              "收益率比价格本身更适合作为比较基础，因为它更容易跨资产、跨区间进行归一化分析。",
              "数据清洗不是机械删除异常，而是先判断异常来自市场真实波动还是采集错误。",
            ],
            pitfalls: [
              "直接拿原始价格做跨期比较，忽略分红拆股和复权处理。",
              "看到缺失值就简单填补，没先区分停牌、节假日和采集故障等不同来源。",
            ],
            examples: [
              "两只股票价格分别从 10 到 11、从 100 到 101，看起来涨幅差很多，但收益率视角下其实差异完全不同。",
              "如果财报发布日期和交易日没有对齐，回测可能在事实上线前就“提前知道”了未来信息。",
            ],
            scenario:
              "无论你做日频择时、基本面选股还是事件驱动，只要数据时间线和口径没处理好，研究结果就可能在上线那天立即失真。",
            next:
              "下一节会在干净数据基础上讨论怎样构造和验证信号，避免把偶然波动误认成可交易规律。",
            takeaway: "量化分析的第一步不是建模，而是确保你研究的数据真的站得住。",
            terms: ["复权", "收益率", "时间对齐", "异常值"],
            quizFocus: "先确认数据口径与时间线正确，再讨论任何策略结论",
            applyPriority: "数据是否复权、对齐且能够解释缺失与异常来源",
          },
          {
            slug: "factors-and-signal-validation",
            title: "因子直觉与信号验证",
            titleEn: "Factor Intuition and Signal Validation",
            learningObjective: "学会从经济含义和统计证据两方面评估一个信号是否值得继续研究。",
            learningObjectiveEn:
              "Learn to assess a signal from both economic intuition and statistical evidence before investing more research effort.",
            overview:
              "本节讨论什么样的指标可以算“信号”。重点不是搜集越多指标越好，而是建立一套判断：它是否有经济解释、是否稳定、是否只是偶然有效。",
            whyImportant:
              "很多初学者一开始会被漂亮曲线吸引，但没有解释的信号往往一换市场环境就消失。先问“为什么”，再问“有没有”，更不容易掉进过拟合陷阱。",
            connection:
              "上一节解决数据底座问题，这一节开始进入研究判断。它会直接影响后面的回测设计和风控思路。",
            intuition:
              "可以把因子想成一个筛选问题的镜头。镜头不是越多越好，而是要看它能否稳定捕捉你真正关心的现象。",
            corePoints: [
              "一个好信号既要有统计相关性，也要有可讲得通的经济或行为机制。",
              "验证信号要看不同时间窗口、不同市场阶段和不同样本切片下是否仍大致成立。",
              "信号强不等于可交易，还要考虑成本、容量和与其他信号的相关性。",
            ],
            pitfalls: [
              "只因为历史曲线好看就相信信号有效，没有先问背后的经济逻辑。",
              "在同一批数据上反复调参数，直到看见想要的结果，却没有留出真正的检验样本。",
            ],
            examples: [
              "动量因子之所以常被研究，不只是因为历史上常有效，还因为它与投资者行为和趋势延续有一定可解释联系。",
              "某个“神奇指标”如果只在两个月样本里表现突出，却在其他阶段完全失效，很可能只是偶然噪声。",
            ],
            scenario:
              "无论做股票多因子、期货择时还是加密资产信号研究，都需要在“有道理”和“有证据”之间来回校验，而不是只信任其中一边。",
            next:
              "接下来会进入回测框架，看看即使信号本身合理，如果回测流程不严谨，也会给出误导性的乐观结果。",
            takeaway: "信号研究的核心不是找到更多指标，而是找到值得相信的指标。",
            terms: ["因子", "样本外验证", "经济含义", "过拟合"],
            quizFocus: "先同时检查信号逻辑和证据，再决定要不要继续投入研究",
            applyPriority: "这个信号为什么可能有效，以及它在不同样本下是否仍然稳定",
          },
        ],
      },
      {
        slug: "strategy-and-risk",
        title: "回测可信度与风险控制",
        titleEn: "Backtest Credibility and Risk Control",
        subchapters: [
          {
            slug: "backtesting-and-bias-control",
            title: "回测框架与偏差控制",
            titleEn: "Backtesting and Bias Control",
            learningObjective: "理解回测不只是跑历史曲线，而是要尽量复原真实交易约束并识别偏差。",
            learningObjectiveEn:
              "Understand that backtesting is not merely replaying history, but reconstructing realistic constraints and controlling bias.",
            overview:
              "本节讨论回测为什么常常“看起来很赚钱，上线却不赚钱”。重点在于识别前视偏差、生存者偏差、交易成本漏算等常见问题。",
            whyImportant:
              "如果回测框架本身就透支了未来信息或忽略了交易摩擦，那么再好的收益曲线都只是在奖励错误假设。",
            connection:
              "前面我们讲了数据和信号，本节则检验这些研究成果是否真的能在近似真实的环境中成立。",
            intuition:
              "回测像是飞行模拟器。它不是为了让画面好看，而是为了尽量逼近真实约束，好让你在起飞前看见潜在风险。",
            corePoints: [
              "前视偏差会让策略在历史里偷看未来，是量化研究里最危险的假象之一。",
              "交易成本、滑点、成交量约束和调仓频率都会显著改变策略实际可得收益。",
              "可信回测更重视假设是否合理，而不只是结果是否亮眼。",
            ],
            pitfalls: [
              "只根据收盘价回测，却默认自己总能在理想价格完整成交。",
              "把历史成分股名单固定不变，忽略退市或被剔除样本带来的生存者偏差。",
            ],
            examples: [
              "一个高换手策略在不计成本时年化收益很高，但一加上滑点和手续费就可能几乎没有 alpha。",
              "财报策略如果使用了事后整理好的完整数据库，却没尊重财报真正可见的发布时间，就可能严重前视。",
            ],
            scenario:
              "无论是股票、期货还是 ETF 策略，只要回测里默认交易无摩擦、信息无延迟，实盘结果就很容易与历史评估脱节。",
            next:
              "最后一节会把视角从单个信号和回测扩展到组合层面，讨论怎样控制回撤、分散风险和分配权重。",
            takeaway: "回测的价值不在于讲好故事，而在于提前暴露故事里不真实的部分。",
            terms: ["前视偏差", "生存者偏差", "滑点", "交易成本"],
            quizFocus: "先检查回测假设是否真实，再解读收益曲线",
            applyPriority: "策略是否偷看未来、低估成本或忽略真实成交约束",
          },
          {
            slug: "portfolio-and-risk-metrics",
            title: "组合构建与风险指标",
            titleEn: "Portfolio Construction and Risk Metrics",
            learningObjective: "建立“收益只是结果，风险管理才是过程”的组合思维。",
            learningObjectiveEn:
              "Develop a portfolio mindset in which returns are outcomes, but risk management is the operating process.",
            overview:
              "本节从单个策略跳到组合层。你会理解仓位分配、相关性、回撤和波动管理为何决定了策略是否能长期持有。",
            whyImportant:
              "许多策略不是死在 alpha 不够，而是死在波动过大、回撤过深或组合暴露过于集中，导致真实资金承受不了。",
            connection:
              "前面已经讨论了信号和回测，这一节负责把研究成果变成可以承受现实压力的资金配置方案。",
            intuition:
              "如果把单个信号看成乐手，组合构建就是编曲。不是让每个人都尽量大声，而是让整体既有节奏也有层次，不至于同时失控。",
            corePoints: [
              "组合收益取决于个体策略收益，也取决于它们之间如何相关、如何共同波动。",
              "最大回撤、波动率、收益回撤比和风险暴露集中度，都是比单纯收益更能描述资金体验的指标。",
              "仓位管理本质上是在分配风险预算，而不是在赌某一个观点一定正确。",
            ],
            pitfalls: [
              "看到某个策略胜率高就给过大权重，忽略它与现有持仓高度相关。",
              "只盯着最终收益，不跟踪回撤路径和风险暴露变化。",
            ],
            examples: [
              "两个单独看都不错的策略，如果都在同一类市场风格上赚钱，组合后未必更稳，反而可能在同一时间一起失效。",
              "把权重分散到相关性较低的信号上，往往比继续堆叠同类指标更能改善风险体验。",
            ],
            scenario:
              "在多因子选股、跨品种 CTA、资产配置和对冲组合中，真正拉开长期结果差异的常常不是“最聪明的信号”，而是风险预算和相关性管理。",
            next:
              "学完这里，你已经拥有一条从数据准备、信号研究到回测与组合管理的完整量化分析主线。",
            takeaway: "收益决定你赚多少，风险管理决定你能否活到把收益拿到手。",
            terms: ["相关性", "最大回撤", "风险预算", "仓位管理"],
            quizFocus: "把组合管理理解成风险分配问题，而不是简单平均若干策略",
            applyPriority: "新增权重是否放大了已有风险暴露，以及组合回撤是否仍可承受",
          },
        ],
      },
    ],
  },
  {
    slug: "power-electronics",
    title: "电力电子技术",
    titleEn: "Power Electronics",
    topic: "电力电子技术",
    topicEn: "Power Electronics",
    description:
      "这门官方示例课从功率器件、PWM 和能量传递讲起，再进入反馈补偿、损耗与 EMI，帮助你建立电力电子系统级视角。",
    descriptionEn:
      "This official sample course starts with power devices, PWM, and energy transfer, then moves into feedback, losses, and EMI to build a systems view of power electronics.",
    goals: [
      "理解开关变换器为何能高效率地搬运能量",
      "掌握控制环路、损耗与热设计之间的关键关系",
      "建立对电磁兼容和工程权衡的基础判断",
    ],
    goalsEn: [
      "Understand why switching converters move energy efficiently",
      "Grasp the key relationships among control loops, losses, and thermal design",
      "Develop baseline judgment for EMI and engineering tradeoffs",
    ],
    chapters: [
      {
        slug: "conversion-fundamentals",
        title: "功率变换基础",
        titleEn: "Power Conversion Fundamentals",
        subchapters: [
          {
            slug: "switching-devices-and-power-stages",
            title: "开关器件与功率级基础",
            titleEn: "Switching Devices and Power Stages",
            learningObjective: "理解 MOSFET、二极管、电感、电容在功率级中的分工以及开关工作方式。",
            learningObjectiveEn:
              "Understand how MOSFETs, diodes, inductors, and capacitors divide labor in a power stage and why switching operation matters.",
            overview:
              "本节先建立功率级的角色分工。你会看到电力电子并不是“把电压变一变”这么简单，而是在开关器件和储能元件之间安排能量流向。",
            whyImportant:
              "如果对器件职责和能量路径没有清楚图景，后续看到波形、损耗或控制问题时，就很难判断症结究竟发生在哪个环节。",
            connection:
              "这是整门课最底层的系统图。PWM、补偿、热设计和 EMI 都要建立在对功率级能量流动的理解之上。",
            intuition:
              "可以把功率级想成一套高速切换的“阀门 + 水桶”系统。开关像阀门决定什么时候导通，电感和电容像储能容器平衡能量的快进快出。",
            corePoints: [
              "MOSFET 等开关器件的价值在于用导通和关断两种状态搬运能量，以降低线性耗散。",
              "电感负责约束电流变化，电容负责缓冲电压变化，两者共同塑造输出波形。",
              "理解功率级时，最重要的是画清楚每个开关状态下的电流路径和能量流向。",
            ],
            pitfalls: [
              "只记住器件名字和参数表，却没有真正画过不同状态下的回路电流路径。",
              "把电感和电容当成附属滤波件，忽略它们其实是能量传递与动态响应的核心角色。",
            ],
            examples: [
              "Buck 变换器在上管导通时把输入能量送进电感，关断时电感再把储能释放给负载，这就是典型的分时搬运。",
              "如果没有输出电容，负载看到的将是剧烈脉动的节点波形，而不是相对平滑的输出电压。",
            ],
            scenario:
              "无论是手机充电器、服务器电源还是电机驱动，只要涉及高效率电能变换，都离不开器件切换和储能元件协同工作的基本图景。",
            next:
              "下一节会进一步讨论 PWM 与占空比，看看功率级是如何通过时间比例来调节平均输出的。",
            takeaway: "功率级设计的核心，是看懂器件在不同开关状态下怎样共同搬运能量。",
            terms: ["MOSFET", "二极管", "电感", "电容"],
            quizFocus: "先看能量和电流路径，再看单个器件参数",
            applyPriority: "每个开关状态下的电流路径和储能元件在做什么",
          },
          {
            slug: "pwm-and-energy-transfer",
            title: "PWM、占空比与能量传递",
            titleEn: "PWM, Duty Cycle, and Energy Transfer",
            learningObjective: "理解 PWM 为什么能通过时间平均控制输出，以及连续导通与断续导通的差别。",
            learningObjectiveEn:
              "Understand how PWM controls output through time averaging and how continuous conduction differs from discontinuous conduction.",
            overview:
              "本节聚焦开关变换器最直观的控制手段：PWM。重点不是把公式背下来，而是理解平均值是如何从高速切换里长出来的。",
            whyImportant:
              "很多设计判断都依赖你是否明白占空比、电感纹波、导通模式变化之间的关系。否则看到波形和控制结果时很难建立因果。",
            connection:
              "上一节解决了器件分工，本节解释功率级为何能被“时间比例”调节。这也是后续环路设计的前提。",
            intuition:
              "就像快速开合水龙头能控制平均流量一样，PWM 通过调整开关打开的时间比例，决定单位周期内到底送出多少能量。",
            corePoints: [
              "占空比控制的是一个周期里导通阶段所占比例，因此直接影响平均输出。",
              "电感纹波大小决定了系统更接近连续导通还是断续导通，不同导通模式下的小信号特性也会变化。",
              "平均模型有助于理解稳态关系，但真实波形里的纹波和瞬态仍然需要单独关注。",
            ],
            pitfalls: [
              "只记住理想稳态公式，忽略轻载、器件压降和模式切换会让关系发生偏移。",
              "把 PWM 频率提高当成万能解，没评估开关损耗和 EMI 是否同步恶化。",
            ],
            examples: [
              "Buck 在理想连续导通下常见关系是输出电压近似等于输入电压乘占空比，但这只是理解起点，不是所有条件下的最终答案。",
              "轻载时电感电流可能降到零，系统进入断续导通，这时同样的占空比不一定对应原来的平均输出关系。",
            ],
            scenario:
              "从 DC-DC 电源到逆变器调制，只要你需要把高频开关动作变成可控平均量，就离不开 PWM 与能量时间分配的视角。",
            next:
              "接下来会进入反馈控制，讨论在负载和输入变化下，怎样让输出自动回到目标值。",
            takeaway: "PWM 的本质，是用时间比例去塑造平均能量传递结果。",
            terms: ["PWM", "占空比", "连续导通", "断续导通"],
            quizFocus: "把占空比理解成时间平均控制量，而不是孤立公式里的字母",
            applyPriority: "系统当前处于什么导通模式，以及平均关系是否仍成立",
          },
        ],
      },
      {
        slug: "control-and-design",
        title: "控制与工程设计",
        titleEn: "Control and Engineering Design",
        subchapters: [
          {
            slug: "feedback-control-and-compensation",
            title: "反馈控制与补偿设计",
            titleEn: "Feedback Control and Compensation",
            learningObjective: "理解电源环路为什么需要补偿，以及带宽、相位裕度和瞬态响应之间的关系。",
            learningObjectiveEn:
              "Understand why power converters require compensation and how bandwidth, phase margin, and transient response relate.",
            overview:
              "本节进入控制层。你会看到功率级本身只是被控对象，要让输出在输入变化和负载扰动下保持稳定，就必须设计反馈和补偿。",
            whyImportant:
              "如果环路没有补偿好，系统可能稳态看起来没问题，但一遇到负载阶跃就振荡、过冲过大或恢复太慢。",
            connection:
              "前两节建立了功率级和 PWM 的平均理解，本节在此基础上讨论怎样把目标输出稳定地“锁住”。",
            intuition:
              "反馈环像自动驾驶中的修正机制。看到偏差后不能只是一脚猛打方向，而要根据系统本身的惯性和延迟，选择合适的修正力度与速度。",
            corePoints: [
              "补偿器的作用是塑造开环增益与相位，使闭环既稳定又有足够响应速度。",
              "带宽太低时响应迟缓，带宽过高又可能放大噪声或逼近未建模动态。",
              "相位裕度提供了一个直观窗口，帮助判断系统离振荡边缘还有多远。",
            ],
            pitfalls: [
              "只追求更快带宽，忽略采样延迟、功率级极点和噪声带来的副作用。",
              "看到一次波形不理想就随手改参数，没有先判断问题来自对象模型还是补偿器选择。",
            ],
            examples: [
              "Buck 负载突变时，如果环路太慢，输出会长时间下陷；如果环路接近不稳定，又可能出现持续振铃。",
              "设计补偿时常见流程不是盲调，而是先看功率级频率特性，再决定零点和极点应该放在哪里。",
            ],
            scenario:
              "在服务器供电、车载电源和工业控制电源里，负载变化快且要求稳，补偿设计直接决定用户看到的是平稳输出还是“会抖的电源”。",
            next:
              "最后一节会补上功率电子里非常工程化的一面：即使控制看起来不错，损耗、温升和 EMI 仍可能决定设计是否可量产。",
            takeaway: "补偿设计的目标不是单纯把环路调快，而是让速度、稳定性和鲁棒性同时过关。",
            terms: ["带宽", "相位裕度", "补偿器", "闭环响应"],
            quizFocus: "先理解环路在平衡速度与稳定性，而不是只追求更快响应",
            applyPriority: "功率级动态、目标带宽和稳定裕度是否匹配",
          },
          {
            slug: "loss-thermal-and-emi",
            title: "损耗、热管理与 EMI",
            titleEn: "Losses, Thermal Management, and EMI",
            learningObjective: "理解高效率设计为何必须同时考虑导通损耗、开关损耗、温升和电磁干扰。",
            learningObjectiveEn:
              "Understand why high-efficiency design must consider conduction loss, switching loss, thermal rise, and EMI together.",
            overview:
              "本节把视角拉回工程现实。一个电源设计即使拓扑和控制都成立，只要损耗过大、散热做不好或 EMI 过不了测试，依然算不上可交付方案。",
            whyImportant:
              "功率电子的很多失败不是原理错误，而是工程边界没守住。效率、温升和电磁兼容常常彼此牵制，需要系统权衡。",
            connection:
              "这节为整门课收尾：功率级、PWM 和控制都必须落到真实器件和真实布局上，才能成为完整设计。",
            intuition:
              "可以把它想成三张同时拉扯的网。你想减少损耗，可能会提高开关速度；开关速度变快，又可能让 EMI 更糟；为了压 EMI 再加滤波，又会引入新的体积和损耗问题。",
            corePoints: [
              "导通损耗和开关损耗通常此消彼长，器件选择与驱动策略要围绕整体效率最优而不是单点最优。",
              "热设计不是事后补救，而是从器件、铜箔、气流和封装阶段就应同时考虑。",
              "EMI 问题往往与高 di/dt、dv/dt 回路、布局寄生参数和接地路径直接相关。",
            ],
            pitfalls: [
              "只盯着效率表格，不去看温升分布和最热点位置。",
              "把 EMI 当成后期加滤波器就能解决的问题，忽略布局和开关回路才是根源之一。",
            ],
            examples: [
              "为了降低导通损耗换更大芯片，可能改善直流损耗，却因栅电荷变大而增加驱动和开关损耗。",
              "同样的原理图，如果高频环路布局过大，测试时可能表现出远超预期的尖峰和辐射问题。",
            ],
            scenario:
              "在快充、电机驱动、通信电源和车载电源里，最终让设计从实验板走向产品的，常常是损耗、热与 EMI 的综合工程能力。",
            next:
              "完成这一节后，你已经具备理解电力电子从功率级、控制到工程实现的一条完整主线。",
            takeaway: "高效率电力电子不是只把波形调对，而是把效率、温升和电磁兼容一起做对。",
            terms: ["导通损耗", "开关损耗", "热阻", "EMI"],
            quizFocus: "把效率、热和 EMI 看成联动约束，而不是彼此独立的小问题",
            applyPriority: "主要损耗来源、热点位置和高频干扰路径是否已经识别清楚",
          },
        ],
      },
    ],
  },
];

const aiAgentCourseChapter1: ExampleChapterSeed = {
  slug: "nature-capabilities-system-role",
  title: "AI Agent 的本质、能力边界与系统角色",
  titleEn: "Nature, Capabilities, and System Role of AI Agents",
  subchapters: [
    {
      slug: "what-is-an-ai-agent",
      title: "什么是 AI Agent（定义与演进）",
      titleEn: "What is an AI Agent (definition and evolution)",
      learningObjective:
        "理解 AI Agent 如何从规则自动体演化为由大模型增强的目标导向系统。",
      learningObjectiveEn:
        "Understand how AI agents evolved from rule-driven automation to LLM-enhanced goal-oriented systems.",
      overview:
        "本节解释 AI Agent 的核心定义，说明它不是单次回答器，而是能围绕目标持续感知、判断并行动的系统实体。",
      whyImportant:
        "只有定义清楚什么是 agent，后续关于多智能体、工具、记忆与协作的讨论才不会混淆聊天模型与系统角色。",
      connection:
        "这是整门课的起点，它为后续所有机制与架构章节提供统一的概念基础。",
      intuition:
        "可以把 agent 看成一个被赋予持续任务的数字行动者，而不是一次性输出答案的接口。",
      corePoints: [
        "Agent 以目标和环境反馈为中心，而不是只以文本生成为中心。",
        "Agent 概念经历了规则系统、规划系统、强化学习代理到大模型代理的演化。",
        "大模型增强了表达和泛化能力，但没有取消系统设计的重要性。",
      ],
      pitfalls: [
        "把任何会聊天的模型都称为 agent，忽略它是否具备持续行动与反馈闭环。",
        "把 agent 想成完全自主的人类替身，忽视它仍然受工具、权限和上下文限制。",
      ],
      examples: [
        "一个只会回答常见问题的系统更像问答接口；如果它能根据外部状态继续决策，才更接近现代 agent。",
        "一个研究助理如果能够查证材料、修正结论并继续探索，就比纯文本续写更符合 agent 的定义。",
      ],
      scenario:
        "在客服、教育、检索和流程自动化场景里，区分模型、工作流与 agent，有助于理解系统边界与预期能力。",
      next:
        "下一节会把 agent 的抽象定义拆成 perception、reasoning、action 三种基本能力。",
      takeaway:
        "AI Agent 的本质是围绕目标持续感知、推理并行动的系统角色。",
      terms: ["Agent", "Goal", "Environment", "Evolution"],
      quizFocus:
        "优先建立 Agent 是闭环系统角色而不是单次模型输出的认识。",
      applyPriority:
        "当前系统是否真的具备目标、反馈与持续行动三要素。",
    },
    {
      slug: "perception-reasoning-action",
      title: "Agent 的核心能力模型（感知、推理、行动）",
      titleEn: "Core capability model: perception, reasoning, action",
      learningObjective:
        "理解感知、推理、行动三种能力如何共同构成 agent 的基本行为框架。",
      learningObjectiveEn:
        "Understand how perception, reasoning, and action form the behavioral core of an AI agent.",
      overview:
        "本节把 agent 的工作方式拆成 perception、reasoning 与 action 三段，说明系统如何读取环境、形成判断并把判断转化为外部结果。",
      whyImportant:
        "许多系统问题并不是模型不会想，而是感知信息错误或行动无法闭环，因此三段模型有助于定位真实故障层。",
      connection:
        "它把第一节的定义转化为可分析的能力结构，也为后面的工具、记忆和通信机制提供框架。",
      intuition:
        "就像分析员先读材料、再做判断、最后发出行动，agent 也必须把三者连成一条连续链路。",
      corePoints: [
        "Perception 决定系统看到了什么信息以及这些信息是否相关可靠。",
        "Reasoning 决定系统如何组织证据并形成下一步判断。",
        "Action 让判断离开模型内部，变成可执行、可观察、可纠正的外部行为。",
      ],
      pitfalls: [
        "只强调 reasoning 而忽略 perception，会让系统在错误事实上做出漂亮但错误的判断。",
        "把 action 当作普通输出，忽略它其实是系统与环境建立闭环的关键环节。",
      ],
      examples: [
        "如果医疗问答系统读到的信息不完整，再强的推理也可能建立在错误前提上。",
        "如果日程助理能判断冲突却不能真正更新日历，它仍然没有完成完整的 agent 行动闭环。",
      ],
      scenario:
        "无论是单智能体还是多智能体系统，这个三段模型都能帮助解释成功和失败为什么发生。",
      next:
        "下一节会把这三个能力压缩成现代 agent 常见的最小架构。",
      takeaway:
        "Agent 的能力不是某一个点，而是感知、推理、行动之间持续联动的过程。",
      terms: ["Perception", "Reasoning", "Action", "Feedback loop"],
      quizFocus:
        "先理解三种能力是连续能力链，而不是三个孤立模块。",
      applyPriority:
        "系统问题首先出在感知、判断还是行动环节。",
    },
    {
      slug: "minimal-agent-architecture",
      title: "最小 Agent 架构（LLM + Tool + Loop）",
      titleEn: "Minimal agent architecture (LLM + tool + loop)",
      learningObjective:
        "理解为什么 LLM、工具和循环机制构成了现代 agent 的最小可运行架构。",
      learningObjectiveEn:
        "Understand why LLM, tools, and a loop form the minimal viable architecture of a modern agent.",
      overview:
        "本节说明现代 agent 的常见骨架：LLM 负责语言理解与策略生成，工具负责外部执行能力，loop 负责根据观察结果继续调整下一步。",
      whyImportant:
        "没有工具，系统只能停留在语言层；没有 loop，系统无法根据外部反馈修正行为，因此最小架构决定 agent 是否真正可运作。",
      connection:
        "这一节把前面的能力模型落成结构骨架，也为后续记忆、规划和多角色协作提供基座。",
      intuition:
        "可以把 LLM 看成大脑、工具看成手脚、loop 看成神经回路，缺少任一部分都很难形成持续行动。",
      corePoints: [
        "LLM 负责解释任务、生成候选动作并整合反馈。",
        "工具让 agent 进入搜索、计算、检索和外部服务等现实能力空间。",
        "Loop 让系统能够观察结果、判断是否完成并继续或停止。",
      ],
      pitfalls: [
        "把工具数量当成智能程度，忽略更多动作也意味着更多成本和更多错误来源。",
        "认为只要接入工具就是 agent，忽视停止条件和反馈控制同样关键。",
      ],
      examples: [
        "旅行助理只有在查询航班后还能根据结果重新评估方案，才体现 loop 的价值。",
        "数据分析系统如果只能描述分析思路却不能调用计算工具，仍然停留在纯语言层面。",
      ],
      scenario:
        "在研究助理、知识检索和流程自动化中，真正的差别往往不是能否调用工具，而是能否围绕反馈持续决策。",
      next:
        "下一节会把 agent 放回更大的软件系统里，解释它为何应被看成一个系统组件。",
      takeaway:
        "现代 agent 的最小骨架通常是 LLM 负责判断、工具负责执行、loop 负责持续闭环。",
      terms: ["LLM", "Tool", "Loop", "Stopping condition"],
      quizFocus:
        "先把最小 agent 架构理解为判断、执行和反馈三部分的组合。",
      applyPriority:
        "系统是否既能调用外部能力，又能根据结果持续调整。",
    },
    {
      slug: "agent-as-component",
      title: "Agent 在软件系统中的角色",
      titleEn: "Agent as a software system component",
      learningObjective:
        "理解 agent 在软件系统中的角色边界，明白它应被视为组件而非全能黑箱。",
      learningObjectiveEn:
        "Understand why an agent should be treated as a software system component rather than a totalizing black box.",
      overview:
        "本节把 agent 放回完整软件系统中，说明它与数据层、工具层、权限层和观测层共同构成产品能力，而不是独立存在的神秘智能体。",
      whyImportant:
        "如果把 agent 当成全能核心，系统复杂性会被全部压到模型上，结果是边界模糊、治理困难且难以维护。",
      connection:
        "它把前面关于 agent 定义和最小架构的讨论，进一步推进到系统职责与接口边界层面。",
      intuition:
        "就像数据库负责存储、搜索服务负责索引一样，agent 更适合负责高不确定性任务中的解释、协调与决策。",
      corePoints: [
        "Agent 更适合承担需要语言理解、目标解释和动态决策的系统职责。",
        "把 agent 视为组件意味着必须定义清楚输入、输出、权限与失败回退。",
        "系统可维护性往往取决于 agent 与其他组件的关系，而不只取决于模型强弱。",
      ],
      pitfalls: [
        "让 agent 直接掌控一切，忽略很多确定性逻辑本该由别的组件负责。",
        "只讨论模型表现，不讨论接口契约、权限范围和数据依赖。",
      ],
      examples: [
        "在企业工作流中，agent 可以解释工单并决定下一步，但审批规则和数据库写入通常更适合由确定性模块负责。",
        "在学习平台中，agent 可以承担辅导与解释，而课程结构、进度规则和权限校验更适合放在外围系统中。",
      ],
      scenario:
        "当团队考虑把 agent 接入产品时，最重要的问题不是它聪不聪明，而是它在系统中负责什么、边界在哪里、失败时如何收敛。",
      next:
        "下一章会解释为什么很多复杂任务最终需要多个 agent 分工协作，而不是一个 agent 包打天下。",
      takeaway:
        "把 agent 视为系统组件，才能真正讨论职责、边界、治理和长期演进。",
      terms: ["Component", "Boundary", "Responsibility", "Fallback"],
      quizFocus:
        "优先把 Agent 理解为系统角色，而不是无边界的智能黑箱。",
      applyPriority:
        "这个 Agent 究竟负责什么，以及哪些事情不该由它负责。",
    },
  ],
};

const aiAgentCourseChapter2: ExampleChapterSeed = {
  slug: "multi-agent-design-and-collaboration-logic",
  title: "多智能体系统的结构设计与协作逻辑",
  titleEn: "Multi-Agent System Design and Collaboration Logic",
  subchapters: [
    {
      slug: "limitations-of-single-agent-systems",
      title: "单 Agent 系统的局限性",
      titleEn: "Limitations of single-agent systems",
      learningObjective:
        "理解单智能体系统在复杂任务中的局限，以及这些局限为何推动多智能体设计出现。",
      learningObjectiveEn:
        "Understand the limitations of single-agent systems and why they motivate multi-agent design.",
      overview:
        "本节分析单智能体在长任务、多工具和多约束场景中的常见问题，包括职责过载、状态混乱和错误难以定位。",
      whyImportant:
        "理解单智能体的边界，才能明白多智能体不是为了增加热闹，而是为了更好地管理复杂性。",
      connection:
        "它承接第一章的 agent 基础，开始回答系统为何要从单角色演进到多角色协作。",
      intuition:
        "像让一个人同时负责规划、执行、审查和记录一样，单智能体职责过多时很容易顾此失彼。",
      corePoints: [
        "单智能体越承担多种职责，越容易在长任务中出现上下文拥挤和目标漂移。",
        "当规划、执行和审查混在一起时，错误来源更难定位和修正。",
        "多智能体设计往往起源于单角色已经无法稳定管理复杂性。",
      ],
      pitfalls: [
        "把所有问题都归因于模型不够强，忽略职责过载本身就是系统问题。",
        "认为单智能体结构更简单，因此天然更可靠。",
      ],
      examples: [
        "研究 agent 同时负责检索、摘要、批判和结论时，常会把未经验证的中间假设直接带到最终回答里。",
        "自动化办公 agent 如果同时解释需求、查证事实、执行动作和做风险控制，任何一个环节出错都可能污染全局。",
      ],
      scenario:
        "在长链路知识工作和高风险流程中，单智能体不是不能做，而是很难稳定、可解释且可治理地做。",
      next:
        "下一节会说明多智能体设计中真正关键的不是数量，而是如何合理分工。",
      takeaway:
        "多智能体的必要性，往往来自单智能体在复杂任务中的职责过载。",
      terms: ["Single-agent", "Overload", "Context pressure", "Goal drift"],
      quizFocus:
        "优先识别单智能体的系统性局限，而不是只看模型能力强弱。",
      applyPriority:
        "当前任务是否已经超出单一角色可以稳定承载的范围。",
    },
    {
      slug: "division-of-labor-and-collaboration-principles",
      title: "多 Agent 的分工与协作思想",
      titleEn: "Division of labor and collaboration principles",
      learningObjective:
        "理解多智能体系统中的分工原则，以及为什么协作设计比增加角色数量更重要。",
      learningObjectiveEn:
        "Understand division of labor and collaboration principles in multi-agent systems.",
      overview:
        "本节讨论如何依据认知负荷、信息依赖和验证需求来拆分职责，而不是机械地把任务切成更多角色。",
      whyImportant:
        "如果分工逻辑不清，多智能体系统只会把单体混乱扩散成群体混乱，角色越多问题越大。",
      connection:
        "它从上一节的局限分析进一步推进到具体协作设计，回答多个 agent 应该怎样被组织。",
      intuition:
        "好的多智能体更像高效团队而不是人海战术，关键是谁负责什么、交付什么、谁来验收。",
      corePoints: [
        "分工应围绕职责边界、信息依赖和验证需求展开。",
        "协作设计要明确输入、输出、交接条件和失败处理方式。",
        "多智能体系统质量常常取决于接口与协作规则，而不是单个角色的局部能力。",
      ],
      pitfalls: [
        "把任务拆成大量低价值角色，结果只增加沟通成本和故障面。",
        "只定义角色名字，不定义交付物、验收标准和冲突处理机制。",
      ],
      examples: [
        "在研究分析中，把资料搜集、论点整理和事实核验分给不同角色，通常比让每个角色都做一点更清晰。",
        "在客服系统中，让不同角色分别负责识别意图、查证事实和形成最终回复，能减少信息混淆。",
      ],
      scenario:
        "只要任务里存在探索、执行、校验和裁决等不同认知活动，就有机会通过分工提升稳定性和清晰度。",
      next:
        "下一节会介绍 planner、worker、critic 这组典型角色模型。",
      takeaway:
        "多智能体协作的关键不是角色越多越好，而是分工是否围绕职责和验证逻辑展开。",
      terms: ["Division of labor", "Handoff", "Interface", "Coordination"],
      quizFocus:
        "先理解分工原则是在管理复杂性，而不是制造表面复杂度。",
      applyPriority:
        "角色边界、交付物和依赖顺序是否已经定义清楚。",
    },
    {
      slug: "planner-worker-critic",
      title: "角色设计（Planner / Worker / Critic）",
      titleEn: "Roles: planner, worker, critic",
      learningObjective:
        "理解 planner、worker、critic 三种典型角色的职责差异与协作价值。",
      learningObjectiveEn:
        "Understand the responsibilities and collaborative value of planner, worker, and critic roles.",
      overview:
        "本节介绍多智能体中最常见的角色分工：planner 负责拆解目标与规划路径，worker 负责完成局部任务，critic 负责检查逻辑、证据和结果质量。",
      whyImportant:
        "把规划、执行和审查分离，可以减少一个角色既做决定又给自己打分所带来的偏差。",
      connection:
        "这一节把抽象分工原则具体化，也为后面讨论通信协议和协作模式提供角色基础。",
      intuition:
        "像编辑部一样，planner 像主编，worker 像作者，critic 像审校，三者协作可以减少单一视角的盲区。",
      corePoints: [
        "Planner 关注全局目标、约束和任务分解。",
        "Worker 关注局部执行和中间结果交付。",
        "Critic 关注错误、风险、不一致和证据不足。",
      ],
      pitfalls: [
        "让 planner 同时承担执行和审查，会削弱角色分离带来的独立视角优势。",
        "把 critic 理解成专门挑错的负面角色，而忽视它其实是质量角色。",
      ],
      examples: [
        "报告生成场景里，planner 负责结构，worker 填充证据和论点，critic 审查论据是否支持结论。",
        "问答系统里，planner 决定是否检索，worker 执行检索与起草，critic 检查回答是否脱离证据。",
      ],
      scenario:
        "只要任务同时存在全局规划、局部执行和结果审查，多角色分离通常就能提升稳定性和可解释性。",
      next:
        "下一节会总结多智能体设计带来的 scalability、stability 和 controllability 价值。",
      takeaway:
        "Planner、worker、critic 体现的是三种认知职责的分离，而不是简单的人物命名。",
      terms: ["Planner", "Worker", "Critic", "Role separation"],
      quizFocus:
        "优先把三种角色理解为不同认知职责，而不是不同提示词风格。",
      applyPriority:
        "规划、执行和审查是否已经被清楚地分配给不同角色。",
    },
    {
      slug: "value-scalability-stability-controllability",
      title: "多智能体系统的价值与优势",
      titleEn: "Value: scalability, stability, controllability",
      learningObjective:
        "理解多智能体系统的核心价值为何体现在可扩展性、稳定性与可控性上。",
      learningObjectiveEn:
        "Understand why the value of multi-agent systems lies in scalability, stability, and controllability.",
      overview:
        "本节总结多智能体系统最重要的系统级收益：角色化分工使任务更易扩展，错误更易隔离，系统也更容易观察和干预。",
      whyImportant:
        "如果只看单次结果质量，很容易低估多智能体的价值；真正重要的是长期运行时的治理和扩展能力。",
      connection:
        "它收束第二章，把单智能体局限、分工原则和角色模型统一汇总为系统收益框架。",
      intuition:
        "好的多智能体系统像组织结构清晰的团队，任务多了能扩岗，出错了能局部修复，管理者也更容易看清发生了什么。",
      corePoints: [
        "Scalability 来自角色化分工与并行潜力，而不是简单增加模型调用。",
        "Stability 来自错误隔离、角色复核和更清楚的故障定位路径。",
        "Controllability 来自边界明确、可观测性增强和干预点丰富。",
      ],
      pitfalls: [
        "把多智能体价值仅理解为效果更高，而忽视治理、维护与扩展收益。",
        "误以为角色越多越可扩展，忽视通信、同步和管理成本也会增加。",
      ],
      examples: [
        "在大规模文档分析中，把检索、摘要和核验分成角色，往往比一个大而全的 agent 更容易横向扩展。",
        "在高风险业务中，独立审查角色可能不会提升速度，却能显著提升稳定性和可控性。",
      ],
      scenario:
        "当系统需要面向更多任务类型、更长链路和更高质量要求时，多智能体的价值通常体现在长期系统能力而不是单次聪明程度。",
      next:
        "下一章会转向多智能体内部的核心机制，讨论 memory、tool 和 reasoning 如何支撑这些结构。",
      takeaway:
        "多智能体的价值主要体现在更容易扩展、更容易稳定运行和更容易被治理。",
      terms: ["Scalability", "Stability", "Controllability", "Observability"],
      quizFocus:
        "先把多智能体价值看成系统治理收益，而不是只看一次性效果提升。",
      applyPriority:
        "当前系统最缺的是扩展能力、稳定性还是可控性。",
    },
  ],
};

const aiAgentCourseChapter3: ExampleChapterSeed = {
  slug: "core-mechanisms-memory-tools-and-reasoning",
  title: "Agent 核心机制：Memory、Tools 与 Reasoning",
  titleEn: "Core Mechanisms: Memory, Tools, and Reasoning",
  subchapters: [
    {
      slug: "memory-design-short-term-vs-long-term",
      title: "Memory 设计（短期与长期）",
      titleEn: "Memory design: short-term vs long-term",
      learningObjective:
        "理解短期记忆与长期记忆在多智能体系统中的不同作用，以及为什么记忆结构决定系统连续性。",
      learningObjectiveEn:
        "Understand the roles of short-term and long-term memory in multi-agent systems.",
      overview:
        "本节讨论记忆设计。短期记忆保存当前任务相关的即时上下文与中间状态，长期记忆保存可跨任务复用的知识、经验与偏好。",
      whyImportant:
        "如果系统没有短期记忆，它每轮都像重新开始；如果长期记忆无序堆积，它又会不断把旧噪声带回当前推理。",
      connection:
        "它承接前面的多角色协作，解释多角色为何需要稳定的状态承载与知识复用机制。",
      intuition:
        "短期记忆像工作台上的材料，长期记忆像分类归档的资料库，两者都重要但用途不同。",
      corePoints: [
        "短期记忆更适合保存当前任务目标、中间结果和最近观察。",
        "长期记忆更适合保存跨任务稳定知识、经验摘要和用户偏好。",
        "记忆设计的关键在于写入、更新、检索和遗忘机制是否清楚。",
      ],
      pitfalls: [
        "把所有历史记录都无差别保留，结果系统越来越嘈杂而不是越来越聪明。",
        "误以为只要存下数据就算形成记忆，忽略后续检索质量与更新策略。",
      ],
      examples: [
        "在学习辅导系统里，当前章节目标属于短期记忆，而长期薄弱点更适合进入可检索的长期记忆。",
        "在企业助手中，最近审批进度属于短期状态，而组织规则摘要更适合长期保存。",
      ],
      scenario:
        "只要任务跨越多个回合、多种角色或较长时间跨度，记忆结构就会直接影响系统是否显得连贯、稳健并有上下文感。",
      next:
        "下一节会解释工具为何是 agent 从纯文本推理进入外部世界的关键桥梁。",
      takeaway:
        "记忆设计的重点不是保存更多，而是让不同层级的信息各就其位。",
      terms: ["Short-term memory", "Long-term memory", "State", "Retrieval"],
      quizFocus:
        "优先区分当前任务状态与跨任务知识这两类记忆用途。",
      applyPriority:
        "当前信息究竟应该暂存在上下文中，还是进入长期可检索存储。",
    },
    {
      slug: "tools-and-execution-capabilities",
      title: "Tools：Agent 的执行能力",
      titleEn: "Tools and execution capabilities",
      learningObjective:
        "理解工具为何决定 agent 的外部能力边界，以及工具设计如何影响系统可靠性。",
      learningObjectiveEn:
        "Understand how tools define an agent's execution boundary and influence system reliability.",
      overview:
        "本节讨论工具在 agent 系统中的作用。没有工具，agent 只能在语言层做推断；有了工具，它才能检索知识、执行查询、访问服务或触发动作。",
      whyImportant:
        "现代 agent 的很多实际能力并不来自模型参数本身，而来自它能安全地访问哪些外部能力。",
      connection:
        "在记忆之后讨论工具，是因为记忆决定系统知道什么，而工具决定系统能做什么。",
      intuition:
        "如果说模型像大脑，工具就像手、眼和各种专业仪器，没有这些外部器官，再多判断也难以转化为有效行动。",
      corePoints: [
        "工具让 agent 获得检索、计算、数据库访问和外部操作等非语言能力。",
        "工具设计不仅关乎功能丰富度，也关乎参数约束、权限边界和返回结果可解释性。",
        "工具返回结果必须能被系统再次理解和利用，否则它只是孤立动作而不是闭环的一部分。",
      ],
      pitfalls: [
        "只关注工具数量，忽略工具接口是否清晰、权限是否受控以及返回结果是否稳定。",
        "把工具看成无风险扩展，忽略错误调用可能对数据、成本和业务造成连锁影响。",
      ],
      examples: [
        "检索工具的价值不只是拿回文档，而是拿回足够相关且可被后续推理利用的证据。",
        "一个日程管理 agent 如果拥有写日历权限，就必须同时具备更严格的确认和回退逻辑。",
      ],
      scenario:
        "在企业系统、研究分析与办公自动化中，工具层往往决定了 agent 是停留在建议层，还是能够真正与业务流程发生互动。",
      next:
        "下一节会从 reasoning 机制出发，解释 chain-of-thought 与 ReAct 这类思路如何影响系统决策。",
      takeaway:
        "工具决定 agent 能触达的外部能力边界，而工具设计质量决定这些能力能否被安全稳定地使用。",
      terms: ["Tool", "Execution", "Permission", "Action interface"],
      quizFocus:
        "先把工具理解为能力边界与风险边界的共同载体。",
      applyPriority:
        "工具是否既扩展了能力，又保留了清晰的权限和反馈边界。",
    },
    {
      slug: "reasoning-chain-of-thought-and-react",
      title: "Reasoning 与决策机制",
      titleEn: "Reasoning: chain-of-thought and ReAct",
      learningObjective:
        "理解 chain-of-thought 与 ReAct 代表的两类 reasoning 组织方式，以及它们各自适配的任务结构。",
      learningObjectiveEn:
        "Understand chain-of-thought and ReAct as two different ways of organizing reasoning in agent systems.",
      overview:
        "本节关注 reasoning 如何被组织。Chain-of-thought 强调逐步展开内部推理，ReAct 强调在推理与行动之间交替前进。",
      whyImportant:
        "系统失败并不总是因为没有信息，也可能是因为推理组织方式不合适，因此要理解何时更适合先思考，何时更适合边观察边行动。",
      connection:
        "在记忆和工具之后讨论 reasoning，是因为 reasoning 正是把已有信息和可用能力组织成决策路径的中间层。",
      intuition:
        "Chain-of-thought 像在纸上列步骤想题，ReAct 像边想边做实验，二者分别适合不同的不确定性结构。",
      corePoints: [
        "Chain-of-thought 有助于分解复杂判断，让思考路径更具结构感。",
        "ReAct 把 reasoning 与 acting 交织在一起，更适合需要不断获取外部信息的任务。",
        "不同 reasoning 模式适合不同任务结构，关键在于是否需要频繁依赖环境反馈。",
      ],
      pitfalls: [
        "把所有任务都强行变成长链推理，忽略有些任务更适合快速检索和直接验证。",
        "把 ReAct 理解成频繁调用工具，忽视其本质是推理与观察之间的交替闭环。",
      ],
      examples: [
        "数学证明或多条件比较更适合以逐步推理方式组织思路。",
        "开放域问答和研究检索更适合边查证据边调整判断，因为很多事实不在当前上下文中。",
      ],
      scenario:
        "在多智能体系统中，不同角色甚至可能采用不同 reasoning 风格，例如规划角色更偏长链组织，执行角色更偏行动反馈。",
      next:
        "下一节会进一步讨论 planning 与 reflection，说明系统如何在任务前后进行结构化思考和自我修正。",
      takeaway:
        "Reasoning 的关键不只是多想，而是选择合适的组织方式，让思考与行动匹配任务结构。",
      terms: ["Chain-of-thought", "ReAct", "Reasoning", "Observation"],
      quizFocus:
        "先区分逐步内部推理与推理行动交替这两种核心思路。",
      applyPriority:
        "当前任务更需要内部分析，还是更需要通过外部观察不断修正判断。",
    },
    {
      slug: "planning-and-reflection",
      title: "Planning 与 Reflection",
      titleEn: "Planning and reflection",
      learningObjective:
        "理解 planning 与 reflection 在 agent 系统中的作用，以及它们如何帮助系统减少盲目行动和重复错误。",
      learningObjectiveEn:
        "Understand the roles of planning and reflection in agent systems.",
      overview:
        "本节讨论 planning 与 reflection 两种互补机制：前者关注行动前的目标组织与路径设计，后者关注行动后的复盘、偏差识别与策略修正。",
      whyImportant:
        "没有 planning，系统容易在复杂任务中迷失方向；没有 reflection，系统即使出错也很难真正吸取经验。",
      connection:
        "它把 reasoning 再向前后各延伸一步，形成任务前组织与任务后复盘的完整认知闭环。",
      intuition:
        "Planning 像出发前画路线图，reflection 像回来后做复盘笔记，前者降低盲目性，后者降低重复犯错概率。",
      corePoints: [
        "Planning 帮助系统明确目标结构、执行顺序和资源依赖。",
        "Reflection 帮助系统识别错误模式、比较预期与结果之间的差距。",
        "两者结合后，agent 更容易形成有方向感且可修正的长期行为。",
      ],
      pitfalls: [
        "把 planning 做成僵硬流程，忽略环境变化后仍需动态调整。",
        "把 reflection 变成表面自我评价，缺乏基于证据的偏差识别和策略修正。",
      ],
      examples: [
        "在复杂分析任务中，先形成子问题地图通常比直接动手更能减少中途返工。",
        "在多轮辅导场景中，如果系统能总结前一轮误解并调整后续解释，它会显得更有学习性。",
      ],
      scenario:
        "当任务跨越多个步骤、多个角色或多次交互时，planning 与 reflection 的价值会格外明显，因为它们帮助系统保持方向感并积累修正经验。",
      next:
        "下一章会从更外层的系统互动出发，讨论多智能体之间如何通信、协调以及形成稳定协作模式。",
      takeaway:
        "Planning 帮助系统更有方向地开始，reflection 帮助系统更有学习性地继续。",
      terms: ["Planning", "Reflection", "Task decomposition", "Self-correction"],
      quizFocus:
        "优先把 planning 和 reflection 理解为任务前组织与任务后修正两种互补机制。",
      applyPriority:
        "系统是否既能在行动前组织路径，也能在行动后基于结果调整策略。",
    },
  ],
};

const aiAgentCourseChapter4: ExampleChapterSeed = {
  slug: "communication-and-collaboration-patterns-in-multi-agent-systems",
  title: "多智能体通信机制与协作模式设计",
  titleEn: "Communication and Collaboration Patterns in Multi-Agent Systems",
  subchapters: [
    {
      slug: "message-passing-vs-shared-state",
      title: "Agent 通信机制（Message Passing 与 Shared State）",
      titleEn: "Communication: message passing vs shared state",
      learningObjective:
        "理解 message passing 与 shared state 两类通信方式的差异，以及它们各自适合的协作场景。",
      learningObjectiveEn:
        "Understand the difference between message passing and shared state communication.",
      overview:
        "本节讨论多智能体系统的两种典型通信机制：通过显式消息进行角色间交接，或通过共享状态让多个角色围绕同一上下文协作。",
      whyImportant:
        "通信方式会影响系统透明度、耦合度和调试难度，选错模式时角色之间就可能互相污染状态或丢失关键信息。",
      connection:
        "前一章讨论的是 agent 内部机制，这一章转向 agent 之间如何形成外部互动结构，通信是最基础的一层。",
      intuition:
        "Message passing 像发邮件或递工单，shared state 像多人共享白板，前者边界清楚，后者共享高效。",
      corePoints: [
        "Message passing 强调明确的发送者、接收者和交接语义。",
        "Shared state 强调多个角色围绕同一任务上下文持续协作。",
        "二者的取舍本质上是在边界清晰与共享效率之间平衡。",
      ],
      pitfalls: [
        "过度依赖共享状态，导致角色互相覆盖结论、难以追踪责任来源。",
        "过度依赖消息传递，导致通信链路冗长、延迟增加且格式转换成本上升。",
      ],
      examples: [
        "规划角色把任务明确发送给执行角色，更适合 message passing，因为交接边界清楚。",
        "多个审查角色围绕同一文档做批注时，共享状态往往更高效，因为大家需要看到同一上下文。",
      ],
      scenario:
        "在长流程协作里，很多系统会混合两种方式，让关键指令通过消息交接，让持续上下文通过共享状态维护。",
      next:
        "下一节会继续讨论多智能体如何通过协议和角色化交互建立更稳定的协作秩序。",
      takeaway:
        "通信模式决定了多智能体的信息流结构，而信息流结构直接影响协作清晰度与故障可追踪性。",
      terms: ["Message passing", "Shared state", "Blackboard", "Information flow"],
      quizFocus:
        "优先理解两种通信方式在边界清晰度和共享效率上的取舍。",
      applyPriority:
        "当前协作更需要显式交接，还是更需要围绕同一状态持续共享。",
    },
    {
      slug: "coordination-protocols-and-role-based-interaction",
      title: "协作协议与角色交互设计",
      titleEn: "Coordination protocols and role-based interaction",
      learningObjective:
        "理解协调协议在多智能体系统中的作用，以及角色化交互为何比随意对话更可控。",
      learningObjectiveEn:
        "Understand the role of coordination protocols and role-based interaction.",
      overview:
        "本节讨论 agent 之间不仅要通信，还要按协议通信。协议定义谁先发起、何时交接、何时等待、何时升级以及冲突如何解决。",
      whyImportant:
        "如果没有协议，多智能体系统很容易变成彼此轮流生成文本的松散聊天群，既难以预测，也难以治理。",
      connection:
        "这一节是对通信机制的进一步约束，把信息怎么流动的问题升级为信息在什么规则下流动。",
      intuition:
        "协议像会议规则，并不是每个人都随时插话，而是有主持、发言顺序、决策条件和结束标准。",
      corePoints: [
        "协议决定角色之间何时发起、何时响应、何时升级和何时结束。",
        "Role-based interaction 让交互围绕职责展开，而不是围绕任意表达展开。",
        "协调协议提升的是可预测性和可治理性，而不只是形式规范。",
      ],
      pitfalls: [
        "以为有了多个角色自然就会协作，忽略没有协议时系统很容易陷入重复或冲突交互。",
        "把协议设计得过于僵硬，导致系统在需要灵活调整时无法响应例外情况。",
      ],
      examples: [
        "让 planner 只有在收到 critic 审查结果后才允许修改方案，就是一种简单而有效的协调协议。",
        "让 worker 只能提交结构化中间结果而不能直接给最终结论，有助于保持角色边界清晰。",
      ],
      scenario:
        "在高可靠协作系统里，协议往往比角色名称更关键，因为角色只是标签，协议才决定这些标签如何形成秩序。",
      next:
        "下一节会介绍 pipeline、tree、loop 三种常见协作图式。",
      takeaway:
        "多智能体协作的可控性，很大程度上来自协议而不是来自角色数量本身。",
      terms: ["Protocol", "Role-based interaction", "Handoff", "Escalation"],
      quizFocus:
        "优先把协调协议理解为协作秩序，而不是形式化装饰。",
      applyPriority:
        "当前角色之间是否存在清晰的发起、交接、等待和结束规则。",
    },
    {
      slug: "pipeline-tree-loop",
      title: "协作模式（Pipeline / Tree / Loop）",
      titleEn: "Patterns: pipeline, tree, loop",
      learningObjective:
        "理解 pipeline、tree、loop 三种常见协作模式分别适合什么任务结构。",
      learningObjectiveEn:
        "Understand when pipeline, tree, and loop patterns are appropriate.",
      overview:
        "本节介绍多智能体协作中最常见的三种结构模式：pipeline 适合线性流程，tree 适合分支探索，loop 适合多轮反馈与修正。",
      whyImportant:
        "协作模式决定信息如何流动、时间如何分配以及错误会如何暴露，模式选得不合适时系统很难稳定高效。",
      connection:
        "在通信与协议之后，这一节把局部交互提升到整体结构层面，帮助理解多智能体系统的图式设计。",
      intuition:
        "Pipeline 像装配线，tree 像分支调查，loop 像带反馈的迭代改稿，不同任务天然适配不同图形。",
      corePoints: [
        "Pipeline 强调线性传递和职责串联，适合步骤相对固定的任务。",
        "Tree 强调并行分支与层级探索，适合发散分析和分层拆解问题。",
        "Loop 强调反馈、修正与多轮迭代，适合高不确定性或高质量要求任务。",
      ],
      pitfalls: [
        "把 loop 用在线性任务上，会平白增加循环成本和复杂度。",
        "把 tree 用在没有分支价值的任务上，会制造低价值并行和整合负担。",
      ],
      examples: [
        "文档处理流水线常见于 pipeline：抽取内容、整理结构、审查结果、生成最终摘要依次进行。",
        "研究探索更适合 tree：不同角色从多个假设或证据方向并行展开，最后再统一收束。",
      ],
      scenario:
        "任务越复杂，越需要从整体结构上理解协作，而不是只关注单个角色的提示词或局部能力。",
      next:
        "下一节会讨论同步与异步执行的差异，说明同样的协作模式在不同执行策略下会呈现不同系统行为。",
      takeaway:
        "Pipeline、tree、loop 分别对应线性推进、分支探索和反馈迭代三类典型任务结构。",
      terms: ["Pipeline", "Tree", "Loop", "Pattern"],
      quizFocus:
        "先把协作模式与任务结构对应起来，而不是把模式当作固定流行模板。",
      applyPriority:
        "当前任务更像线性推进、分支探索，还是需要多轮反馈修正。",
    },
    {
      slug: "sync-vs-async-execution",
      title: "同步与异步系统设计",
      titleEn: "Sync vs async execution",
      learningObjective:
        "理解同步执行与异步执行在多智能体系统中的差异，以及它们对效率、复杂度和稳定性的影响。",
      learningObjectiveEn:
        "Understand the tradeoffs between synchronous and asynchronous execution.",
      overview:
        "本节讨论协作结构之外的执行节奏问题。同步执行要求角色按顺序等待前一步结果，异步执行允许多个角色并行推进并在之后汇总。",
      whyImportant:
        "执行策略会改变系统延迟、吞吐、冲突概率和调试难度，很多多智能体问题并不是角色错了，而是节奏不匹配。",
      connection:
        "它是上一节协作模式的时间维度补充，说明同样的图式在不同执行节奏下会表现出不同系统特征。",
      intuition:
        "同步像开会按顺序发言，异步像多人并行准备材料后再汇报，前者更整齐，后者更高效但更难协调。",
      corePoints: [
        "同步执行更容易保持顺序一致性和状态清晰，但吞吐往往受限于最慢环节。",
        "异步执行更适合并行探索和规模扩展，但更容易引入状态冲突和整合复杂度。",
        "执行策略的选择本质上是在控制性与效率之间平衡。",
      ],
      pitfalls: [
        "为了追求快而盲目异步化，结果造成共享状态竞争、结果过期或汇总失真。",
        "为了追求稳而过度同步，结果让系统串行化严重，牺牲了本可获得的扩展性。",
      ],
      examples: [
        "多个审查角色同时阅读不同证据源并行给出意见，往往适合异步执行。",
        "涉及高风险动作确认的流程更适合同步执行，因为每一步都需要在前一步结果明确后再继续。",
      ],
      scenario:
        "在生产系统里，真正有效的设计通常不是纯同步或纯异步，而是根据任务风险和依赖结构做分层选择。",
      next:
        "下一章会把这些通信与协作模式放回整体架构与模型选择问题中继续讨论。",
      takeaway:
        "同步更强调秩序与清晰，异步更强调吞吐与扩展，关键在于任务是否允许并行与延后整合。",
      terms: ["Sync", "Async", "Throughput", "Coordination overhead"],
      quizFocus:
        "先理解同步和异步是在时间组织方式上的权衡，而不是单纯的性能标签。",
      applyPriority:
        "当前任务是否允许并行推进，以及并行结果是否容易安全整合。",
    },
  ],
};

const aiAgentCourseChapter5: ExampleChapterSeed = {
  slug: "system-architecture-model-selection-and-optimization",
  title: "Agent 系统架构、模型选择与工程优化",
  titleEn: "System Architecture, Model Selection, and Optimization",
  subchapters: [
    {
      slug: "layered-architecture-agent-tool-data",
      title: "Agent 系统架构分层（Agent / Tool / Data）",
      titleEn: "Layered architecture: agent, tool, data",
      learningObjective:
        "理解 agent、tool、data 三层架构为何是多智能体系统分析与设计中的重要视角。",
      learningObjectiveEn:
        "Understand why an agent-tool-data layered architecture is useful in multi-agent systems.",
      overview:
        "本节从分层角度看待多智能体系统：agent 层负责角色逻辑与决策流程，tool 层负责执行能力与外部接口，data 层负责状态、知识与记录。",
      whyImportant:
        "如果角色逻辑、工具调用和数据状态全部混在一起，系统就会难以定位问题、难以替换组件，也难以理解性能和风险来自哪里。",
      connection:
        "前面几章关注角色和协作，本章开始转向工程结构问题，分层视角是理解后续扩展和优化的基础。",
      intuition:
        "可以把三层看成大脑、手脚和记忆仓库，分开治理能让复杂系统更容易理解和维护。",
      corePoints: [
        "Agent 层承载角色职责、策略选择和协作逻辑。",
        "Tool 层承载外部能力接入、接口封装与权限控制。",
        "Data 层承载长期知识、运行状态、日志与评估材料。",
      ],
      pitfalls: [
        "把数据访问直接嵌在角色推理里，导致角色与存储强耦合。",
        "把工具层当作纯技术细节，忽视它本身也是能力边界与风险边界的一部分。",
      ],
      examples: [
        "在知识分析系统中，agent 层决定谁检索谁审查，tool 层负责调用搜索接口，data 层负责保存证据和记录。",
        "在辅导系统中，agent 层负责解释和反馈，data 层保存学习状态，tool 层负责内容检索与测验服务。",
      ],
      scenario:
        "无论系统规模大小，分层思维都能帮助团队回答一个关键问题：当前复杂性究竟应该在角色逻辑、工具接口还是数据组织上被解决。",
      next:
        "下一节会进一步讨论 modular 与 scalable design，说明分层之后如何真正让系统可扩展。",
      takeaway:
        "分层架构的价值在于把不同性质的复杂性分开治理，而不是把一切都压进 agent 层。",
      terms: ["Layered architecture", "Agent layer", "Tool layer", "Data layer"],
      quizFocus:
        "优先理解三层架构是在分配复杂性，而不是增加形式主义。",
      applyPriority:
        "当前问题更应该在角色逻辑、工具接口还是数据组织层解决。",
    },
    {
      slug: "modular-and-scalable-design",
      title: "模块化与可扩展设计",
      titleEn: "Modular and scalable design",
      learningObjective:
        "理解模块化与可扩展设计为什么是多智能体系统长期演进的前提。",
      learningObjectiveEn:
        "Understand why modular and scalable design is essential for long-term evolution.",
      overview:
        "本节讨论系统如何从能运行走向能扩展。模块化强调职责封装、接口稳定和局部替换能力，可扩展设计强调在任务量、角色数和能力范围增长时仍保持可理解与可维护。",
      whyImportant:
        "多智能体系统天然比单体系统复杂，如果没有模块化边界，随着角色、工具和流程增加，系统会迅速变得难以修改和难以验证。",
      connection:
        "在分层架构基础上，这一节回答如何让系统具备演进空间，而不是随着需求增长不断堆叠偶然复杂性。",
      intuition:
        "模块化像积木而不是混凝土浇筑，积木允许你替换某一块而不推倒整栋结构。",
      corePoints: [
        "模块化让角色、工具和存储可以独立演进而不牵动全局。",
        "可扩展设计要求系统在增加任务量和角色数量时仍保持接口清晰与行为可预测。",
        "模块边界设计得好，系统调试、评估和优化的代价都会明显下降。",
      ],
      pitfalls: [
        "为了快速迭代把逻辑都写进一个大流程里，后期很难拆分和验证。",
        "表面上切成很多模块，但模块之间依赖混乱、接口频繁变化，结果仍然不可扩展。",
      ],
      examples: [
        "如果审查角色可以在不改变执行角色逻辑的前提下被替换成另一种策略，说明系统更接近真正模块化。",
        "如果增加一种新的检索工具不需要重写整个协作链路，说明架构具备更好的扩展性。",
      ],
      scenario:
        "当系统从演示走向长期使用时，真正阻碍进化的往往不是模型能力，而是模块边界不清导致的变更成本过高。",
      next:
        "下一节会转向模型选择问题，讨论为什么不同角色不必都使用同一种模型。",
      takeaway:
        "模块化是为了让系统可以局部替换、局部优化和局部扩展，而不是把复杂度一次性锁死。",
      terms: ["Modularity", "Scalability", "Interface stability", "Replacement"],
      quizFocus:
        "先理解模块化是在为长期演进降低耦合和变更成本。",
      applyPriority:
        "当前系统是否允许局部替换角色、工具或数据模块而不牵动全局。",
    },
    {
      slug: "model-selection-strong-vs-cheap-models",
      title: "模型选择策略（强模型 vs 便宜模型）",
      titleEn: "Model selection: strong vs cheap models",
      learningObjective:
        "理解为什么多智能体系统中的不同角色可以匹配不同强度与成本的模型。",
      learningObjectiveEn:
        "Understand why different roles can be matched with different model strength and cost profiles.",
      overview:
        "本节关注模型选择。并不是所有角色都需要最强模型，也不是所有任务都适合低成本模型，不同角色应匹配不同认知负载。",
      whyImportant:
        "如果一味追求最强模型，系统成本和延迟会迅速上升；如果过度追求便宜模型，又可能在关键判断节点损失质量。",
      connection:
        "在架构与模块化之后，模型选择是系统级资源配置问题，它决定哪一层、哪一角色值得投入高成本推理能力。",
      intuition:
        "像团队中并不是每件事都需要最资深的人处理，真正高效的系统会把高难度决策交给强模型，把标准化工作交给便宜模型。",
      corePoints: [
        "强模型更适合高歧义、高推理负载和高风险判断任务。",
        "便宜模型更适合高频、结构化、低风险的局部任务。",
        "合理的模型分配能在质量、速度和成本之间建立更平衡的系统曲线。",
      ],
      pitfalls: [
        "把所有角色统一绑定到同一模型，忽略不同任务负载差异。",
        "为了节省成本把关键判断节点也交给廉价模型，结果把错误传播到全系统。",
      ],
      examples: [
        "让强模型负责制定检索策略和整合结论，让便宜模型负责清洗中间文本，通常比全程使用同一强模型更经济。",
        "在审查环节使用更强模型，往往比在每一个局部步骤都使用强模型更能提升整体稳健性。",
      ],
      scenario:
        "随着系统规模扩大，模型选择会成为架构问题而不只是采购问题，因为它直接决定吞吐、预算、用户体验和质量上限。",
      next:
        "最后一节会把成本与性能优化放在一起，讨论系统如何在资源约束下持续提升。",
      takeaway:
        "模型选择的关键不是统一追求最强或最便宜，而是让不同角色匹配合适的认知成本配置。",
      terms: ["Model routing", "Strong model", "Cheap model", "Cognitive load"],
      quizFocus:
        "优先理解模型选择是在做角色负载与成本能力的匹配。",
      applyPriority:
        "哪些角色真的需要高强度推理，哪些角色更适合低成本处理。",
    },
    {
      slug: "cost-and-performance-optimization",
      title: "成本与性能优化",
      titleEn: "Cost and performance optimization",
      learningObjective:
        "理解多智能体系统中的成本与性能优化不只是压缩费用，而是整体系统权衡问题。",
      learningObjectiveEn:
        "Understand cost and performance optimization as a whole-system tradeoff problem.",
      overview:
        "本节讨论系统优化。成本包括模型调用、工具使用、通信和存储开销；性能不仅包括质量，也包括延迟、吞吐、稳定性和用户感知。",
      whyImportant:
        "很多系统表面上效果不错，却因为调用过多、响应过慢或协调成本过高而难以长期运行。",
      connection:
        "它收束本章前面关于架构、模块与模型选择的讨论，把这些因素统一放到系统运营视角下重新考量。",
      intuition:
        "优化像调节一台复杂机器，不是把某个旋钮拧到最大，而是让多个旋钮协同达到更合适的工作点。",
      corePoints: [
        "成本优化需要识别哪些步骤真正创造价值，哪些步骤只是重复或低收益开销。",
        "性能优化需要同时看质量、速度、稳定性和资源消耗，而不是单指标最大化。",
        "多智能体优化往往发生在路由、角色数量、执行节奏和缓存利用等系统层面。",
      ],
      pitfalls: [
        "只盯着单次调用费用，忽略多余角色、重复通信和低价值工具调用带来的系统性浪费。",
        "只盯着速度，把必要的审查和控制环节也砍掉，导致短期更快、长期更不稳。",
      ],
      examples: [
        "减少不必要的循环与审查轮次，往往比单纯更换便宜模型更能显著降低系统总成本。",
        "在高频场景中，把简单任务快速路由给轻量角色，同时保留复杂任务的高质量链路，通常能提升整体体验。",
      ],
      scenario:
        "当系统规模扩大到真实使用阶段，优化问题会变成持续运营问题，此时最重要的是是否建立了面向整体的资源与质量权衡观。",
      next:
        "最后一章会聚焦稳定性、调试、评估和未来趋势，补上让系统长期可信运行的最后一块拼图。",
      takeaway:
        "成本与性能优化的本质是系统级权衡，而不是单指标压缩或局部技巧叠加。",
      terms: ["Latency", "Throughput", "Cost efficiency", "Tradeoff"],
      quizFocus:
        "先把优化理解为整体权衡问题，而不是孤立追求最便宜或最快。",
      applyPriority:
        "当前系统的主要资源浪费和主要性能瓶颈究竟发生在哪一层。",
    },
  ],
};

const aiAgentCourseChapter6: ExampleChapterSeed = {
  slug: "stability-debugging-evaluation-and-future-trends",
  title: "多智能体系统的稳定性、调试与未来趋势",
  titleEn: "Stability, Debugging, Evaluation, and Future Trends",
  subchapters: [
    {
      slug: "failure-modes-hallucination-loops-error-propagation",
      title: "常见问题与失败模式",
      titleEn: "Failure modes: hallucination, loops, error propagation",
      learningObjective:
        "理解多智能体系统中的常见失败模式，以及这些失败为何往往是系统层面的而不只是模型层面的。",
      learningObjectiveEn:
        "Understand common failure modes such as hallucination, loops, and error propagation.",
      overview:
        "本节聚焦稳定性问题。幻觉、循环和错误传播是多智能体系统中最常见的三类失效模式，它们常常沿着链路被放大。",
      whyImportant:
        "多智能体系统并不会天然更稳定，角色越多、链路越长，错误越可能跨角色扩散，最终变成难以追踪的系统性失真。",
      connection:
        "这是整门课进入收束阶段的开始，前面讨论的记忆、工具、通信与架构都可以在这里重新被理解为稳定性问题的来源或缓解手段。",
      intuition:
        "可以把失败模式想成系统性病灶，它们不会只影响某一条回答，而会在链路中重复出现并不断放大。",
      corePoints: [
        "Hallucination 往往来自证据不足、错误 grounding 或过度自信的生成机制。",
        "Loop 往往来自停止条件模糊、反馈信号无效或协议设计不清。",
        "Error propagation 的危险在于一个局部错误会被后续角色当作事实继续加工。",
      ],
      pitfalls: [
        "把所有稳定性问题都归因于模型幻觉，忽略通信、记忆污染和角色耦合也会制造错误。",
        "只在最终输出上找问题，忽略错误往往在更早的中间步骤就已经形成。",
      ],
      examples: [
        "一个检索角色若拿回无关文档，后续总结角色和审查角色都可能在错误材料上继续工作，形成 error propagation。",
        "一个角色不断请求补充信息但协议没有明确终止条件，就可能陷入表面合理却无穷重复的 loop。",
      ],
      scenario:
        "稳定性分析的关键不在于证明系统永不出错，而在于理解错误如何产生、如何被放大以及如何在系统中被及时切断。",
      next:
        "下一节会讨论 debugging 方法，说明在复杂多角色链路中如何通过 logging、tracing 和 replay 定位问题。",
      takeaway:
        "多智能体系统的失败往往是链路性和结构性的，理解失败模式是建立稳定系统观的前提。",
      terms: ["Hallucination", "Loop", "Error propagation", "Stability"],
      quizFocus:
        "优先把失败模式看成系统链路问题，而不是单点输出问题。",
      applyPriority:
        "当前错误更像证据问题、循环问题，还是被跨角色放大的传播问题。",
    },
    {
      slug: "debugging-logging-tracing-replay",
      title: "调试方法（Logging / Trace / Replay）",
      titleEn: "Debugging: logging, tracing, replay",
      learningObjective:
        "理解 logging、tracing 与 replay 在多智能体调试中的作用，以及为什么调试能力是系统可信性的基础。",
      learningObjectiveEn:
        "Understand the role of logging, tracing, and replay in debugging multi-agent systems.",
      overview:
        "本节讨论复杂 agent 系统如何被调试。Logging 记录关键事件与状态，tracing 串起跨角色的因果链路，replay 帮助重现系统行为以定位问题。",
      whyImportant:
        "多智能体系统的失败往往不是一眼可见的单点 bug，而是多个角色、工具和状态在时间上组合出的行为。",
      connection:
        "上一节识别了失败模式，这一节回答当失败真的发生时，系统该如何被看见、被解释和被定位。",
      intuition:
        "如果把系统看成一场多角色接力，logging 是记分牌，tracing 是录像回放，replay 是重新跑一遍同样比赛。",
      corePoints: [
        "Logging 帮助记录关键输入、输出、工具调用和状态变化。",
        "Tracing 帮助把分散事件串成角色间的因果路径，理解错误如何扩散。",
        "Replay 帮助在相似条件下重现问题，区分偶发噪声与稳定缺陷。",
      ],
      pitfalls: [
        "只记录最终答案，不记录中间决策、工具结果和角色交接，导致无法真正排查。",
        "收集了大量日志却没有结构化 tracing，结果信息很多但无法建立因果解释。",
      ],
      examples: [
        "当最终回答错误时，tracing 可以帮助判断是检索拿错了材料，还是审查角色忽略了前序冲突。",
        "当系统偶尔进入重复循环时，replay 能帮助判断是特定输入触发的协议漏洞，还是状态管理存在普遍问题。",
      ],
      scenario:
        "在长期运行的 agent 系统中，调试能力本身就是产品能力的一部分，因为没有调试能力就无法持续改进。",
      next:
        "下一节会从个别故障定位转向整体能力衡量，讨论 evaluation methods 应该如何理解。",
      takeaway:
        "调试能力让多智能体系统从不可解释的黑箱，变成可以观察、分析和持续改进的工程对象。",
      terms: ["Logging", "Tracing", "Replay", "Observability"],
      quizFocus:
        "先把调试理解为建立因果可见性，而不是只看最终结果对错。",
      applyPriority:
        "系统是否能完整记录关键事件，并把它们串成可分析的行为链路。",
    },
    {
      slug: "evaluation-methods",
      title: "评估体系",
      titleEn: "Evaluation methods",
      learningObjective:
        "理解多智能体系统的评估为什么必须覆盖过程与结果，而不是只看最终答案是否看起来合理。",
      learningObjectiveEn:
        "Understand why evaluation must cover both process and outcomes.",
      overview:
        "本节讨论评估方法。多智能体系统不仅要评估最终输出质量，还要评估中间推理质量、角色协作质量、成本、延迟、稳定性和可恢复性。",
      whyImportant:
        "如果只看最终答案，很多过程性问题会被隐藏，例如系统可能偶尔答对，但路径代价过高或协作充满冗余。",
      connection:
        "在失败模式和调试之后，评估是更系统化的能力测量，它让团队持续理解系统在哪些条件下可靠、在哪些条件下脆弱。",
      intuition:
        "评估像体检，不只看一个表面指标，而是综合看多个维度的健康状况。",
      corePoints: [
        "结果评估关注正确性、完整性、相关性和用户价值。",
        "过程评估关注角色协作路径、证据使用、工具行为和中间状态是否合理。",
        "系统评估还必须考虑成本、延迟、稳定性与失败恢复能力等运营维度。",
      ],
      pitfalls: [
        "只用少量成功案例证明系统有效，忽略边界输入、长尾问题和失败样本。",
        "只评估最终文本表现，不评估系统是否以高代价或高风险方式得到答案。",
      ],
      examples: [
        "一个回答看似正确的系统，可能为了得到答案反复调用大量无关工具，这说明过程层面并不优秀。",
        "一个研究系统如果最终结论正确但多次引用不稳定证据，说明它在稳定性与可重复性上仍有缺口。",
      ],
      scenario:
        "只有把结果、过程和系统三层评估结合起来，团队才能真正知道多智能体系统是偶尔有效，还是在目标场景中稳定有效。",
      next:
        "最后一节会把视角拉远，讨论 agent-native software systems 可能带来的未来趋势。",
      takeaway:
        "多智能体评估的关键不是单一正确率，而是结果、过程和系统维度的综合理解。",
      terms: ["Outcome evaluation", "Process evaluation", "Robustness", "Recovery"],
      quizFocus:
        "优先把评估理解成对系统边界和运行质量的综合测量。",
      applyPriority:
        "当前评估是否同时覆盖结果质量、过程质量和系统运行质量。",
    },
    {
      slug: "future-agent-native-software-systems",
      title: "未来趋势与发展方向",
      titleEn: "Future: agent-native software systems",
      learningObjective:
        "理解 agent-native software systems 这一趋势意味着什么，以及它为何代表软件组织方式的潜在变化。",
      learningObjectiveEn:
        "Understand what agent-native software systems imply for the future organization of software.",
      overview:
        "本节作为整门课的总结，讨论 agent-native software systems 这一趋势，说明未来软件可能从静态功能页面转向围绕角色、任务和协作流程来组织。",
      whyImportant:
        "如果未来软件越来越多地以 agent 为基本单元，那么今天关于角色、协议、架构、评估和治理的理解，就会成为新一代系统设计的基础语言。",
      connection:
        "它把前面所有内容重新汇总：从 agent 定义、多智能体协作、核心机制、通信模式、架构选择，到稳定性与评估，最终都指向对新型软件系统形态的理解。",
      intuition:
        "传统软件更像固定按钮和页面，agent-native 软件更像一套可协作的认知组织，用户是在与多个智能角色共同完成目标。",
      corePoints: [
        "Agent-native 系统强调任务导向、角色协作和动态决策，而不是纯静态功能流。",
        "未来系统的竞争力可能越来越取决于协作结构、治理能力和可观察性，而不仅是单模型能力。",
        "人类仍会在高风险判断、价值选择和目标设定中保留关键地位，未来更像人机共治。",
      ],
      pitfalls: [
        "把未来趋势简单理解为更多自主性，忽略治理、审计和责任分配会同样重要。",
        "把 agent-native 软件等同于把所有逻辑都交给模型，忽视系统工程仍是核心基础。",
      ],
      examples: [
        "未来的学习平台可能不再只是展示内容，而是由规划、辅导、评估与反馈角色共同构成学习过程。",
        "未来的企业工具可能不再只是表单系统，而是多个角色围绕任务推进、证据检索和风险审查协同运行。",
      ],
      scenario:
        "当软件越来越多地面向复杂目标和动态环境时，agent-native 设计会让系统更像可协作组织而不是静态工具集合。",
      next:
        "到这里，这门课程已经完成，你已经具备从概念、机制、架构到未来趋势理解多智能体系统的完整主线。",
      takeaway:
        "未来的软件系统可能越来越以 agent 与协作为核心组织方式，而系统设计与治理能力将比以往更重要。",
      terms: ["Agent-native software", "Human-AI collaboration", "Governance", "Evolution"],
      quizFocus:
        "优先把未来趋势理解为软件组织方式的变化，而不是单纯能力变强。",
      applyPriority:
        "面对未来系统演进时，首先要考虑角色协作与治理结构如何被设计。",
    },
  ],
};

const aiAgentCourseReplacementSeed: ExampleCourseSeed = {
  slug: "ai-agent-development",
  title: "构建 AI Agents：多智能体系统解析",
  titleEn: "Building AI Agents: Multi-Agent Systems Explained",
  topic: "AI Agent 与多智能体系统",
  topicEn: "AI Agents and Multi-Agent Systems",
  description:
    "这门官方示例课从系统视角解释 AI Agent 与多智能体系统，重点讲清定义、协作、记忆、工具、通信、架构、评估与未来趋势。",
  descriptionEn:
    "This official sample course explains AI agents and multi-agent systems from a systems perspective, with a focus on concepts, collaboration, memory, tools, communication, architecture, evaluation, and future trends.",
  goals: [
    "理解 AI Agent 是系统角色，而不是单次模型调用",
    "理解多智能体系统中的分工、通信与协作逻辑",
    "建立关于稳定性、评估、调试与演进方向的整体视角",
  ],
  goalsEn: [
    "Understand AI agents as system roles rather than single model calls",
    "Understand division of labor, communication, and collaboration in multi-agent systems",
    "Build an integrated view of stability, evaluation, debugging, and long-term evolution",
  ],
  chapters: [
    aiAgentCourseChapter1,
    aiAgentCourseChapter2,
    aiAgentCourseChapter3,
    aiAgentCourseChapter4,
    aiAgentCourseChapter5,
    aiAgentCourseChapter6,
  ],
};

const aiAgentCourseV2Chapter1: ExampleChapterSeed = {
  slug: "foundations-of-ai-agents",
  title: "智能体基础",
  titleEn: "Foundations of AI Agents",
  subchapters: [
    {
      slug: "what-makes-an-ai-agent",
      title: "什么是智能体",
      titleEn: "What Makes an AI Agent",
      learningObjective:
        "理解智能体不是一次性回答器，而是围绕目标、状态与反馈持续运行的系统角色。",
      learningObjectiveEn:
        "Understand an AI agent as a goal-directed system role rather than a one-shot answer generator.",
      overview:
        "这一节先把“智能体”这件事讲清楚。很多人第一次接触时，会把它理解成“更会聊天的大模型”，但真正有用的理解方式是把它看成一个会围绕目标持续运作的系统单元：它要接收信息、形成判断、采取动作，还要根据结果不断修正自己的下一步。",
      whyImportant:
        "如果一开始就把智能体看窄了，后面关于多智能体、记忆、工具、通信和稳定性的内容都会被误读。因为这些内容讨论的，根本不是“模型多会说”，而是“系统怎样连续地做事”。",
      connection:
        "这一节是整门课的起点。后面你学到的每一个机制，无论是记忆、工具还是协作协议，本质上都是在回答同一个问题：怎样让一个围绕目标行动的系统更可靠。",
      intuition:
        "可以把智能体想成一个负责把事情推进下去的“数字岗位”，而不是一个被动等人提问的百科页面。页面只负责展示信息，岗位则必须对目标负责。",
      corePoints: [
        "智能体的核心不在于会不会生成语言，而在于是否围绕目标持续感知、判断并行动。",
        "智能体是系统中的执行角色，它通常处在信息输入、决策形成与动作输出的中间枢纽位置。",
        "判断一个系统是否像智能体，关键不是界面像不像聊天框，而是它有没有形成面向目标的闭环行为。",
      ],
      pitfalls: [
        "把智能体等同于“能连续对话的大语言模型”，忽略它必须承担任务推进和结果修正的职责。",
        "只看演示效果里的智能感，而不追问它在目标、状态和反馈层面是否真的形成闭环。",
      ],
      examples: [
        "一个普通问答模型回答完问题就结束了；而学习平台里的辅导智能体需要持续追踪用户正在学哪一节、理解卡在什么地方、下一步该补什么内容，这才更像真正的智能体。",
        "客服脚本可以按固定流程回复，但如果系统能根据用户意图、历史上下文和执行结果动态调整处理路径，那它承担的已经不是单轮回复，而是智能体式的服务角色。",
      ],
      scenario:
        "在真实产品里，只有当系统要面对持续目标、动态状态和多步任务时，智能体视角才真正显出价值。它帮助你把“回答一次”升级成“把事情推进到结果”。",
      next:
        "接下来我们会进一步拆开智能体最核心的三类能力：感知、推理与行动。只有把这三者区分清楚，后面的架构讨论才不会混成一团。",
      takeaway:
        "智能体首先是一种围绕目标持续运作的系统角色，然后才是一种由模型驱动的能力形态。",
      terms: ["Agent", "Goal-directed behavior", "Environment", "Feedback loop"],
      quizFocus:
        "优先理解智能体为什么是持续行动的系统角色，而不是单次生成结果的接口。",
      applyPriority:
        "分析一个候选系统时，先看它是否真的围绕目标、状态与反馈形成闭环，再谈它像不像智能体。",
    },
    {
      slug: "perception-reasoning-and-action",
      title: "感知、推理与行动",
      titleEn: "Perception, Reasoning, and Action",
      learningObjective:
        "掌握智能体三段式能力模型，并理解三者失衡时为什么会直接影响系统可靠性。",
      learningObjectiveEn:
        "Understand the perception-reasoning-action model and why imbalance between the three harms reliability.",
      overview:
        "智能体最常见的误解之一，是把所有能力都压到“推理”两个字里。事实上，一个系统要真正做成智能体，至少要先看清输入，再形成判断，最后把判断变成可执行动作。少了任何一段，系统都会看起来很聪明、实际却很不稳。",
      whyImportant:
        "很多失败系统不是输在模型不够强，而是输在能力链条断裂。看错输入会导致后面全盘跑偏，判断再聪明也没用；动作边界不清，又会让正确判断落不到真实世界。",
      connection:
        "这一节把“智能体在做什么”拆成三个层次，后面的工具、记忆、规划和通信，其实都是在服务这三类能力中的某一类，或者在协调它们之间的关系。",
      intuition:
        "可以把它想成开车：看路是感知，决定是否变道是推理，真正打方向盘和踩刹车是行动。只会想但看不清路，或者看清了却不能正确操作，都会出事故。",
      corePoints: [
        "感知负责把环境输入转成系统可处理的状态表示，是所有后续判断的前提。",
        "推理负责把目标、约束和当前状态组织成决策路径，它决定系统为什么这样行动。",
        "行动负责把内部判断变成外部效果，真正把系统从“会想”带到“能做”。",
      ],
      pitfalls: [
        "把高质量输出误认为高质量推理，忽略系统可能只是碰巧生成了看起来合理的答案。",
        "把行动理解成最后一步按钮点击，忽略执行权限、工具边界和结果回写同样属于行动设计的一部分。",
      ],
      examples: [
        "一个检索问答智能体如果先拿到了错误文档，再强的推理也只是在错误前提上展开，所以感知错误会直接污染后续推理。",
        "一个任务分配智能体如果已经判断出要调用外部日历工具，却没有足够权限写入事件，那系统在行动层面就会卡住，用户看到的仍然是失败。",
      ],
      scenario:
        "当你评估一个智能体流程时，最值得先问的不是“它结果好不好”，而是“问题出在看错、想错，还是做错”。这会大幅提升定位系统问题的速度。",
      next:
        "理解完能力模型后，下一节会把这些能力装进一个最小可运行架构里，看看大语言模型、工具和循环闭环是如何组合起来的。",
      takeaway:
        "智能体能力不是一个模糊的“智能”，而是一条由感知、推理和行动串起来的完整链路。",
      terms: ["Perception", "Reasoning", "Action", "Feedback loop"],
      quizFocus:
        "优先建立三段式能力链路的判断框架，而不是只盯着推理表现。",
      applyPriority:
        "遇到系统异常时，先分辨问题发生在感知、推理还是行动，再决定如何修正。",
    },
    {
      slug: "minimal-architecture-and-system-role",
      title: "最小架构与系统角色",
      titleEn: "Minimal Architecture and System Role",
      learningObjective:
        "理解最小智能体为什么通常由大语言模型、工具和循环闭环组成，以及它在软件系统里承担什么角色。",
      learningObjectiveEn:
        "Understand why a minimal agent usually combines an LLM, tools, and a loop, and what system role that creates.",
      overview:
        "当我们说“最小智能体架构”时，说的不是某个具体框架，而是一种足以让系统连续工作的基本组合：模型负责理解和生成，工具负责连接外部能力，循环闭环负责让系统根据反馈继续推进，而不是一次输出后就结束。",
      whyImportant:
        "如果不知道最小架构里每一层分别在做什么，就很容易把所有职责都塞给模型，最后得到一个看似万能、实际上难以扩展也难以治理的系统。",
      connection:
        "这一节把前两节的概念真正落到结构上。前面学的是“智能体是什么、有哪些能力”，这一节开始回答“这些能力怎样被放进软件系统里”。",
      intuition:
        "可以把最小智能体架构想成一个小型工作站：大语言模型像中枢大脑，工具像外部设备，循环闭环像不断检查工作是否完成的流程控制。",
      corePoints: [
        "大语言模型提供语言理解与决策生成能力，但它本身不是完整系统。",
        "工具把系统连接到检索、数据库、执行器或外部服务，让智能体从“会说”变成“能做”。",
        "循环闭环让系统能够根据中间结果继续调整，而不是把一次生成当成最终结论。",
      ],
      pitfalls: [
        "把最小架构误解成“模型加几个工具”即可，忽略循环闭环和状态更新才是系统连续性的来源。",
        "把智能体放进产品后仍把它当作边缘功能，导致权限、状态、日志和人工接管都没有被当成一等公民设计。",
      ],
      examples: [
        "写作辅助系统如果只有模型生成，没有外部检索和迭代修订环节，就更像一次性文本补全，而不是能持续产出改进结果的智能体。",
        "行程管理智能体需要读取日历、判断冲突、写入安排并检查是否成功，这个过程恰好体现了模型、工具与循环闭环如何一起构成最小系统。",
      ],
      scenario:
        "在产品设计里，理解最小架构的价值在于你会更快看清应该把哪些能力留在模型层，哪些能力放到工具层，哪些逻辑必须交给流程闭环去约束。",
      next:
        "下一章会从单个智能体继续往上走，讨论为什么很多复杂任务最终需要多智能体协作，而不是把所有职责都压给一个角色。",
      takeaway:
        "最小智能体架构的关键不只是模型，而是模型、工具与循环闭环共同形成的可持续执行结构。",
      terms: ["LLM", "Tool", "Loop", "Agent"],
      quizFocus:
        "优先理解最小架构里的职责分工，而不是把智能体简单压缩成模型能力。",
      applyPriority:
        "分析系统设计时，先判断模型、工具和循环闭环各自承担了什么职责，再评估架构是否清晰。",
    },
  ],
};

const aiAgentCourseV2Chapter2: ExampleChapterSeed = {
  slug: "multi-agent-collaboration",
  title: "多智能体协作",
  titleEn: "Multi-Agent Collaboration",
  subchapters: [
    {
      slug: "why-multi-agent-systems",
      title: "为什么需要多智能体",
      titleEn: "Why Multi-Agent Systems",
      learningObjective:
        "理解单智能体在复杂任务中的典型瓶颈，以及多智能体为什么能成为结构性解法。",
      learningObjectiveEn:
        "Understand the limits of single-agent systems and why multi-agent design becomes a structural answer.",
      overview:
        "单智能体并不是没用，很多简单流程它已经足够。但一旦任务变长、目标变多、依赖变复杂，所有事情都交给一个角色处理，就会出现认知负担过重、上下文混乱、责任边界不清和错误难以隔离的问题。",
      whyImportant:
        "多智能体系统的价值，不是为了看起来更高级，而是为了把复杂性拆开管理。只有先看懂单角色为什么会失控，才能明白多角色为什么不是“堆角色”，而是“重构系统结构”。",
      connection:
        "这一节承接上一章的最小智能体架构，但把问题从“单个角色怎样运作”提升到“多个角色怎样共同推进任务”。",
      intuition:
        "可以把它想成一家公司。小事情一个人包办没问题，但项目一复杂，计划、执行、审核全压在同一个人身上，效率和稳定性都会迅速下降。",
      corePoints: [
        "单智能体的主要瓶颈常常来自上下文负担、任务跨度和职责混杂，而不只是模型能力不足。",
        "多智能体的意义在于把不同类型的判断和执行拆给不同角色承担，降低单点压力。",
        "真正值得引入多智能体的场景，通常都具有长链路、多约束或高错误代价等特征。",
      ],
      pitfalls: [
        "把多智能体理解成“角色越多越强”，忽略协作本身也会引入额外开销和新的不稳定性。",
        "明明任务规模还很小，却过早拆成复杂多角色结构，反而让系统比单智能体更难维护。",
      ],
      examples: [
        "一个短问答助手通常不需要多智能体；但如果要完成研究、比对、审核和汇总，多角色分工就会明显提升清晰度。",
        "在企业流程里，需求分析、文档生成和合规检查如果都交给一个角色，错误往往会混在一起；拆开后更容易发现是哪一层出了问题。",
      ],
      scenario:
        "判断是否要进入多智能体设计，一个实用标准是：当前任务是不是已经长到一个角色很难同时兼顾理解、执行、校验和纠错。",
      next:
        "既然要拆角色，下一节就会讨论拆分依据到底是什么，也就是多智能体里的分工原则和协作逻辑。",
      takeaway:
        "多智能体不是为了增加表面复杂度，而是为了在复杂任务里重新分配认知负担与责任边界。",
      terms: ["Agent", "Cognitive load", "Scalability", "Task decomposition"],
      quizFocus:
        "优先理解多智能体出现的结构性原因，而不是把它当成炫技式扩容。",
      applyPriority:
        "判断是否需要多智能体时，先看任务复杂性和职责冲突，再看角色数量。",
    },
    {
      slug: "roles-and-collaboration-logic",
      title: "角色分工与协作逻辑",
      titleEn: "Roles and Collaboration Logic",
      learningObjective:
        "理解多智能体不是随意拆角色，而是要按照职责、信息流和校验关系设计协作逻辑。",
      learningObjectiveEn:
        "Understand role design as a matter of responsibilities, information flow, and verification logic rather than arbitrary splitting.",
      overview:
        "多智能体系统里最难的从来不是“起几个角色名字”，而是决定每个角色到底拿什么信息、做什么判断、输出给谁、由谁复核。角色设计做得好，协作会自然；角色设计做不好，系统只会变成多人同时混乱。",
      whyImportant:
        "角色一旦定义模糊，系统里的错误就会快速扩散。因为你既不知道是谁做错了，也不知道应该由谁来纠正，这会直接削弱系统的可解释性和可治理性。",
      connection:
        "这一节把上一节提出的“为什么需要多智能体”继续推进到“如果要拆，应该怎么拆”。它也是后面通信机制和协作模式设计的前提。",
      intuition:
        "就像接力赛，最重要的不是参赛人数，而是谁跑哪一段、什么时候交棒、谁负责最后确认成绩。角色关系一旦不清，跑得再快也会掉棒。",
      corePoints: [
        "角色设计首先是职责设计，每个角色都应该有清楚的输入、输出和判断边界。",
        "协作逻辑本质上是在设计信息如何流动、任务如何交接、错误如何被发现。",
        "好的分工不是平均分配任务，而是让不同角色承担最适合自己的判断压力。",
      ],
      pitfalls: [
        "只按功能名义拆角色，却没有为角色建立清楚的输入输出边界，导致协作看似分工、实际互相覆盖。",
        "把审核角色设计成事后补丁，而不是协作逻辑里的正式环节，结果常常是问题已经扩散后才被发现。",
      ],
      examples: [
        "在研究型智能体系统里，规划者负责拆题，执行者负责搜集材料，审查者负责发现逻辑漏洞，这种分工比让一个角色同时负责全部环节更容易保持质量。",
        "如果一个角色既要写方案又要审自己写的方案，系统就容易出现“看起来通过了，实际上没人真正复查”的假象。",
      ],
      scenario:
        "真实设计中，角色分工的好坏会直接影响调试效率。边界清晰时，问题能快速落到某一段；边界混乱时，你只能看到整体结果变差，却看不清错在哪一层。",
      next:
        "在理解分工原则后，下一节会讨论多智能体真正带来的系统层收益，也就是为什么它会提升可扩展性、稳定性与可控性。",
      takeaway:
        "多智能体协作的核心不是角色数量，而是职责边界、信息流向和校验关系是否被设计清楚。",
      terms: ["Planner", "Worker", "Critic", "Task decomposition"],
      quizFocus:
        "优先建立角色边界与协作逻辑的判断框架，而不是只记住几个常见角色名称。",
      applyPriority:
        "设计多智能体时，先定义输入输出和交接关系，再定义角色标签。",
    },
    {
      slug: "scalability-stability-and-control",
      title: "可扩展性、稳定性与可控性",
      titleEn: "Scalability, Stability, and Control",
      learningObjective:
        "理解多智能体的真正价值体现在系统级收益上，而不仅仅是任务被拆成了几段。",
      learningObjectiveEn:
        "Understand the system-level value of multi-agent design in scalability, stability, and controllability.",
      overview:
        "引入多智能体后，最值得关注的不是“角色是不是更多了”，而是系统有没有因此更容易扩展、更容易维持稳定、更容易被人类管理。只有这些收益真正出现，多智能体才算不是形式上的复杂化。",
      whyImportant:
        "很多团队把多智能体做成了一个漂亮演示，但一上真实场景就很难维护。原因往往不是角色概念错了，而是没有把扩展性、稳定性和可控性当成设计目标。",
      connection:
        "这一节是上一节分工逻辑的结果视角。前面讨论的是怎么拆角色，这里讨论的是拆完之后系统应该获得什么真实收益。",
      intuition:
        "就像把一个大工厂拆成多个生产工位，真正的价值不是工位数量增加，而是新增产品线时更容易扩容、某一环出错时不至于拖垮全线、管理者也更容易插手纠偏。",
      corePoints: [
        "可扩展性意味着任务范围扩大时，系统仍能通过增加或替换角色来保持结构清晰。",
        "稳定性意味着局部错误不会立刻拖垮全链路，系统具备更强的隔离和恢复能力。",
        "可控性意味着人类可以更清楚地设定边界、插入审核、观察过程并在必要时接管。",
      ],
      pitfalls: [
        "把多智能体的价值只理解成并行加速，而忽略治理、隔离和结构清晰度同样是关键收益。",
        "看到系统能跑通就认为已经稳定，忽略了角色之间一旦出现误解或重复执行，问题会被快速放大。",
      ],
      examples: [
        "一个内容审核系统如果把生成、事实核查和风险审查拆开，那么新增新的审查标准时，通常只需要替换其中一层，而不是重做整个流程。",
        "一个多角色研究系统即便某个执行角色短暂失误，只要审核和重试机制健全，整体仍可能维持可接受质量，这就是稳定性收益。",
      ],
      scenario:
        "评估多智能体设计时，别只问“结果更聪明了吗”，更要问“规模扩大时会不会更乱、问题出现时能不能控住、人能不能看懂它在做什么”。",
      next:
        "下一章会进入多智能体与单智能体都必须面对的底层机制：记忆、工具和推理。这些机制会决定前面说的收益能不能真正落地。",
      takeaway:
        "多智能体系统真正值得采用，是因为它有机会同时改善扩展性、稳定性和可控性。",
      terms: ["Scalability", "Stability", "Human override", "Governance"],
      quizFocus:
        "优先理解多智能体的系统级收益，而不是只盯着表面的并行效率。",
      applyPriority:
        "评估多智能体方案时，优先检查扩展、隔离和人工接管能力是否真的得到提升。",
    },
  ],
};

const aiAgentCourseV2Chapter3: ExampleChapterSeed = {
  slug: "core-mechanisms",
  title: "核心机制",
  titleEn: "Core Mechanisms",
  subchapters: [
    {
      slug: "memory-and-state-management",
      title: "记忆与状态管理",
      titleEn: "Memory and State Management",
      learningObjective:
        "理解记忆并不只是“多存一点上下文”，而是决定系统能否跨轮次持续保持一致性的核心机制。",
      learningObjectiveEn:
        "Understand memory and state management as the basis for continuity and consistency across steps and sessions.",
      overview:
        "智能体一旦进入多步任务，就不可能只靠当前一句输入来做判断。它需要知道刚刚发生了什么、过去为什么做过某个选择、哪些偏好和约束应该继续保留。记忆与状态管理，处理的正是这种“系统如何不失忆”的问题。",
      whyImportant:
        "没有记忆，智能体每一步都像重新开始；记忆设计得不好，系统又会被过时信息、错误状态或无关历史拖累。很多表面上像推理失败的问题，实质上是状态管理出了问题。",
      connection:
        "前面讲了角色和协作，这一节开始回答多步系统到底靠什么保持连续性。无论单智能体还是多智能体，只要任务有跨度，就离不开记忆设计。",
      intuition:
        "可以把记忆理解成团队的工作台和档案柜。桌面上放的是眼前正在处理的信息，档案柜里放的是以后还可能需要调用的长期知识。两者都重要，但用途完全不同。",
      corePoints: [
        "短期记忆负责维持当前任务上下文，让系统知道自己此刻正在处理什么。",
        "长期记忆负责保存可跨任务复用的经验、偏好和背景知识，但必须有检索和更新策略。",
        "状态管理的关键不是存得越多越好，而是让系统在正确时间拿到正确状态。",
      ],
      pitfalls: [
        "把记忆简单理解成无限追加历史记录，结果让系统在冗长上下文中丢失真正重要的信息。",
        "把长期记忆当成永远正确的事实仓库，忽略它也可能过时、冲突或污染当前判断。",
      ],
      examples: [
        "学习辅导智能体如果能记住用户前几节真正卡住的概念，就能在后续解释时有针对性；如果只记住表面提问，辅导会显得断裂。",
        "多智能体流程里，规划者和执行者如果共享的是过期状态，就会出现执行方向明明变了，角色却还在重复旧任务的问题。",
      ],
      scenario:
        "设计智能体记忆时，一个关键判断是：哪些信息应该短暂保留用于当前决策，哪些信息值得沉淀为长期状态，哪些信息必须被明确丢弃。",
      next:
        "理解了系统如何记住事情后，下一节会转向系统如何真正做事情，也就是工具和执行边界。",
      takeaway:
        "记忆的价值不在于存得多，而在于让系统在恰当时刻保持正确且可用的状态。",
      terms: ["Memory", "Working memory", "Long-Term Memory", "Context Window"],
      quizFocus:
        "优先理解记忆与状态管理为什么决定系统连续性，而不是把它看成简单历史拼接。",
      applyPriority:
        "分析记忆设计时，先区分当前任务状态和长期沉淀信息，再考虑如何检索与更新。",
    },
    {
      slug: "tools-and-execution-boundaries",
      title: "工具与执行边界",
      titleEn: "Tools and Execution Boundaries",
      learningObjective:
        "理解工具如何把智能体从语言能力延伸到真实执行，同时认识到执行边界决定了系统风险边界。",
      learningObjectiveEn:
        "Understand how tools extend an agent into real execution and why execution boundaries define risk boundaries.",
      overview:
        "没有工具的智能体，很多时候只能停留在解释和建议层。真正进入业务流程后，系统往往要查询数据、触发服务、写入记录或调用外部执行器。工具让智能体从“会表达”走向“会操作”，但也把系统带进更高风险的空间。",
      whyImportant:
        "一旦系统开始执行动作，错误就不再只是说错一句话，而可能变成写错数据、触发错误流程或扩大业务风险。所以工具设计从来不是附属能力，而是智能体系统最重要的边界控制点之一。",
      connection:
        "这一节对应前面能力模型中的“行动”，也是后面架构分层、权限治理和稳定性设计的直接前提。",
      intuition:
        "可以把工具想成智能体伸出去的“手”。只有大脑没有手，系统只能建议；有了手以后，系统才真的能做事，但也必须知道这双手能碰什么、不能碰什么。",
      corePoints: [
        "工具让智能体连接外部世界，把内部判断转成可执行动作或可验证结果。",
        "执行边界定义了系统的权限范围、失败后果和可恢复空间，是安全与治理设计的核心部分。",
        "工具设计不仅要考虑能不能调用，还要考虑调用前提、返回结构和失败处理。",
      ],
      pitfalls: [
        "只关注工具数量和可调用范围，忽略权限边界、参数约束和异常回退同样重要。",
        "把工具结果直接当成绝对事实使用，忽略外部系统本身也可能出错、延迟或返回不完整信息。",
      ],
      examples: [
        "日程智能体如果只能建议安排时间，它是辅助工具；如果能真正写入日历并在失败时回滚，它才具备可执行能力，同时也需要更清楚的权限设计。",
        "研究智能体调用检索工具时，若返回结果来源不清，后续推理就可能建立在不可靠证据上，因此工具输出格式本身也属于执行边界的一部分。",
      ],
      scenario:
        "在真实系统里，最常见的问题不是“工具能不能接上”，而是“接上以后出了错怎么办，谁来发现，谁来阻断，谁来恢复”。",
      next:
        "有了记忆和工具，系统还需要决定如何选择路径。下一节会讨论推理、规划和反思如何把系统从可执行变成可持续优化。",
      takeaway:
        "工具让智能体获得执行能力，而执行边界决定这份能力是可用的还是危险的。",
      terms: ["Tool", "Tool Invocation", "Permission Boundary", "Grounding"],
      quizFocus:
        "优先理解工具能力和执行边界必须一起设计，而不是只追求更多外部调用。",
      applyPriority:
        "评估工具设计时，先检查权限、返回结构和异常处理，再看调用范围。",
    },
    {
      slug: "reasoning-planning-and-reflection",
      title: "推理、规划与反思",
      titleEn: "Reasoning, Planning, and Reflection",
      learningObjective:
        "理解智能体如何从当前状态出发组织决策路径，并通过规划与反思提升任务完成质量。",
      learningObjectiveEn:
        "Understand how agents organize decisions through reasoning, planning, and reflection to improve task quality over time.",
      overview:
        "很多人把推理理解成“模型在脑子里想一想”，但在系统层面，推理更像一种把目标、约束和中间证据组织起来的决策过程。规划负责让系统不只看眼前一步，反思则负责让系统在结果不理想时知道如何回头修正。",
      whyImportant:
        "如果没有规划，系统往往只能就地反应，任务一长就容易迷路；如果没有反思，系统即便发现结果不对，也缺乏重新组织判断的能力。这会直接限制智能体在复杂任务中的上限。",
      connection:
        "这一节把前面的感知、记忆和工具串起来，真正进入“系统如何连续做出更好决策”的层面。它也是多智能体里规划者和审查者角色的基础。",
      intuition:
        "可以把推理想成眼前怎么走，规划想成整段路线怎么安排，反思想成走错之后怎么复盘并调整路线。三者放在一起，系统才更像真正会推进任务的执行者。",
      corePoints: [
        "推理负责基于当前状态形成判断路径，是决策发生的核心位置。",
        "规划负责把复杂目标拆成阶段和顺序，减少系统只顾眼前一步的短视问题。",
        "反思负责让系统在结果不佳时回看过程并调整下一轮策略，从而提升长期稳定性。",
      ],
      pitfalls: [
        "把推理能力等同于输出看起来复杂，忽略真正重要的是判断过程是否和目标、证据、约束保持一致。",
        "把反思做成形式化复述，而不是让系统真正用复盘结果修正下一步行为。",
      ],
      examples: [
        "研究智能体在写报告前先规划资料搜集、事实核查和结构整理，比边查边写更容易控制遗漏和冲突。",
        "如果一个系统在多次失败后仍重复同一错误路径，那说明它也许会“解释失败”，却并没有真正具备反思与修正能力。",
      ],
      scenario:
        "遇到长链路任务时，最值得观察的是系统会不会主动拆任务、会不会在中间检查方向、会不会根据失败信号改变策略，而不是只看最终答案是不是偶尔答对。",
      next:
        "下一章我们会把目光放到多角色之间的信息交换上，看看这些内部机制如何在通信和架构层真正组合成完整系统。",
      takeaway:
        "推理决定当前怎么判断，规划决定整体怎么推进，反思决定系统能否在错误后变得更稳。",
      terms: ["Reasoning", "Planning", "Reflection", "Task decomposition"],
      quizFocus:
        "优先理解推理、规划和反思在时间尺度上的分工，而不是把它们都混成“思考”。",
      applyPriority:
        "评估决策链路时，先看系统是否既能组织当前判断，又能规划全局并根据反馈修正。",
    },
  ],
};

const aiAgentCourseV2Chapter4: ExampleChapterSeed = {
  slug: "communication-and-architecture",
  title: "通信与系统架构",
  titleEn: "Communication and Architecture",
  subchapters: [
    {
      slug: "communication-and-shared-state",
      title: "通信机制与共享状态",
      titleEn: "Communication and Shared State",
      learningObjective:
        "理解显式消息传递与共享状态两种典型通信方式的取舍，并能判断它们各自适合什么系统结构。",
      learningObjectiveEn:
        "Understand the tradeoffs between message passing and shared state in multi-agent communication.",
      overview:
        "多智能体真正难的部分，不只是角色分工，而是角色之间怎么交换信息。有人偏好显式消息传递，因为边界清楚；有人偏好共享状态，因为协作更方便。两种方式都能工作，但它们塑造出的系统行为完全不同。",
      whyImportant:
        "通信机制决定了信息流的透明度、延迟、耦合度和排错方式。如果这一层设计不清楚，多智能体就会变成“大家都在做事，但没人知道彼此到底依据什么在做”。",
      connection:
        "这一节把前面的角色协作真正落地到信息层。角色再合理，如果通信设计混乱，协作质量仍然会迅速下降。",
      intuition:
        "消息传递像发正式邮件，边界清楚、记录完整；共享状态像大家共用一块白板，协作很快，但也更容易互相覆盖和误解。",
      corePoints: [
        "消息传递强调显式交接，适合边界明确、责任清晰的协作链路。",
        "共享状态强调信息共用，适合需要多个角色持续读取同一任务状态的场景。",
        "通信方式的选择本质上是在权衡透明度、耦合度、同步成本和调试难度。",
      ],
      pitfalls: [
        "只因为共享状态方便，就忽略并发写入、状态污染和责任归属模糊带来的问题。",
        "只因为消息传递边界清晰，就把系统拆得过细，导致通信开销超过了协作收益。",
      ],
      examples: [
        "在研究系统里，规划者把任务明确发送给执行者，再由执行者回传结果，这种消息传递更利于审计与复盘。",
        "在一个共同维护任务进度的多角色工作台里，所有角色都读取统一状态能减少重复同步，但前提是更新规则非常清晰。",
      ],
      scenario:
        "真实系统设计时，通信方式没有绝对答案，关键是看你更需要可追踪的责任链，还是更灵活的共享视图，以及能否承受相应代价。",
      next:
        "理解通信基础后，下一节会进一步进入协作协议与运行模式，看看角色之间怎样约定交互规则。",
      takeaway:
        "通信设计决定多智能体的信息流形态，而信息流形态会直接塑造系统的可追踪性与耦合程度。",
      terms: ["Message passing", "Shared state", "Blackboard", "Information flow"],
      quizFocus:
        "优先理解不同通信机制背后的系统权衡，而不是把它们当成简单实现细节。",
      applyPriority:
        "选通信机制时，先判断系统更需要责任清晰还是状态共享，再做结构选择。",
    },
    {
      slug: "coordination-protocols-and-collaboration-patterns",
      title: "协作协议与运行模式",
      titleEn: "Coordination Protocols and Collaboration Patterns",
      learningObjective:
        "理解协作协议如何规定角色交互规则，以及常见模式为什么会改变系统吞吐、稳定性与调试方式。",
      learningObjectiveEn:
        "Understand how coordination protocols and collaboration patterns shape throughput, stability, and debugging.",
      overview:
        "角色之间不仅要会沟通，还要知道什么时候交接、交接后谁负责、遇到异常怎么升级。协作协议处理的是“规则”，运行模式处理的是“结构”。它们决定了系统不是一群角色凑在一起，而是一套可重复运行的组织机制。",
      whyImportant:
        "如果没有明确协议，角色会在等待、重复、冲突或漏接中不断消耗系统资源。看似只是流程不顺，实际会直接影响结果质量和系统稳定性。",
      connection:
        "这一节建立在前面的角色分工和通信机制之上，把“谁与谁说话”推进到“他们按照什么规则协作、形成什么模式”。",
      intuition:
        "这有点像球队战术。不是知道谁是前锋、谁是后卫就够了，还要知道谁先发起、谁补位、失误后如何回收阵型，不然整支队伍就会散。",
      corePoints: [
        "协作协议规定交接条件、异常升级、重试方式和角色责任，是系统秩序的来源。",
        "常见运行模式如流水线、树状拆解和循环闭环，会在效率、灵活性和稳定性之间形成不同取舍。",
        "模式选择不是审美问题，而是要看任务结构、错误代价和并行需求是否匹配。",
      ],
      pitfalls: [
        "直接套用常见模式名称，却没有把交接条件和退出条件写清楚，结果模式只停留在概念层。",
        "为了追求复杂协作而忽略任务本身结构，导致系统协议越来越多，实际收益却很有限。",
      ],
      examples: [
        "流水线模式适合步骤清晰的流程，例如检索、整理、审核、输出依次推进；如果任务本身需要不断回查，单向流水线就会显得僵硬。",
        "循环闭环模式适合需要持续修正的任务，但如果停止条件不明确，系统就容易陷入无效重复。",
      ],
      scenario:
        "评估一个协作方案时，最值得追问的是：角色怎样进入流程、怎样交棒、怎样退出、怎样处理异常。只要这四件事不清楚，系统就很难稳定运行。",
      next:
        "最后一节会把通信和协作继续往上提升到系统架构层，看这些模式最终如何落到分层与模型路由设计上。",
      takeaway:
        "多智能体的运行质量，很大程度上取决于交互协议是否清晰，以及协作模式是否和任务结构匹配。",
      terms: ["Protocol", "Handoff", "Pipeline", "Loop"],
      quizFocus:
        "优先理解协议和运行模式对系统行为的塑造作用，而不是只记住模式名称。",
      applyPriority:
        "设计协作流程时，先定义交接、重试、退出和异常升级规则，再谈模式选择。",
    },
    {
      slug: "layered-architecture-and-model-routing",
      title: "架构分层与模型路由",
      titleEn: "Layered Architecture and Model Routing",
      learningObjective:
        "理解智能体系统为什么需要分层架构，以及模型路由如何在能力、成本和延迟之间做系统级平衡。",
      learningObjectiveEn:
        "Understand layered architecture and model routing as tools for balancing capability, cost, and latency.",
      overview:
        "当系统开始变复杂，光有角色和协议已经不够，还需要更稳定的工程骨架。分层架构会把智能体层、工具层、数据层等职责拆开，模型路由则进一步决定什么任务该交给强模型，什么任务适合低成本模型。",
      whyImportant:
        "如果不做分层，系统很快会把角色逻辑、工具调用和数据处理搅在一起，变成难以替换、难以调试的耦合体。模型路由如果没有设计清楚，则很容易不是成本失控，就是关键任务能力不够。",
      connection:
        "这一节把前面所有协作与通信机制提升到工程实现视角，开始回答一个系统怎样才能在变大之后仍然可维护、可替换、可扩展。",
      intuition:
        "可以把分层架构想成建筑的承重结构，外观看起来也许不显眼，但它决定了房子能不能加层、能不能维修、能不能局部替换而不整体坍塌。",
      corePoints: [
        "分层架构的核心价值是分离职责，让智能体逻辑、工具能力和数据状态各自保持相对稳定接口。",
        "模型路由的核心不是节省一点调用费用，而是在不同任务复杂度下合理分配强模型与低成本模型。",
        "好的架构会让扩容、调试和替换都更容易，而不是让每次变更都牵一发动全身。",
      ],
      pitfalls: [
        "把所有逻辑都塞进智能体提示或单个角色内部，导致架构表面灵活、实际高度耦合。",
        "只按价格选模型，忽略任务难度、失败代价和响应要求，结果要么过度节省，要么成本失控。",
      ],
      examples: [
        "一个多智能体研究平台如果把检索、评分和内容生成都硬编码进同一层，后续替换检索策略时就会非常痛苦；分层后可以局部替换。",
        "让强模型负责规划与审核，让低成本模型负责格式整理和简单分类，通常比全链路都用同一个模型更平衡。",
      ],
      scenario:
        "当你开始考虑系统上线和长期维护时，真正重要的问题不再是“能不能跑”，而是“以后换模型、换工具、换流程时，代价会不会过高”。",
      next:
        "最后一章会讨论系统进入长期运行后最关键的事：如何保持稳定、如何调试、如何评估，以及未来可能如何演进。",
      takeaway:
        "分层架构保证系统有清晰骨架，模型路由保证系统在能力、成本和延迟之间做出理性的结构性选择。",
      terms: ["Layered architecture", "Tool layer", "Data layer", "Model routing"],
      quizFocus:
        "优先理解分层与模型路由为什么属于系统设计问题，而不是零散优化技巧。",
      applyPriority:
        "分析复杂系统时，先看职责是否分层、模型是否按任务路由，再判断它是否具备长期可维护性。",
    },
  ],
};

const aiAgentCourseV2Chapter5: ExampleChapterSeed = {
  slug: "reliability-and-evolution",
  title: "稳定性与系统演进",
  titleEn: "Reliability and Evolution",
  subchapters: [
    {
      slug: "failure-modes-and-stability-design",
      title: "失败模式与稳定性设计",
      titleEn: "Failure Modes and Stability Design",
      learningObjective:
        "理解多智能体系统常见失败模式，并能从结构角度思考稳定性设计，而不是事后补救。",
      learningObjectiveEn:
        "Understand common failure modes and think about stability as a structural design problem rather than a late patch.",
      overview:
        "系统一旦进入真实环境，最值得警惕的不是偶尔答错，而是那些会重复出现、不断放大甚至跨角色传播的失败模式。稳定性设计讨论的，就是怎样在问题出现之前就把系统做得更不容易失控。",
      whyImportant:
        "很多团队在演示阶段只看成功样例，忽略失败路径。可真正决定系统能不能长期上线的，往往不是最好的一次表现，而是最差的时候会坏到什么程度、坏了之后还能不能收回来。",
      connection:
        "这一节是前面所有内容的压力测试视角。你前面学的能力、工具、通信和架构，最终都要接受稳定性这一关的检验。",
      intuition:
        "可以把稳定性想成桥梁设计。桥不是只要在天气好、人少的时候能通行就够了，而是要在风大、载重变化甚至局部受损时仍然不至于整体垮掉。",
      corePoints: [
        "常见失败模式包括事实偏离、循环失控、角色误解、错误传播和状态污染等，它们往往不是孤立出现。",
        "稳定性设计强调限制错误扩散、保留人工接管、设置停止条件和建立恢复路径。",
        "真正成熟的系统会预先思考失败会怎样发生，而不是等错误发生后再临时补洞。",
      ],
      pitfalls: [
        "把稳定性理解成“把准确率继续做高一点”，忽略系统在异常情况下的失控方式和恢复能力更关键。",
        "认为只要单个角色表现足够好，整体系统自然会稳定，忽略协作链路里的放大效应。",
      ],
      examples: [
        "一个角色给出错误中间结论，后续多个角色都把它当事实继续展开，这种错误传播往往比单点错误更危险。",
        "一个循环评审系统如果没有明确停止条件，可能在小问题上反复重写，既浪费成本，也让系统进入不稳定状态。",
      ],
      scenario:
        "在设计复杂流程时，最值得提前推演的是：如果某个角色错了、某个工具挂了、某段状态污染了，系统会停住、会误导、还是会把错误继续放大。",
      next:
        "理解了失败模式之后，下一节会进入更实际的问题：当系统真的出问题时，如何通过日志、追踪和回放把它找出来。",
      takeaway:
        "稳定性不是结果偶尔好看，而是系统在失败出现时仍能被限制、解释和恢复。",
      terms: ["Stability", "Error propagation", "Recovery", "Human override"],
      quizFocus:
        "优先理解稳定性设计为什么要从失败路径出发，而不是只盯着成功样例。",
      applyPriority:
        "评估稳定性时，先看错误如何被限制和恢复，再看平稳情况下的平均表现。",
    },
    {
      slug: "debugging-tracing-and-evaluation",
      title: "调试、追踪与评估",
      titleEn: "Debugging, Tracing, and Evaluation",
      learningObjective:
        "理解多智能体系统为什么必须可观察、可回放、可评估，以及这些能力如何支撑持续改进。",
      learningObjectiveEn:
        "Understand observability, replay, and evaluation as the foundation for debugging and continuous improvement.",
      overview:
        "一个看起来很聪明、但出了问题之后没人知道它怎么想的系统，工程上几乎不可用。调试、追踪与评估解决的，就是把复杂系统从“黑盒表演”变成“可分析、可复现、可优化”的工程对象。",
      whyImportant:
        "多智能体比单一流程更难排错，因为问题可能来自角色、协议、工具、状态或模型路由中的任何一层。没有日志和追踪，你只会看到坏结果；有了这些机制，才有可能把问题落到具体环节。",
      connection:
        "这一节承接前面的稳定性设计，把“如何避免问题”进一步推进到“问题出现后如何看清并系统性改进”。",
      intuition:
        "这就像飞机事故调查。最终目标不是简单找一个替罪羊，而是还原整个过程，知道哪一步先偏、为什么没被发现、以后该怎样避免重演。",
      corePoints: [
        "日志记录负责保留关键事件和输入输出，是最基础的可观察性来源。",
        "链路追踪负责把一次任务中的关键决策串起来，让你能看到错误是如何传递的。",
        "评估把系统表现从印象判断变成结构化判断，帮助团队持续比较方案优劣。",
      ],
      pitfalls: [
        "只记录最终答案，不记录中间状态和角色交接，导致出了问题以后只能猜测。",
        "把评估理解成一次性的分数排名，忽略过程评估和场景覆盖对系统改进同样重要。",
      ],
      examples: [
        "如果一个多角色流程最后输出错误，但日志里没有保留每个角色看到的上下文和工具返回值，你几乎无法判断问题到底从哪里开始。",
        "同样一个系统，在演示样例上看起来表现很好，但经过系统化评估后，可能会暴露出在长任务、异常输入或边界场景下明显不稳。",
      ],
      scenario:
        "真正成熟的智能体工程，不是每次出错都靠人工猜原因，而是能够通过日志、追踪、回放和评估，把问题快速定位、复现并形成改进闭环。",
      next:
        "课程最后一节会把视角拉长，看智能体系统未来可能如何从工具能力继续演进为一种新的软件组织方式。",
      takeaway:
        "能被持续改进的智能体系统，前提是它足够可观察、可复现，也足够可评估。",
      terms: ["Logging", "Tracing", "Replay", "Outcome evaluation"],
      quizFocus:
        "优先理解调试、追踪和评估为什么属于系统能力，而不是上线后的附加工作。",
      applyPriority:
        "分析问题定位能力时，先看系统是否保留了可观察链路，再看评估机制是否覆盖关键场景。",
    },
    {
      slug: "future-of-agent-native-software",
      title: "智能体原生软件的未来",
      titleEn: "The Future of Agent-Native Software",
      learningObjective:
        "理解智能体系统未来可能带来的软件形态变化，并建立对人机协作与系统治理的长期视角。",
      learningObjectiveEn:
        "Understand the future direction of agent-native software and the long-term role of governance and human collaboration.",
      overview:
        "当智能体不再只是某个页面里的附属功能，而开始成为系统里的核心执行单元，软件的组织方式本身也会变化。未来的很多产品，可能不再主要围绕页面和按钮组织，而是围绕角色、目标、任务流和协作过程来组织。",
      whyImportant:
        "这并不是一个遥远的概念问题。今天你如何理解角色、协议、分层、治理和人工接管，决定了你能否看懂下一代产品为何会长成那个样子，也决定了你是否能设计出真正可持续的系统。",
      connection:
        "这一节把前面所有内容重新汇总起来，从概念、机制、协作、架构和稳定性一路回看，形成对智能体系统的整体视角。",
      intuition:
        "传统软件更像功能菜单，用户自己一步步点选；智能体原生软件更像一个会协作的组织，用户提出目标后，多个角色围绕任务共同推进结果。",
      corePoints: [
        "智能体原生软件的核心变化，不只是模型更强，而是软件组织单位从静态页面逐步转向角色与任务流。",
        "未来系统竞争力会越来越多地体现在协作结构、治理能力、可观察性和人机分工上。",
        "人类不会退出系统，而是会更多承担目标设定、边界管理、价值判断和高风险审批等关键职责。",
      ],
      pitfalls: [
        "把未来趋势简单理解成“系统会越来越自动”，忽略治理、责任分配和人工审查会同时变得更重要。",
        "认为智能体原生软件等于把所有逻辑都交给模型，忽略工程结构和组织设计依旧是核心。",
      ],
      examples: [
        "未来的学习平台可能不是单纯展示课程，而是由规划、辅导、测评和反馈角色共同组织学习过程，这就是软件组织方式的变化。",
        "未来企业工具也可能不再只是表单系统，而是由多个角色围绕目标推进任务、检索证据、完成审核和升级处理。",
      ],
      scenario:
        "当你观察一个新产品时，如果它开始把角色协作、任务推进和人工接管设计成核心，而不是只把智能体作为聊天入口，那它已经在向智能体原生软件靠近。",
      next:
        "到这里，这门课已经完成。接下来更重要的不是再记更多术语，而是带着这条主线去观察真实系统：它的角色如何组织，它的边界如何治理，它的未来如何演进。",
      takeaway:
        "智能体原生软件的未来，本质上是软件组织方式的变化，而不是单一模型能力的简单增强。",
      terms: ["Agent-native software", "Human-AI collaboration", "Governance", "System evolution"],
      quizFocus:
        "优先把未来趋势理解为软件结构与治理方式的变化，而不是抽象的能力想象。",
      applyPriority:
        "判断系统演进方向时，先看它如何组织角色与治理边界，再看它是否只是换了更强模型。",
    },
  ],
};

const aiAgentCourseV2Seed: ExampleCourseSeed = {
  slug: "ai-agent-development",
  title: "智能体系统",
  titleEn: "AI Agent Systems",
  topic: "智能体与多智能体系统设计",
  topicEn: "AI Agent and Multi-Agent System Design",
  description:
    "这门官方示例课从系统视角讲解智能体与多智能体系统，重点覆盖角色定义、协作逻辑、记忆与工具、通信架构、稳定性与未来演进。",
  descriptionEn:
    "This official sample course introduces AI agent systems from a systems perspective, covering roles, collaboration, memory, tools, communication, architecture, reliability, and future evolution.",
  goals: [
    "理解智能体作为系统角色的本质，而不是把它看成一次性模型调用",
    "理解多智能体协作、底层机制与工程架构之间的关系",
    "建立关于稳定性、调试、评估与长期演进的整体视角",
  ],
  goalsEn: [
    "Understand agents as system roles rather than one-shot model calls",
    "Connect collaboration logic with core mechanisms and engineering architecture",
    "Build an integrated view of reliability, debugging, evaluation, and long-term evolution",
  ],
  chapters: [
    aiAgentCourseV2Chapter1,
    aiAgentCourseV2Chapter2,
    aiAgentCourseV2Chapter3,
    aiAgentCourseV2Chapter4,
    aiAgentCourseV2Chapter5,
  ],
};

const aiAgentLegacyLessonRedirects: Record<
  string,
  { chapterSlug: string; subchapterSlug: string }
> = {
  "nature-capabilities-system-role/what-is-an-ai-agent": {
    chapterSlug: "foundations-of-ai-agents",
    subchapterSlug: "what-makes-an-ai-agent",
  },
  "nature-capabilities-system-role/perception-reasoning-action": {
    chapterSlug: "foundations-of-ai-agents",
    subchapterSlug: "perception-reasoning-and-action",
  },
  "nature-capabilities-system-role/minimal-agent-architecture": {
    chapterSlug: "foundations-of-ai-agents",
    subchapterSlug: "minimal-architecture-and-system-role",
  },
  "nature-capabilities-system-role/agent-as-component": {
    chapterSlug: "foundations-of-ai-agents",
    subchapterSlug: "minimal-architecture-and-system-role",
  },
  "multi-agent-design-and-collaboration-logic/limitations-of-single-agent-systems":
    {
      chapterSlug: "multi-agent-collaboration",
      subchapterSlug: "why-multi-agent-systems",
    },
  "multi-agent-design-and-collaboration-logic/division-of-labor-and-collaboration-principles":
    {
      chapterSlug: "multi-agent-collaboration",
      subchapterSlug: "roles-and-collaboration-logic",
    },
  "multi-agent-design-and-collaboration-logic/planner-worker-critic": {
    chapterSlug: "multi-agent-collaboration",
    subchapterSlug: "roles-and-collaboration-logic",
  },
  "multi-agent-design-and-collaboration-logic/value-scalability-stability-controllability":
    {
      chapterSlug: "multi-agent-collaboration",
      subchapterSlug: "scalability-stability-and-control",
    },
  "core-mechanisms-memory-tools-and-reasoning/memory-design-short-term-vs-long-term":
    {
      chapterSlug: "core-mechanisms",
      subchapterSlug: "memory-and-state-management",
    },
  "core-mechanisms-memory-tools-and-reasoning/tools-and-execution-capabilities":
    {
      chapterSlug: "core-mechanisms",
      subchapterSlug: "tools-and-execution-boundaries",
    },
  "core-mechanisms-memory-tools-and-reasoning/reasoning-chain-of-thought-and-react":
    {
      chapterSlug: "core-mechanisms",
      subchapterSlug: "reasoning-planning-and-reflection",
    },
  "core-mechanisms-memory-tools-and-reasoning/planning-and-reflection": {
    chapterSlug: "core-mechanisms",
    subchapterSlug: "reasoning-planning-and-reflection",
  },
  "communication-and-collaboration-patterns-in-multi-agent-systems/message-passing-vs-shared-state":
    {
      chapterSlug: "communication-and-architecture",
      subchapterSlug: "communication-and-shared-state",
    },
  "communication-and-collaboration-patterns-in-multi-agent-systems/coordination-protocols-and-role-based-interaction":
    {
      chapterSlug: "communication-and-architecture",
      subchapterSlug: "coordination-protocols-and-collaboration-patterns",
    },
  "communication-and-collaboration-patterns-in-multi-agent-systems/pipeline-tree-loop":
    {
      chapterSlug: "communication-and-architecture",
      subchapterSlug: "coordination-protocols-and-collaboration-patterns",
    },
  "communication-and-collaboration-patterns-in-multi-agent-systems/sync-vs-async-execution":
    {
      chapterSlug: "communication-and-architecture",
      subchapterSlug: "coordination-protocols-and-collaboration-patterns",
    },
  "system-architecture-model-selection-and-optimization/layered-architecture-agent-tool-data":
    {
      chapterSlug: "communication-and-architecture",
      subchapterSlug: "layered-architecture-and-model-routing",
    },
  "system-architecture-model-selection-and-optimization/modular-and-scalable-design":
    {
      chapterSlug: "communication-and-architecture",
      subchapterSlug: "layered-architecture-and-model-routing",
    },
  "system-architecture-model-selection-and-optimization/model-selection-strong-vs-cheap-models":
    {
      chapterSlug: "communication-and-architecture",
      subchapterSlug: "layered-architecture-and-model-routing",
    },
  "system-architecture-model-selection-and-optimization/cost-and-performance-optimization":
    {
      chapterSlug: "communication-and-architecture",
      subchapterSlug: "layered-architecture-and-model-routing",
    },
  "stability-debugging-evaluation-and-future-trends/failure-modes-hallucination-loops-error-propagation":
    {
      chapterSlug: "reliability-and-evolution",
      subchapterSlug: "failure-modes-and-stability-design",
    },
  "stability-debugging-evaluation-and-future-trends/debugging-logging-tracing-replay":
    {
      chapterSlug: "reliability-and-evolution",
      subchapterSlug: "debugging-tracing-and-evaluation",
    },
  "stability-debugging-evaluation-and-future-trends/evaluation-methods": {
    chapterSlug: "reliability-and-evolution",
    subchapterSlug: "debugging-tracing-and-evaluation",
  },
  "stability-debugging-evaluation-and-future-trends/future-agent-native-software-systems":
    {
      chapterSlug: "reliability-and-evolution",
      subchapterSlug: "future-of-agent-native-software",
    },
};

const llmCourseV2Chapter1: ExampleChapterSeed = {
  slug: "foundations-of-language-modeling",
  title: "语言建模基础",
  titleEn: "Foundations of Language Modeling",
  subchapters: [
    {
      slug: "what-an-llm-really-is",
      title: "什么是大语言模型",
      titleEn: "What an LLM Really Is",
      learningObjective:
        "理解大语言模型首先是一种语言建模系统，而不是一个天生拥有完整世界知识的智能实体。",
      learningObjectiveEn:
        "Understand an LLM first as a language modeling system rather than a naturally self-contained intelligence.",
      overview:
        "很多人第一次接触大语言模型时，会直接把它理解成“会说话的人工智能”。这种理解并不完全错，但太快跳到了表层体验。更扎实的起点，是先把它看成一个在大规模文本模式中学习统计关系、再把这种关系体现在生成过程里的系统。",
      whyImportant:
        "如果一开始就把大语言模型理解成一个完整的“懂世界”的实体，后面你会很容易误读它的能力边界。很多看起来像推理、像知识、像理解的现象，其实都和语言建模机制本身密切相关。",
      connection:
        "这一节是整门课的入口。后面无论是词元、训练阶段、上下文窗口，还是检索增强和系统评估，本质上都在扩展同一个问题：这个模型到底靠什么工作。",
      intuition:
        "可以把大语言模型想成一个极其擅长顺着上下文往下写的人。它不是先拥有一本完整百科全书，再从中抽取答案；它更像是在不断预测“在这里，接下来最合理的表达会是什么”。",
      corePoints: [
        "大语言模型的底层身份是语言建模系统，它的核心任务是根据已有上下文预测更合理的后续表达。",
        "模型表现出来的知识感、解释力和任务适应性，很多都来自语言模式学习的副产物，而不是独立模块式的能力堆叠。",
        "理解大语言模型，首先要从它的生成机制出发，而不是只从用户看到的回答效果出发。",
      ],
      pitfalls: [
        "把大语言模型直接等同于“数字专家”或“内置百科全书”，忽略它的输出本质上仍然是条件生成结果。",
        "只看回答是否像人，而不追问回答背后依赖的机制与边界条件。",
      ],
      examples: [
        "模型在解释一个概念时可能显得非常自然，这会让人误以为它像老师一样先“理解”了概念再表达；但更准确的说法是，它在大规模语料中学会了哪些解释方式通常会一起出现。",
        "当模型给出一个看似完整的答案时，用户往往感觉它在“回忆知识”；实际上，很多时候它是在当前上下文下生成最有可能成立的延续。",
      ],
      scenario:
        "当你评估一个问答、写作或企业知识助手时，先把它看成语言建模系统，会更容易分辨哪些现象来自参数知识，哪些来自上下文组织，哪些来自外部系统补充。",
      next:
        "接下来会进一步拆开这个系统最底层的计算入口，也就是词元、表示方式和预测目标。只有这层理解扎实，后面的训练与应用才不会漂。",
      takeaway:
        "大语言模型首先是一个根据上下文持续生成语言的建模系统，然后才是一个被包装成产品能力的应用组件。",
      terms: ["Token", "Embedding", "上下文", "下一个词预测"],
      quizFocus:
        "优先理解大语言模型的语言建模本质，而不是直接把它当成现成的通用智能。",
      applyPriority:
        "分析模型表现时，先问它是依赖语言模式生成、上下文提示，还是外部信息增强，而不是直接把效果当成真实理解。",
    },
    {
      slug: "tokens-representations-and-prediction-objective",
      title: "词元、表示与预测目标",
      titleEn: "Tokens, Representations, and Prediction Objective",
      learningObjective:
        "掌握词元化、向量表示和预测目标如何共同构成大语言模型最小但完整的工作原理。",
      learningObjectiveEn:
        "Understand how tokenization, representation, and prediction objectives form the minimal working principle of LLMs.",
      overview:
        "这一节会把“模型到底在处理什么”拆开来看。文本对人来说是句子和语义，对模型来说却要先被切成可计算的单位，再映射成向量，最后才进入预测过程。看懂这条链路，很多后续现象都会一下子变得更清楚。",
      whyImportant:
        "一旦忽略这层基础，就很容易误判成本、上下文长度和模型行为。例如，为什么有些输入看起来不长却花费很多 token，为什么模型会对某些表述特别敏感，为什么不同语言的处理代价并不对称。",
      connection:
        "这一节把上一节的抽象描述落到了可计算结构上，是训练阶段、上下文限制和工程成本分析的共同前提。",
      intuition:
        "可以把词元想成模型阅读文本时真正看到的“积木块”，把向量表示想成这些积木块进入模型后的内部坐标，而预测目标则像告诉模型“下一个积木最可能接在哪儿”。",
      corePoints: [
        "词元化决定了文本如何被切分成模型可处理的单位，这会直接影响长度、成本和表达细节。",
        "向量表示让模型能够在连续空间中学习相似性、搭配关系和上下文依赖，而不是只处理离散符号。",
        "下一个词预测虽然目标形式简单，却足以在大规模数据下逼出丰富的语言结构能力。",
      ],
      pitfalls: [
        "把词元直接理解成自然语言里的单词或汉字，忽略分词策略和编码方式会显著改变真实计算单位。",
        "把预测目标看成机械补全，忽略它在规模足够大时会内化出模式压缩和结构组织能力。",
      ],
      examples: [
        "同样是一段看起来差不多长的输入，不同表达方式可能对应完全不同的 token 数，这就是为什么提示词改写会影响成本和模型注意力分布。",
        "模型在续写一句话时，并不是逐字查字典，而是在向量空间里利用上下文关系判断什么样的延续最可能出现。",
      ],
      scenario:
        "做提示词优化、成本评估或上下文压缩时，最有效的判断往往来自这一层。你越清楚模型真实看到的输入形态，就越容易做出有针对性的系统设计。",
      next:
        "下一节会从这条最小原理继续往上走，讨论为什么数据规模、训练规模和能力表现之间会出现明显的非线性关系。",
      takeaway:
        "词元、表示和预测目标共同定义了大语言模型的最小工作链路，很多高层能力都建立在这条链路之上。",
      terms: ["Token", "Embedding", "下一个词预测", "上下文窗口"],
      quizFocus:
        "优先理解模型真正处理的输入形式和预测目标，而不是只从人类语言直觉出发看模型。",
      applyPriority:
        "分析提示、成本和长度限制时，先看词元切分和预测路径，而不是只看表面字数。",
    },
    {
      slug: "scale-data-and-emergent-capability",
      title: "规模、数据与能力涌现",
      titleEn: "Scale, Data, and Emergent Capability",
      learningObjective:
        "理解为什么大语言模型的很多能力提升来自规模、数据质量和训练分布共同作用，而不是单一技巧突然生效。",
      learningObjectiveEn:
        "Understand how scale, data quality, and training distribution interact to produce stronger apparent capabilities.",
      overview:
        "很多人会问：为什么模型大到某个程度以后，突然像是会总结、会翻译、会推理了？这一节讨论的就是这种“看起来像突然冒出来”的能力到底从哪里来，以及我们为什么不能简单把它理解成某个开关被打开。",
      whyImportant:
        "如果把能力提升想得过于神秘，就会误判模型迭代的真实杠杆。实际工作里，参数规模、训练数据、分布覆盖、目标设计和推理时的系统配置通常是一起作用的。",
      connection:
        "前两节解释了模型的底层机制，这一节则解释为什么同样的机制在不同规模下会表现出完全不同的能力强度。",
      intuition:
        "可以把它想成阅读能力的成长。一个人读几十篇文章和读几百万篇文章，底层认字机制没变，但能够抓到的模式、风格和关系会发生质变。",
      corePoints: [
        "模型规模扩大并不只是记忆容量增加，还会改变模式表示能力和泛化方式。",
        "数据质量、覆盖范围和训练分布会深刻影响模型最终看起来“会什么、不会什么”。",
        "所谓能力涌现，很多时候是多个因素共同跨过某个可观察阈值后的表现，而不是单一机制凭空出现。",
      ],
      pitfalls: [
        "把能力增强完全归因于参数变大，忽略数据、训练目标和系统设置同样可能是决定性因素。",
        "看到模型突然在某类任务上表现更好，就误以为这种能力已经在所有邻近任务上都稳定成立。",
      ],
      examples: [
        "一个更大的模型可能在摘要上明显更稳，但如果训练数据里相关文体覆盖不足，它在专业报告总结上仍然可能失真。",
        "同样的基础模型，在不同提示方式和外部信息组织下表现差异很大，这说明“能力看起来出现了”并不只是模型参数单独决定的。",
      ],
      scenario:
        "做模型选型时，理解规模与数据的共同作用，可以帮助你区分什么时候该换更强模型，什么时候该补数据、改任务表达，或者引入外部检索。",
      next:
        "接下来课程会进入训练阶段本身，系统拆开预训练、指令微调和对齐各自到底在塑造什么行为。",
      takeaway:
        "大语言模型能力的提升通常来自规模、数据和系统条件共同跨过阈值后的结果，而不是一个孤立技巧突然奏效。",
      terms: ["预训练", "Token", "上下文", "离线评测"],
      quizFocus:
        "优先把能力增强理解为多因素共同作用的结果，而不是神秘化的单点突破。",
      applyPriority:
        "判断模型为什么变强时，先同时检查规模、数据分布和系统设置，而不是只盯着参数量。",
    },
  ],
};

const llmCourseV2Chapter2: ExampleChapterSeed = {
  slug: "training-and-alignment",
  title: "训练与对齐",
  titleEn: "Training and Alignment",
  subchapters: [
    {
      slug: "pretraining-and-base-capability",
      title: "预训练如何塑造基础能力",
      titleEn: "How Pretraining Shapes Base Capability",
      learningObjective:
        "理解预训练阶段真正为模型带来了什么，以及它为什么决定了模型的基础语言能力上限。",
      learningObjectiveEn:
        "Understand what pretraining really contributes and why it determines the base capability ceiling of an LLM.",
      overview:
        "预训练是大语言模型能力形成的底座。很多后来让人惊叹的表现，其实都离不开这个阶段打下的模式感知、知识压缩和上下文延续能力。理解这一层，能帮你更冷静地看待模型“懂很多”的表象。",
      whyImportant:
        "如果把所有能力都归到指令微调或提示词上，就会低估预训练对模型世界知识覆盖、表达流畅性和基础泛化能力的决定性作用。",
      connection:
        "这一节承接前面的词元和预测目标，把“模型怎么学会基本能力”讲具体。后面的指令微调和对齐，本质上都是在这个底座上继续塑形。",
      intuition:
        "可以把预训练想成长期沉浸式阅读。它不一定直接教你如何回答某道题，但会让你对语言结构、常见搭配和知识模式变得非常熟悉。",
      corePoints: [
        "预训练主要负责建立通用语言模式感知和大范围知识压缩能力。",
        "模型在预训练阶段并不是在学“固定答案库”，而是在学大量上下文条件下什么样的延续通常成立。",
        "后续很多能力增强都建立在预训练底座是否足够扎实之上。",
      ],
      pitfalls: [
        "把预训练简单理解成“背资料”，忽略它更重要的是统计结构学习和分布压缩。",
        "遇到基础能力缺口时，误以为只靠提示词或少量指令微调就能完全弥补。",
      ],
      examples: [
        "模型之所以能自然续写多种文体，不是因为有人为每种文体单独写了规则，而是因为预训练阶段见过大量类似结构。",
        "一个基础模型如果预训练覆盖不足，即使后面做了很好的指令微调，也可能在专业知识和长文本理解上依然薄弱。",
      ],
      scenario:
        "当你评估一个基础模型是否值得继续做领域增强时，首先要判断它的预训练底座是否已经具备足够的语言能力和知识覆盖。",
      next:
        "有了基础能力后，下一节会讨论模型是如何从“会续写”进一步变成“会配合任务和用户要求”的。",
      takeaway:
        "预训练决定了模型基础能力的地基，很多看起来高层的表现都离不开这层长期积累。",
      terms: ["预训练", "Token", "Embedding", "下一个词预测"],
      quizFocus:
        "优先理解预训练在塑造基础能力中的作用，而不是把它看成简单知识灌输。",
      applyPriority:
        "判断基础模型是否够用时，先看预训练底座能否支撑任务所需的语言和知识范围。",
    },
    {
      slug: "instruction-tuning-and-preference-optimization",
      title: "指令微调与偏好优化",
      titleEn: "Instruction Tuning and Preference Optimization",
      learningObjective:
        "理解指令微调和偏好优化如何把基础模型塑造成更会配合任务、更贴近用户预期的助手。",
      learningObjectiveEn:
        "Understand how instruction tuning and preference optimization shape a base model into a more cooperative assistant.",
      overview:
        "一个基础模型可能很会续写，但不一定会稳定遵循任务要求。指令微调和偏好优化的作用，就是让模型更懂“别人想让我怎么回答”，以及什么样的回答更容易被认为是有帮助、清晰和可接受的。",
      whyImportant:
        "很多人会把“更像助手”的表现误认为纯粹来自模型更强，其实这往往是训练目标已经从语言延续进一步转向任务配合和偏好匹配的结果。",
      connection:
        "这一节紧接预训练，回答为什么同样是大模型，有的更像续写器，有的更像对话助手。",
      intuition:
        "可以把它想成从“会写文章的人”变成“会按要求交作业的人”。前者有表达能力，后者还学会了遵守任务格式和接受评价标准。",
      corePoints: [
        "指令微调让模型更稳定地理解任务形式、输出结构和用户要求。",
        "偏好优化进一步塑造模型的回答风格、帮助性和可接受性，使其更贴近人类使用场景。",
        "这两个阶段主要调整的是任务服从性和行为表现，而不是凭空补上所有知识缺口。",
      ],
      pitfalls: [
        "把回答更礼貌、更结构化误解成模型本质上更懂知识。",
        "遇到事实缺口时只从指令微调层找原因，忽略问题可能来自基础知识、上下文或外部信息不足。",
      ],
      examples: [
        "一个只做过预训练的模型可能能续写一段分析，但面对“请用三点列出结论并给出注意事项”的请求时未必稳定；做过指令微调后，执行会明显更稳。",
        "模型看起来更会沟通、更少冒犯，往往并不是知识层突然升级，而是偏好优化改变了它的输出倾向。",
      ],
      scenario:
        "在客服、写作辅助和企业问答系统里，任务服从性常常和知识能力同样重要。用户体验里“好不好用”的一大部分，其实来自这一层训练塑形。",
      next:
        "进一步往前走，我们会讨论行为塑形还不够的地方，也就是对齐、安全和行为边界为什么必须被单独设计。",
      takeaway:
        "指令微调让模型更会执行要求，偏好优化让模型更像助手，但它们并不自动解决所有知识和真实性问题。",
      terms: ["指令微调", "偏好优化", "对齐", "离线评测"],
      quizFocus:
        "优先区分任务服从性提升和基础知识增强，不要把两者混成一件事。",
      applyPriority:
        "分析助手表现时，先判断问题来自任务执行风格还是来自底层知识与证据不足。",
    },
    {
      slug: "alignment-safety-and-behavior-boundaries",
      title: "对齐、安全与行为边界",
      titleEn: "Alignment, Safety, and Behavior Boundaries",
      learningObjective:
        "理解为什么模型不仅要会回答，还要在规则、风险和行为边界内回答。",
      learningObjectiveEn:
        "Understand why models must not only answer well, but also behave within safety and policy boundaries.",
      overview:
        "大语言模型一旦进入真实场景，问题就不再只是“答得好不好”，而是“它会不会在不该给答案的时候给答案，会不会跨过不该跨的边界”。这一节讨论的就是这种行为层问题为什么不能被忽视。",
      whyImportant:
        "现实世界里的失败往往不是模型单纯答错一句话，而是它在高风险语境中给出不当建议、误导性表达或越界操作。这使得对齐和安全不只是产品附属功能，而是系统设计的一部分。",
      connection:
        "这一节把训练塑形继续推进到行为治理层，解释为什么“会做事”和“做事可控”是两回事。",
      intuition:
        "可以把它理解成给一个能力很强的人设置工作边界。能力越强，越需要明确什么情况下该停、该提醒、该拒绝，或者该让人类接管。",
      corePoints: [
        "对齐关注的是模型行为是否符合人类预期、规则要求和使用场景边界。",
        "安全设计不仅是限制某些输出，更是管理高风险情境下的行为方式和升级路径。",
        "行为边界必须和业务风险相匹配，不能只用一套抽象原则覆盖所有场景。",
      ],
      pitfalls: [
        "把安全理解成简单关键词过滤，忽略语境、任务目标和真实后果同样重要。",
        "认为模型本身足够强就自然会“知道什么该做什么不该做”，从而轻视系统层的约束与治理。",
      ],
      examples: [
        "在低风险的文本润色场景里，允许模型更自由表达问题不大；但在医疗、法律或财务辅助场景中，相同的自由度就可能迅速转化成风险。",
        "一个能流畅给出建议的模型，如果缺乏清晰边界，可能会在不确定证据的情况下仍然给出过度自信的高风险指导。",
      ],
      scenario:
        "做企业部署时，真正可靠的系统往往不是“什么都答”，而是能区分什么该答、什么该引用证据、什么该让人确认、什么该直接收手。",
      next:
        "接下来课程会把焦点转向推理时刻，也就是模型带着这些训练结果进入上下文和任务时，究竟是怎样工作的。",
      takeaway:
        "对齐和安全的意义，不是削弱模型，而是让模型能力在真实场景里以可控方式释放。",
      terms: ["对齐", "偏好优化", "引用证据", "线上监控"],
      quizFocus:
        "优先把安全理解成行为治理问题，而不是把它缩减成单一过滤规则。",
      applyPriority:
        "评估高风险场景时，先看模型边界和接管机制是否清楚，再看回答是否流畅。",
    },
  ],
};

const llmCourseV2Chapter3: ExampleChapterSeed = {
  slug: "context-and-reasoning",
  title: "上下文与推理",
  titleEn: "Context and Reasoning",
  subchapters: [
    {
      slug: "context-windows-and-attention-limits",
      title: "上下文窗口与注意力限制",
      titleEn: "Context Windows and Attention Limits",
      learningObjective:
        "理解上下文窗口并不是无限记忆，而是一种受长度、顺序和注意力分配共同约束的工作空间。",
      learningObjectiveEn:
        "Understand context windows as limited working space rather than infinite memory.",
      overview:
        "很多人第一次听到上下文窗口时，会把它想成“模型能记住多少内容”。这种说法只说对了一半。更准确地说，上下文窗口是模型当前这次推理里能同时处理的信息工作区，而这个工作区并不会对所有内容一视同仁。",
      whyImportant:
        "如果把上下文理解成越长越好，就很容易把系统做成又贵又慢、重点还不清楚。真正难的不是把更多内容塞进去，而是把真正相关的内容以模型更容易利用的方式组织进去。",
      connection:
        "前面的训练阶段决定模型带着什么能力来，这一节则讨论模型在推理当下能看到什么、能关注什么。",
      intuition:
        "可以把上下文窗口想成办公桌面。桌子确实能摆东西，但桌面越乱、越满，真正手边最关键的文件反而越容易被淹没。",
      corePoints: [
        "上下文窗口提供的是当前推理工作空间，而不是完整长期记忆。",
        "信息顺序、相关性和噪声比例都会影响模型注意力如何分配。",
        "更长的上下文不自动等于更好的效果，重点是组织得是否合理。",
      ],
      pitfalls: [
        "把所有可能相关的信息都一股脑塞进上下文，结果让关键线索反而不突出。",
        "误以为只要上下文足够长，模型就会自然正确使用其中所有信息。",
      ],
      examples: [
        "企业知识助手如果把整本文档库都塞进上下文，模型往往不如只看到经过筛选的关键段落时表现稳定。",
        "同样一条事实，如果被埋在大量无关内容中，模型更容易忽略；如果被放在任务相关的位置上，利用率会明显更高。",
      ],
      scenario:
        "做长文档问答、会议总结或多轮任务时，上下文组织方式往往比单纯增加窗口长度更影响最终效果。",
      next:
        "理解了工作空间以后，下一节会进一步讨论任务本身如何被表达，也就是提示设计为什么会深刻影响模型行为。",
      takeaway:
        "上下文窗口的核心价值不在于装得多，而在于让模型在有限工作空间里看见真正重要的信息。",
      terms: ["上下文窗口", "上下文", "Token", "延迟"],
      quizFocus:
        "优先把上下文窗口理解成受约束的工作空间，而不是无限记忆仓库。",
      applyPriority:
        "设计上下文时，先减少噪声和提升相关性，再考虑是否继续加长输入。",
    },
    {
      slug: "prompting-and-task-framing",
      title: "提示设计与任务表达",
      titleEn: "Prompting and Task Framing",
      learningObjective:
        "理解提示设计的核心不是堆技巧，而是把任务结构、角色预期和输出要求表达得让模型更容易抓住重点。",
      learningObjectiveEn:
        "Understand prompting as clear task framing rather than a pile of isolated tricks.",
      overview:
        "提示设计最容易被神秘化。很多人会把它想成一套秘密咒语，好像换几个词就能让模型突然变强。更稳定的理解方式，是把提示看成一种任务表达：它在告诉模型你要它扮演什么角色、聚焦什么信息、输出什么结构。",
      whyImportant:
        "同一个模型在不同提示下表现差异很大，这说明任务表达本身就是系统性能的重要组成部分。不会表达任务，往往比不会选模型更直接地拉低效果。",
      connection:
        "这一节承接上下文窗口，因为上下文里到底放什么、怎样放，很多时候就是通过提示设计来组织的。",
      intuition:
        "可以把提示设计想成给一个聪明但很忙的同事布置工作。不是看你说了多少，而是看你有没有把目标、限制和交付格式讲得足够清楚。",
      corePoints: [
        "好的提示首先要清楚表达任务目标、输入边界和输出形式。",
        "提示设计的价值常常体现在减少歧义、突出重点和控制结果结构，而不是制造表面复杂度。",
        "提示不是替代模型能力，而是在已有能力范围内帮助模型更稳定地用对能力。",
      ],
      pitfalls: [
        "把提示工程理解成堆砌套路和长模板，忽略任务表达本身是否清晰。",
        "看到提示优化有效，就误以为所有问题都能靠重写提示解决，而不检查是否需要检索、工具或更强模型。",
      ],
      examples: [
        "同样要求总结一段内容，直接说“帮我总结一下”和明确要求“用三点总结结论、风险和后续动作”通常会得到完全不同的结果结构。",
        "在分析型任务里，让模型先列出判断依据再给结论，往往比只要求它给最终答案更容易暴露问题并提升可解释性。",
      ],
      scenario:
        "在知识问答、报告生成、客服回复和企业流程自动化中，很多稳定性提升并不是来自更贵的模型，而是来自更清晰的任务表达。",
      next:
        "提示表达清楚以后，仍然会出现模型说得像真却不一定真的对的问题。下一节会讨论推理、幻觉和事实边界。",
      takeaway:
        "提示设计的本质，是把任务表达成模型更容易正确执行的形式，而不是寻找某个万能咒语。",
      terms: ["上下文", "引用证据", "指令微调", "离线评测"],
      quizFocus:
        "优先理解提示设计是任务表达问题，而不是把它神秘化成技巧集合。",
      applyPriority:
        "优化提示时，先澄清目标、限制和输出结构，再去做措辞层面的细调。",
    },
    {
      slug: "reasoning-hallucination-and-factual-limits",
      title: "推理、幻觉与事实边界",
      titleEn: "Reasoning, Hallucination, and Factual Limits",
      learningObjective:
        "理解模型为什么会表现出推理能力、为什么会出现幻觉，以及事实边界与语言流畅性之间为何常常张力很大。",
      learningObjectiveEn:
        "Understand why models appear to reason, why hallucinations occur, and why fluency often diverges from factual reliability.",
      overview:
        "大语言模型最迷惑人的地方之一，就是它既能给出看起来条理清楚的推理，也会在事实层面出现明显幻觉。这一节要解决的，就是如何同时看懂这两面，而不是只被其中一面带着走。",
      whyImportant:
        "如果你把流畅表达直接等同于真实理解，就会高估系统；如果你因为幻觉存在就否定一切推理表现，又会低估模型真正的结构能力。两边都容易偏。",
      connection:
        "这一节把前面关于上下文和任务表达的内容拉回结果层，讨论为什么模型在逻辑、事实和表达之间会出现复杂的错位。",
      intuition:
        "可以把它想成一个很会写答案的人。这个人可能非常擅长把思路组织得像模像样，但如果他掌握的事实不完整、引用的材料不可靠，写出来的东西仍然会一本正经地错。",
      corePoints: [
        "模型的推理表现常常体现为结构化组织和模式延续能力，而不总是等同于严格可验证的逻辑推导。",
        "幻觉往往来自事实依据不足、上下文信号不够、检索不可靠或模型在不确定时仍然倾向于继续生成。",
        "评估模型时必须同时区分语言组织能力、任务推理能力和事实可靠性三条线。",
      ],
      pitfalls: [
        "看到模型逻辑表达清楚，就默认其中每一步都有真实依据。",
        "把幻觉全部归结为模型“太笨”，而不去检查信息来源、提示设计和外部证据链是否本来就薄弱。",
      ],
      examples: [
        "模型在解释一个数学思路时可能步骤清晰，但如果中间假设错了，整个推理过程仍然会显得“很像对的”。",
        "在开放问答里，模型如果没有足够证据，仍然可能为了保持流畅性而继续补出一个完整答案，这就是典型的事实边界被表达欲望压过去了。",
      ],
      scenario:
        "在研究分析、知识助手和高风险决策辅助中，真正重要的不是只问“模型会不会推理”，而是问“它的推理依据在哪里，什么时候该停下来要证据”。",
      next:
        "接下来课程会把焦点放到外部知识和系统设计上，因为很多事实边界问题最终都不能只靠模型内部能力解决。",
      takeaway:
        "流畅的推理表达不自动等于真实可靠的事实判断，模型的语言组织能力和事实边界必须被分开看待。",
      terms: ["Grounding", "引用证据", "上下文窗口", "离线评测"],
      quizFocus:
        "优先区分推理表现、语言流畅性和事实可靠性，不要把它们混成同一个指标。",
      applyPriority:
        "遇到高价值结论时，先检查证据链和事实锚定，而不是只看回答是否显得有条理。",
    },
  ],
};

const llmCourseV2Chapter4: ExampleChapterSeed = {
  slug: "retrieval-and-system-design",
  title: "检索与系统设计",
  titleEn: "Retrieval and System Design",
  subchapters: [
    {
      slug: "retrieval-augmentation-and-grounding",
      title: "检索增强与事实锚定",
      titleEn: "Retrieval Augmentation and Grounding",
      learningObjective:
        "理解为什么检索增强不是简单地“多给点资料”，而是要让模型在正确时刻拿到正确证据并真正用起来。",
      learningObjectiveEn:
        "Understand retrieval augmentation as the problem of delivering and using the right evidence at the right time.",
      overview:
        "当模型本身的参数知识不够新、不够准或不够细时，系统就需要引入外部证据。检索增强的价值并不只是把资料拉进来，而是让模型回答真正锚定到这些资料上，而不是把它们当背景噪声。",
      whyImportant:
        "很多检索系统看起来“命中了文档”，但回答仍然不可靠，原因通常不是模型完全不会读，而是检索片段不够相关、排序不合理、切片不适合，或者答案没有真正锚定证据。",
      connection:
        "这一节承接前面的事实边界问题，回答为什么单靠模型参数往往不够，以及系统层怎样补上外部知识链路。",
      intuition:
        "可以把检索增强想成做开卷考试。关键不是把整个图书馆搬进考场，而是及时翻到真正相关的那几页，并在作答时真的引用它们。",
      corePoints: [
        "检索增强的核心是证据相关性、进入方式和被模型利用的程度。",
        "事实锚定让模型回答更贴近外部材料，降低纯靠参数记忆猜测的风险。",
        "好的检索系统关注的不是“搜到了没有”，而是“搜到的证据是否刚好能支持当前任务”。",
      ],
      pitfalls: [
        "把检索增强理解成给模型喂更多文本，而不考虑切片、排序和引用方式。",
        "只检查是否命中文档标题，忽略文档内容是否真的足够支撑具体问题。",
      ],
      examples: [
        "一个财报问答系统即使命中了正确 PDF，如果送进模型的只是宽泛章节标题而不是对应表格和段落，回答依然可能很空。",
        "同一份知识库，在切片粒度和排序方式调整后，回答质量可能显著变化，这说明决定性因素常常不是“有无检索”，而是“检索怎样进入模型”。",
      ],
      scenario:
        "企业知识问答、法规查询、技术文档助手和研究摘要系统，都高度依赖检索增强与事实锚定是否被设计清楚。",
      next:
        "仅有外部证据还不够，很多应用还要求模型能稳定地产生结构化输出并与工具协作。下一节会继续往系统设计层推进。",
      takeaway:
        "检索增强真正要解决的，是让模型在需要时看到对的证据，并让回答真正贴住这些证据。",
      terms: ["检索增强", "Grounding", "引用证据", "上下文窗口"],
      quizFocus:
        "优先理解检索增强的目标是证据可用性，而不是单纯增加输入信息量。",
      applyPriority:
        "检查检索系统时，先看相关性、切片质量和回答是否真正引用了证据。",
    },
    {
      slug: "tool-use-and-structured-outputs",
      title: "工具调用与结构化输出",
      titleEn: "Tool Use and Structured Outputs",
      learningObjective:
        "理解为什么很多 LLM 应用不能只停留在自由文本生成，而要进一步进入工具调用和结构化结果表达。",
      learningObjectiveEn:
        "Understand why many LLM systems must go beyond free-form text into tools and structured outputs.",
      overview:
        "大语言模型最自然的输出形式是文本，但真实系统往往要求的不是“一段看起来不错的话”，而是一个可执行动作、一个可解析结构，或者一条能进入下游系统的结果。于是模型就不再只是写字，而开始变成系统中的一个决策与表达节点。",
      whyImportant:
        "如果模型输出永远停留在自由文本层，很多业务系统就无法稳定接入。结构化输出和工具调用的意义，在于把语言能力转成更可控、更可组合的系统能力。",
      connection:
        "这一节建立在检索增强之后，继续把大语言模型从“会回答问题”推进到“能与外部系统协同工作”。",
      intuition:
        "可以把自由文本理解成口头说明，而结构化输出更像填好的表单或标准接口参数。前者容易让人理解，后者更容易让系统执行。",
      corePoints: [
        "结构化输出提升了结果的可解析性、可验证性和下游系统可接入性。",
        "工具调用让模型从单纯生成文本，扩展到查询、计算、执行和系统联动。",
        "这两者的价值不在于炫技，而在于把语言能力转成稳定可用的工程能力。",
      ],
      pitfalls: [
        "把结构化输出理解成纯格式问题，忽略字段设计、校验规则和异常处理同样重要。",
        "只关心模型会不会调工具，不关心调错了怎么办、结果如何验证、失败如何回退。",
      ],
      examples: [
        "一个报销助手如果只是生成“建议审批”的文本，人还要再手动录入；如果它能稳定生成结构化审批结果，系统联动效率会完全不同。",
        "一个研究助手如果能调用检索、计算和表格整理工具，它就不再只是语言包装器，而开始承担系统流程中的真实工作。",
      ],
      scenario:
        "在企业自动化、知识操作、数据分析和客服流程里，工具调用与结构化输出往往决定了大语言模型究竟是“可演示”，还是“可接入业务”。",
      next:
        "当模型真正进入系统流程后，下一节就必须讨论如何评估、监控并形成反馈闭环。",
      takeaway:
        "工具调用和结构化输出的意义，是把大语言模型从文本生成器推进成可接入系统流程的能力组件。",
      terms: ["引用证据", "离线评测", "线上监控", "延迟"],
      quizFocus:
        "优先理解结构化输出和工具调用为什么属于系统设计能力，而不是展示层技巧。",
      applyPriority:
        "设计应用时，先判断结果是否需要被系统消费，再决定是否引入结构化输出和工具链路。",
    },
    {
      slug: "evaluation-monitoring-and-system-loops",
      title: "评测、监控与系统闭环",
      titleEn: "Evaluation, Monitoring, and System Loops",
      learningObjective:
        "理解大语言模型应用为什么必须同时具备离线评测、线上监控和失败反馈闭环，才能持续改进。",
      learningObjectiveEn:
        "Understand why LLM systems need offline evaluation, online monitoring, and feedback loops to improve reliably.",
      overview:
        "大语言模型应用一旦上线，最大的风险往往不是第一次出错，而是持续出错却没人知道，或者知道了也无法系统修正。评测、监控和反馈闭环，就是把模型应用从“能演示”推进到“可维护”的关键机制。",
      whyImportant:
        "单次样例成功说明不了系统稳定。真正可用的应用必须能比较方案、发现漂移、识别失败模式，并把这些信息回收成改进依据。",
      connection:
        "这一节把前面的检索、提示和工具系统重新汇总，转向应用生命周期视角：一个系统如何被观察、被比较、被修正。",
      intuition:
        "可以把它想成驾驶系统的仪表盘和维修记录。跑起来只是第一步，更重要的是能不能看见异常、记录原因、再根据这些记录持续修车。",
      corePoints: [
        "离线评测帮助团队比较方案，建立初始质量判断和基线。",
        "线上监控帮助系统在真实流量中发现分布变化、失败类型和成本问题。",
        "反馈闭环让失败案例真正进入改进流程，而不是只停留在“我们知道有问题”。",
      ],
      pitfalls: [
        "把评测理解成一次性的 benchmark 打分，而不是持续性的系统观察机制。",
        "只记录最终结果，不记录输入特征、证据来源和失败路径，导致问题难以复现和修正。",
      ],
      examples: [
        "一个问答系统离线评测很好，但上线后如果用户问题更短、更模糊，真实表现可能明显下降；这就是为什么线上监控不能被省略。",
        "同样一次错误回答，如果你知道它来自检索缺口、提示不清还是结构化输出失败，后续修正路径会完全不同。",
      ],
      scenario:
        "在客服、知识管理、研究辅助和企业自动化场景里，真正长期稳定的系统，往往不是最早上线的那一个，而是反馈闭环最完整的那一个。",
      next:
        "最后一章会把目光放到更宏观的应用与取舍层面，讨论模型选择、业务接入和未来边界问题。",
      takeaway:
        "可持续改进的大语言模型系统，必须能被评测、被监控，也能把失败重新送回改进闭环。",
      terms: ["离线评测", "线上监控", "延迟", "总拥有成本"],
      quizFocus:
        "优先把评测和监控理解成系统能力，而不是上线前后的附属检查。",
      applyPriority:
        "评估应用成熟度时，先看它是否具备完整的观察和反馈闭环，再看单次样例表现。",
    },
  ],
};

const llmCourseV2Chapter5: ExampleChapterSeed = {
  slug: "applications-and-tradeoffs",
  title: "应用与取舍",
  titleEn: "Applications and Tradeoffs",
  subchapters: [
    {
      slug: "model-selection-cost-and-latency",
      title: "模型选择、成本与延迟",
      titleEn: "Model Selection, Cost, and Latency",
      learningObjective:
        "理解模型选型不是只看效果最好，而是要在质量、成本、速度和风险之间做系统级平衡。",
      learningObjectiveEn:
        "Understand model selection as a system-level tradeoff across quality, cost, speed, and risk.",
      overview:
        "真实应用里，最强模型并不总是最优模型。你要面对的不只是“答得对不对”，还包括预算、延迟、并发、失败代价和用户容忍度。这一节讨论的，就是为什么模型选择本质上是系统工程问题。",
      whyImportant:
        "很多项目不是败在模型不够强，而是败在成本跑飞、响应过慢，或者把高价值任务和低价值任务混在一起用同一种昂贵配置处理。",
      connection:
        "这一节把前面的机制和系统设计真正带到部署层面，开始讨论产品上线时最现实的取舍。",
      intuition:
        "可以把模型选型想成组建一支球队。不是所有位置都需要最贵的明星球员，有些位置更需要稳定、便宜和可规模化。",
      corePoints: [
        "模型选择必须同时考虑质量目标、延迟要求、预算上限和失败后果。",
        "同一个系统里的不同任务，往往不需要使用同一档模型能力和同一档成本配置。",
        "真正成熟的选型方式，是把业务价值和系统约束一起纳入判断，而不是只盯着单项能力峰值。",
      ],
      pitfalls: [
        "只按 benchmark 或演示效果选模型，忽略实际业务流量和预算压力。",
        "为了省钱一味压缩模型成本，结果在高价值场景中把错误代价推高到不可接受。",
      ],
      examples: [
        "在企业知识助手里，复杂综合分析可能值得用更强模型，但简单改写和分类任务往往并不需要相同成本配置。",
        "一个看起来更便宜的模型，如果因为失败率更高而带来更多重试和人工兜底，整体总拥有成本未必真的更低。",
      ],
      scenario:
        "做客服、写作、研究分析或企业自动化系统时，模型选型最有价值的做法往往不是一次性押注，而是按任务价值和风险进行分层配置。",
      next:
        "模型选对之后，下一节会继续讨论这些能力怎样真正嵌入企业工作流，而不是停留在孤立的聊天界面里。",
      takeaway:
        "模型选型的关键不是盲目追求最强，而是让质量、成本、延迟和风险形成可接受的整体平衡。",
      terms: ["离线评测", "线上监控", "延迟", "总拥有成本"],
      quizFocus:
        "优先把模型选型理解成系统取舍问题，而不是单纯的模型排行榜比较。",
      applyPriority:
        "做选型决策时，先明确业务价值和失败成本，再决定要为能力付出多少预算和延迟。",
    },
    {
      slug: "enterprise-use-patterns-and-workflow-integration",
      title: "企业应用模式与工作流集成",
      titleEn: "Enterprise Use Patterns and Workflow Integration",
      learningObjective:
        "理解大语言模型真正进入企业应用时，价值通常来自工作流嵌入和人机协作方式，而不是单独的聊天能力。",
      learningObjectiveEn:
        "Understand how enterprise value often comes from workflow integration and human collaboration, not isolated chat features.",
      overview:
        "大语言模型如果只停留在一个聊天窗口里，价值往往有限。真正进入组织后，它通常要嵌入文档流、审批流、知识流和业务动作链路中。这时，系统设计的重点就从“能不能回答”转成“能不能推进工作”。",
      whyImportant:
        "很多项目表面上用了大语言模型，但只做成了一个看起来很聪明的问答壳。只有当模型能力真正嵌入工作流，能减少摩擦、提升效率、增强判断，它才更可能成为长期被使用的系统。",
      connection:
        "这一节承接模型选型，把能力进一步放回企业组织和真实工作流程里看。",
      intuition:
        "可以把大语言模型想成一个数字同事。真正有价值的时候，不是它能闲聊，而是它知道在工作链路中什么时候该起草、什么时候该查证、什么时候该提醒、什么时候该交给人确认。",
      corePoints: [
        "企业应用的关键不只是回答问题，而是把模型能力嵌入已有工作流并减少真实摩擦。",
        "人机协作设计决定了模型是在放大效率，还是在制造新的确认成本和风险。",
        "流程接口、权限边界和结果可追踪性往往比聊天体验本身更决定长期价值。",
      ],
      pitfalls: [
        "把企业应用等同于加一个聊天入口，忽略真正重要的是和原有流程的连接方式。",
        "把所有步骤都自动化，忽略高风险环节仍然需要清楚的人类确认与责任边界。",
      ],
      examples: [
        "法务知识助手的价值不只在回答合同问题，而在于它能把条款检索、风险提示和人工复核节点一起纳入同一工作流。",
        "销售团队若把模型用在客户纪要整理、后续动作建议和 CRM 录入辅助，往往比单纯问答更容易形成持续价值。",
      ],
      scenario:
        "在知识管理、客服、法务、财务和研发协作里，大语言模型真正创造价值的方式，通常是成为现有流程中的一个高效节点，而不是替代整个组织。",
      next:
        "课程最后一节会从更长远的角度讨论大语言模型应用未来可能走向哪里，以及它的边界仍然在哪里。",
      takeaway:
        "大语言模型的企业价值，往往不是来自独立聊天能力，而是来自它如何嵌入工作流并与人协作。",
      terms: ["引用证据", "线上监控", "总拥有成本", "对齐"],
      quizFocus:
        "优先从工作流集成角度理解企业应用，而不是把价值简单等同于聊天效果。",
      applyPriority:
        "设计企业应用时，先明确模型要嵌入哪一段流程、和谁协作、承担什么责任边界。",
    },
    {
      slug: "future-of-llm-systems-and-application-boundaries",
      title: "大语言模型的未来与应用边界",
      titleEn: "The Future of LLM Systems and Application Boundaries",
      learningObjective:
        "建立对大语言模型未来发展方向和现实应用边界的整体判断，而不是只在能力幻想中讨论它。",
      learningObjectiveEn:
        "Build a grounded view of future LLM directions and real application boundaries.",
      overview:
        "大语言模型的未来很容易被两种声音带偏：一种过度乐观，觉得它会自然接管一切；另一种过度悲观，觉得它只是会说话的壳。更有价值的视角，是同时看到它正在快速扩展的系统角色，以及短期内仍然清晰存在的边界。",
      whyImportant:
        "只有把未来趋势和现实边界一起看，你才不容易在产品规划里盲目冲动，也不容易在技术判断里错过真正有价值的机会。",
      connection:
        "这一节为整门课收束，把前面关于机制、训练、上下文、系统设计和应用取舍重新汇总成一个长期视角。",
      intuition:
        "可以把大语言模型看成正在成为一种新的软件中间层。它既不是万能决策者，也不只是一个炫目的前端功能，而是在很多系统里逐渐承担起理解、组织、表达和协作的角色。",
      corePoints: [
        "未来的大语言模型系统会越来越多地和检索、工具、工作流以及人机协作结构一起演进。",
        "模型能力继续增强并不意味着应用边界自动消失，高风险、强事实依赖和强责任要求场景仍然需要严格治理。",
        "真正长期有价值的判断，不是预测模型会不会更强，而是理解什么能力值得被系统化、什么边界必须被保留。",
      ],
      pitfalls: [
        "把未来趋势理解成“只要模型更强，系统设计问题就会自动消失”。",
        "因为看到当前边界就低估长期潜力，忽略系统形态、工具链和组织流程同样会继续变化。",
      ],
      examples: [
        "未来知识系统可能不再只是静态搜索框，而会把检索、总结、校验和行动建议组织成连续流程，这体现的是系统形态变化而不只是模型更强。",
        "与此同时，在法律、医疗、金融等高责任场景中，即使模型更强，人类确认和证据链要求也未必会消失，只会变得更系统化。",
      ],
      scenario:
        "做产品判断时，最稳的方式不是问“大语言模型能不能替代一切”，而是问“它在哪些环节最适合作为能力放大器，哪些环节必须保留人类与规则约束”。",
      next:
        "到这里，这门课程已经完成。接下来更重要的，是带着这套结构去看真实产品：它们在哪里真的用好了大语言模型，哪里又只是套上了一个表面标签。",
      takeaway:
        "大语言模型的未来既值得期待，也必须被边界化地理解；真正成熟的应用来自能力扩展与治理约束同时成立。",
      terms: ["对齐", "线上监控", "总拥有成本", "引用证据"],
      quizFocus:
        "优先把未来趋势理解成系统形态变化与边界治理并存，而不是单向度的能力幻想。",
      applyPriority:
        "评估未来机会时，先看哪些能力能被系统化利用，哪些边界仍然必须被清楚保留。",
    },
  ],
};

const llmCourseV2Seed: ExampleCourseSeed = {
  slug: "llm-principles",
  title: "大语言模型原理与应用",
  titleEn: "Large Language Models: Principles and Applications",
  topic: "大语言模型原理与应用",
  topicEn: "Large Language Models: Principles and Applications",
  description:
    "这门官方示例课从语言建模基础讲到训练、对齐、上下文、检索、系统设计与企业应用，帮助你建立一套真正可迁移的大语言模型理解框架。",
  descriptionEn:
    "This official sample course moves from language modeling foundations through training, alignment, context, retrieval, system design, and enterprise applications to build a transferable understanding of LLM systems.",
  goals: [
    "理解大语言模型的底层语言建模原理以及能力形成路径",
    "理解训练、上下文、检索和工具如何共同塑造真实系统表现",
    "建立关于模型选型、应用落地与未来边界的系统判断框架",
  ],
  goalsEn: [
    "Understand the language-modeling foundations and capability formation path of LLMs",
    "See how training, context, retrieval, and tools jointly shape real system behavior",
    "Build a systems-level judgment framework for deployment tradeoffs and future boundaries",
  ],
  chapters: [
    llmCourseV2Chapter1,
    llmCourseV2Chapter2,
    llmCourseV2Chapter3,
    llmCourseV2Chapter4,
    llmCourseV2Chapter5,
  ],
};

const llmLegacyLessonRedirects: Record<
  string,
  { chapterSlug: string; subchapterSlug: string }
> = {
  "modeling-basics/tokens-and-next-token-prediction": {
    chapterSlug: "foundations-of-language-modeling",
    subchapterSlug: "tokens-representations-and-prediction-objective",
  },
  "modeling-basics/pretraining-and-instruction-tuning": {
    chapterSlug: "training-and-alignment",
    subchapterSlug: "pretraining-and-base-capability",
  },
  "reasoning-and-system-design/context-retrieval-and-grounding": {
    chapterSlug: "retrieval-and-system-design",
    subchapterSlug: "retrieval-augmentation-and-grounding",
  },
  "reasoning-and-system-design/alignment-evaluation-and-cost": {
    chapterSlug: "applications-and-tradeoffs",
    subchapterSlug: "model-selection-cost-and-latency",
  },
};

const quantCourseV2Chapter1: ExampleChapterSeed = {
  slug: "research-foundations",
  title: "数据基础",
  titleEn: "Data Foundations",
  subchapters: [
    {
      slug: "market-data-and-timeline-integrity",
      title: "市场数据与时间线校验",
      titleEn: "Market Data and Timeline Integrity",
      learningObjective:
        "理解量化研究的第一步不是急着建模，而是先确认数据来源、时间线、复权方式与样本口径是否真实可靠。",
      learningObjectiveEn:
        "Understand that quant research begins with data integrity, timeline correctness, and sample definition before any modeling sophistication.",
      overview:
        "很多人一提量化，就会马上想到因子、回测和模型效果，但真正决定研究能不能站住脚的，往往是更基础的一层：你手里的价格、财务、成交量或事件数据到底来自哪里，它们在现实里什么时候才真正可见，序列里的变化到底反映了市场行为，还是只是口径变化带来的假象。",
      whyImportant:
        "如果数据源、时间戳和样本定义一开始就有偏差，后面再漂亮的统计检验和回测曲线都可能只是把错误放大。量化研究里最危险的情况，不是模型很差，而是模型在错误数据上看起来很好。",
      connection:
        "这一节是整门课真正的起点。后面的收益构造、因子验证、回测执行和风险管理，都依赖这一层是否把数据口径、可见时间和样本边界先讲清楚。",
      intuition:
        "你可以把它想成做实验前先校准仪器。真正有经验的研究者不会一上来就追求曲线多漂亮，而会先问：这把尺子准不准？这组样本是不是拿错了？这个时间点上的信息，在真实世界里当时到底能不能看到？",
      corePoints: [
        "量化研究最先要解决的不是模型结构，而是数据来源是否可靠、口径是否一致、时间线是否符合真实可见性。",
        "价格序列、财务指标和事件数据都带着各自的生成逻辑；不理解这些数据是如何被记录和更新的，就很容易在研究里偷看未来。",
        "真正可靠的研究基础，不是把数据表整理得好看，而是让每一个样本点都能回答“它从哪里来、什么时候能用、为什么可以这样解释”。",
      ],
      pitfalls: [
        "默认拿到的数据天然可用，忽略复权、停牌、退市、缺失值和时间戳本身就可能已经改变了结论方向。",
        "把数据处理理解成机械地删掉异常值，而不是先判断异常究竟是市场真实波动、流动性断层，还是采集与对齐错误。",
      ],
      examples: [
        "如果财报数据在样本里被默认成“报告期结束时就已知晓”，而不是按真实披露日进入研究，那么你看到的预测能力很可能只是前视偏差在伪装成信息优势。",
        "如果一段股票价格序列没有正确处理分红和拆股，你看到的剧烈跳变可能根本不是市场情绪或趋势变化，而只是价格口径被改写后的表面现象。",
      ],
      scenario:
        "无论你研究的是股票、期货、ETF 还是加密资产，只要数据可见时间、交易日历和样本口径没有先站稳，后面的因子分析和回测结论就很难真正进入实盘判断。",
      next:
        "把这一层打稳之后，接下来我们才会继续讨论收益序列和特征构造，看看原始市场记录是如何被转化成真正可比较、可分析的研究输入。",
      takeaway:
        "量化研究的第一步不是找出最强模型，而是确保你看到的市场现实没有在数据处理过程中被悄悄改写。",
      terms: ["复权", "时间戳", "口径一致", "前视偏差"],
      quizFocus:
        "优先建立数据质量和时间线校验意识，而不是一开始就被模型和曲线牵着走。",
      applyPriority:
        "开始研究前，先检查数据来源、复权方式、可见时间和样本口径是否已经被解释清楚。",
    },
    {
      slug: "return-series-and-feature-engineering",
      title: "收益序列与特征构造",
      titleEn: "Return Series and Feature Engineering",
      learningObjective:
        "理解价格、收益和特征之间的关系，以及为什么研究对象必须被转换成更适合比较和建模的形式。",
      learningObjectiveEn:
        "Understand the relationship among prices, returns, and engineered features in quantitative research.",
      overview:
        "价格是市场最直观的表象，但真正进入研究时，我们往往更关心收益、波动、成交结构和其他可比较特征。这一节的重点，是理解为什么研究对象需要被重新表达，以及不同表达会带来怎样的解释差异。",
      whyImportant:
        "如果研究对象本身定义不清楚，后面的统计检验和策略构造就很容易在形式上严谨、在含义上混乱。你必须先知道自己到底在测什么，才能讨论它是否有用。",
      connection:
        "上一节解决了数据是否可信，这一节继续解决数据如何变成研究输入。它是从原始市场记录走向信号分析的桥梁。",
      intuition:
        "可以把原始价格理解成一段原材料，而收益率、波动和特征更像被切割、归一化和组合过的部件。只有先把部件整理成可比形态，后面才谈得上搭结构。",
      corePoints: [
        "收益率比价格更适合作为跨资产、跨时间比较的基础量，因为它反映的是相对变化而非绝对水平。",
        "特征构造的关键不只是算出更多指标，而是让特征真正对应某种可解释的市场现象。",
        "不同频率、窗口和标准化方式会显著改变特征的统计性质和后续可用性。",
      ],
      pitfalls: [
        "看到某个指标相关性不错，就忽略它是否只是价格水平、波动尺度或样本窗口选择带来的伪效果。",
        "一味堆叠特征数量，以为维度越多越好，结果让研究更难解释、更容易过拟合。",
      ],
      examples: [
        "同样是动量概念，用 20 日收益、60 日收益还是行业中性后的超额收益来表达，研究结论可能完全不同。",
        "一个未经标准化的财务指标在大市值公司上可能天然数值更大，这并不意味着它真的更有预测力，只是表达方式没有先处理好。",
      ],
      scenario:
        "无论是做截面选股、时间序列预测还是事件研究，研究质量往往取决于你如何把市场现象转换成更稳定、更可比较的特征表达。",
      next:
        "有了可分析特征后，下一节会继续进入真正的信号设计，讨论一个信号为什么值得相信。",
      takeaway:
        "收益和特征不是对价格的简单重命名，而是把市场现象转成可比较、可解释研究对象的关键步骤。",
      terms: ["收益率", "因子", "异常值", "经济含义"],
      quizFocus:
        "优先理解研究对象的表达方式会如何改变后续结论，而不是只追求算出更多指标。",
      applyPriority:
        "构造特征时，先确认它代表的市场现象是什么，以及这种表达是否真的便于比较和解释。",
    },
    {
      slug: "hypothesis-driven-signal-design",
      title: "假设驱动的信号设计",
      titleEn: "Hypothesis-Driven Signal Design",
      learningObjective:
        "理解量化信号不应只是历史上碰巧有效的指标，而应尽量建立在可解释的市场机制和清晰假设上。",
      learningObjectiveEn:
        "Understand signal design as hypothesis-driven research rather than accidental historical fit.",
      overview:
        "真正值得研究的信号，通常不是“在历史上正好涨得好”的那种，而是你能说清它为什么可能有效、在哪些条件下可能失效、它究竟抓的是哪类市场行为。这一节的重点，是把信号设计重新拉回研究假设本身。",
      whyImportant:
        "没有假设支撑的信号很容易变成曲线筛选游戏。它也许曾经有效，但你很难判断它以后为什么还会有效，更难判断它什么时候已经失效。",
      connection:
        "这一节是从数据和特征真正走向研究判断的第一步。它决定后面做的验证和回测，到底是在检验一个有逻辑的研究想法，还是在给巧合包装证据。",
      intuition:
        "可以把信号想成一个研究主张。不是因为你看见了数字上的差异，它就自动成立；你还得说明这差异背后的行为动因或经济机制到底是什么。",
      corePoints: [
        "一个信号之所以值得研究，通常需要同时具备统计迹象和机制解释。",
        "研究假设越清楚，后续验证越容易针对真正关键的问题，而不是在无关维度上来回试错。",
        "好信号不是在所有环境里都强，而是在你知道它为什么有效、为什么失效时仍然值得信任。",
      ],
      pitfalls: [
        "先看到好看的回测结果，再倒推一个勉强说得通的故事，误把结果叙事当成研究逻辑。",
        "把每一个短期有效现象都当作可持续信号，忽略市场结构、交易拥挤和样本偶然性可能已经改变了前提。",
      ],
      examples: [
        "价值因子之所以长期被研究，不只是因为历史样本上看起来有效，更因为它和估值修复、风险补偿等机制有明确关联。",
        "某个技术指标在一段样本里效果很好，但如果你说不清它反映的是趋势、均值回归还是流动性错位，就很难判断它是否值得继续投入。",
      ],
      scenario:
        "在做事件驱动、基本面因子或高频微结构研究时，越早把研究假设讲清楚，越能减少后面不断调参数却越来越不知道自己在找什么的情况。",
      next:
        "接下来课程会把焦点转到验证层，讨论一套研究假设怎样才算真的经得起证据检验。",
      takeaway:
        "量化信号真正的价值，不在于它曾经有效，而在于你是否能说清它为什么可能持续有效以及何时可能失效。",
      terms: ["因子", "经济含义", "样本外验证", "过拟合"],
      quizFocus:
        "优先把信号理解成研究假设，而不是历史曲线筛选出来的幸运指标。",
      applyPriority:
        "继续投入一个信号前，先问自己是否能清楚解释它的机制、边界和失效条件。",
    },
  ],
};

const quantCourseV2Chapter2: ExampleChapterSeed = {
  slug: "signal-validation-and-factor-thinking",
  title: "信号验证与因子思维",
  titleEn: "Signal Validation and Factor Thinking",
  subchapters: [
    {
      slug: "economic-rationale-and-factor-intuition",
      title: "经济逻辑与因子直觉",
      titleEn: "Economic Rationale and Factor Intuition",
      learningObjective:
        "理解一个因子为什么值得被相信，通常来自经济逻辑、行为机制与统计证据的共同支撑。",
      learningObjectiveEn:
        "Understand why a factor becomes credible only when economic logic and statistical evidence reinforce each other.",
      overview:
        "量化因子研究很容易掉进两个极端：一种是只讲故事、不看证据；另一种是只看显著性、不问机制。这一节讨论的，就是为什么真正可靠的因子通常需要两条腿一起站稳。",
      whyImportant:
        "只靠故事，你很难验证；只靠显著性，你又很容易把噪声当规律。量化研究最怕的，恰恰就是两边都没有真正站稳却看起来很像“已经成立”。",
      connection:
        "这一节承接前面的假设驱动设计，把“为什么值得研究”进一步推进到“什么样的因子才真的值得信任”。",
      intuition:
        "可以把因子想成一个观点。好观点不只是听起来有道理，也不只是数据上暂时占优，而是道理和证据互相支撑、互相约束。",
      corePoints: [
        "因子要长期可研究，通常需要既能讲清经济或行为逻辑，也能拿出相对稳定的统计证据。",
        "逻辑帮助你判断因子为什么可能持续，证据帮助你判断它是不是只是巧合。",
        "因子直觉的价值在于帮助你识别什么该继续深挖，什么该尽快止损。",
      ],
      pitfalls: [
        "因为故事讲得漂亮就相信因子成立，而不去看证据是否足够稳健。",
        "因为统计结果显著就假设因子有深层机制，忽略它也可能只是数据挖掘出来的偶然图形。",
      ],
      examples: [
        "价值、动量、质量等经典因子之所以长期被讨论，不只是因为它们历史上有效，更因为它们背后都能找到某种相对稳定的行为或风险补偿逻辑。",
        "某些短期指标看起来很“神”，但如果既讲不清逻辑，也不能跨样本稳定存在，通常就不值得继续信任。",
      ],
      scenario:
        "在选股、择时和多因子组合研究里，越早建立机制与证据并重的因子判断习惯，越能减少后面在噪声里浪费时间。",
      next:
        "下一节会进一步把因子证据拆成不同视角，讨论截面证据和时间序列证据各自说明了什么。",
      takeaway:
        "真正值得长期信任的因子，通常既讲得通，也经得起看。",
      terms: ["因子", "经济含义", "收益率", "样本外验证"],
      quizFocus:
        "优先建立机制与证据并重的因子判断框架，而不是偏向其中任意一边。",
      applyPriority:
        "评估因子时，先检查它的机制解释和证据稳健性是否彼此支持。",
    },
    {
      slug: "cross-sectional-and-time-series-evidence",
      title: "截面证据与时间序列证据",
      titleEn: "Cross-Sectional and Time-Series Evidence",
      learningObjective:
        "理解不同证据视角各自能回答什么问题，以及为什么不能把它们混成同一种有效性证明。",
      learningObjectiveEn:
        "Understand what cross-sectional and time-series evidence each can prove, and why they should not be conflated.",
      overview:
        "量化研究里的“有效”并不是单一概念。一个信号可能在截面上能区分资产强弱，却不一定适合时间序列择时；也可能在时间序列上有规律，却很难扩展到跨资产比较。这一节要解决的，就是证据视角的分工问题。",
      whyImportant:
        "如果你分不清不同证据在证明什么，就很容易把一种意义上的有效误读成另一种意义上的可交易，从而在后续策略设计里犯方向性错误。",
      connection:
        "这一节延续因子验证，但把验证从“有没有证据”推进到“证据到底在说明什么”。",
      intuition:
        "这有点像看学生成绩：横向比较是在同一次考试里看谁更强，纵向比较是在一个人自己的时间轨迹里看是否进步。两种比较都重要，但回答的问题并不一样。",
      corePoints: [
        "截面证据更适合回答“同一时点上哪些资产相对更优”的问题。",
        "时间序列证据更适合回答“同一资产或组合在不同时间里的动态规律”问题。",
        "研究者需要明确自己的策略问题到底属于哪一类，再去选择对应证据框架。",
      ],
      pitfalls: [
        "把截面排序能力直接当成择时能力，忽略两类问题的目标和评价方式并不相同。",
        "看到某个信号在单资产时间序列上有效，就误以为它能自然扩展成跨资产组合策略。",
      ],
      examples: [
        "一个价值因子可能非常适合做同一时点下的股票横向排序，但未必适合作为指数择时信号。",
        "某个趋势指标在时间序列上能稳定刻画单资产方向性，却不一定对横截面选股同样有帮助。",
      ],
      scenario:
        "做股票截面选股、期货趋势跟踪或宏观资产配置时，研究问题不同，证据框架也应当跟着换，不能一套方法到处硬套。",
      next:
        "最后一节会继续讨论更严苛的稳健性检验，看看怎样才算真正经得起不同样本和环境变化。",
      takeaway:
        "证据的力量不只在于“有”，还在于它回答的是不是你真正关心的那个问题。",
      terms: ["收益率", "样本外验证", "相关性", "因子"],
      quizFocus:
        "优先分清不同证据框架各自在回答什么问题，而不是把所有“有效”混成一个词。",
      applyPriority:
        "做验证前，先明确你研究的是截面排序问题还是时间序列动态问题。",
    },
    {
      slug: "robustness-and-sample-out-validation",
      title: "稳健性与样本外验证",
      titleEn: "Robustness and Out-of-Sample Validation",
      learningObjective:
        "理解稳健性检验和样本外验证为什么是量化研究里区分“看起来有效”和“更可能可用”的关键步骤。",
      learningObjectiveEn:
        "Understand robustness and out-of-sample validation as the line between apparent success and credible usability.",
      overview:
        "很多研究结果之所以危险，不是因为它们一开始完全错误，而是因为它们只在原样本里刚好成立。一旦离开原来的时间窗口、资产池或参数选择，效果就迅速消失。这一节讨论如何识别这种脆弱性。",
      whyImportant:
        "样本外验证和稳健性检验是对研究者最大的克制训练。它迫使你承认：历史上看起来很好的东西，不等于未来就有可迁移价值。",
      connection:
        "前两节讲逻辑与证据，这一节进一步要求你检查这些逻辑和证据是不是能经得起环境变化。",
      intuition:
        "可以把稳健性测试想成压力测试。真正可靠的结构不是在理想条件下最好看，而是在条件改变时仍然不至于立刻塌掉。",
      corePoints: [
        "样本外验证帮助你检查研究结论是否只是对原样本的过度贴合。",
        "稳健性检验要求信号在不同窗口、不同参数和不同切片下仍保持基本逻辑一致。",
        "真正可用的量化结论通常不是“任何地方都强”，而是“在合理扰动下仍然不至于完全失效”。",
      ],
      pitfalls: [
        "只做一次样本内回测就认定策略成立，忽略参数和样本选择本身可能已经被结果反向污染。",
        "看到样本外效果稍弱就完全否定研究，忽略稳健性判断看的是结构是否仍然存在，而不是曲线是否一模一样好看。",
      ],
      examples: [
        "一个因子在 2017 到 2020 年表现突出，但换到 2021 到 2024 年完全失效，这说明你至少要重新审视它到底捕捉了什么环境。",
        "若一个策略只在极少数参数下效果好，而参数稍微变化就崩掉，通常说明它更像拟合结果而不是稳定结构。",
      ],
      scenario:
        "无论你做短线统计套利、基本面选股还是宏观配置，样本外验证都不是可选项，而是研究从“灵感”走向“信念”的必经步骤。",
      next:
        "接下来课程会进入回测与执行层，看看即使研究逻辑站得住，真实交易约束又会怎样改变你对策略的判断。",
      takeaway:
        "稳健性和样本外验证的意义，不是要求结果永远完美，而是筛掉那些只在原样本里看起来完美的错觉。",
      terms: ["样本外验证", "过拟合", "前视偏差", "经济含义"],
      quizFocus:
        "优先把样本外验证理解成研究可信度筛选器，而不是形式上的额外步骤。",
      applyPriority:
        "看到漂亮结果时，先检查它离开原样本后是否仍保留基本结构，再决定要不要相信它。",
    },
  ],
};

const quantCourseV2Chapter3: ExampleChapterSeed = {
  slug: "backtesting-and-execution",
  title: "回测与执行",
  titleEn: "Backtesting and Execution",
  subchapters: [
    {
      slug: "realistic-backtesting-frameworks",
      title: "真实回测框架",
      titleEn: "Realistic Backtesting Frameworks",
      learningObjective:
        "理解回测的核心不是重放历史，而是尽量在历史中重建真实交易时会遇到的约束和信息边界。",
      learningObjectiveEn:
        "Understand backtesting as reconstructing realistic constraints rather than merely replaying history.",
      overview:
        "回测最危险的地方，不是它会算错，而是它很会把错误包装得像胜利。你看到的每一条收益曲线，背后都隐含着关于交易时点、成交方式、调仓规则和信息可见性的假设。这一节要讨论的，就是这些假设为什么才是回测可信度的核心。",
      whyImportant:
        "如果回测框架本身就偷看了未来、默认理想成交，或者忽略真实约束，那么你看到的不是策略能力，而是框架给你的幻觉奖励。",
      connection:
        "前面讲了信号和验证，这一节开始检验这些研究想法是否能在接近真实交易环境的框架下站得住。",
      intuition:
        "可以把回测想成飞行模拟器。它真正的价值，不是把画面做得多炫，而是尽量把真实飞行中会遇到的风、延迟和限制都模拟出来。",
      corePoints: [
        "回测框架的质量决定了策略结果是接近现实，还是只是对历史做了一个过度乐观的想象。",
        "交易时间、调仓逻辑、资金约束和信息可见边界都应当在框架层被明确表达。",
        "越是高换手、低容量或依赖事件时点的策略，越需要严格的回测真实性要求。",
      ],
      pitfalls: [
        "把回测看成只要会跑历史数据就行，忽略框架假设本身决定了结果可信度。",
        "默认所有信号都能在理想价格、理想时点完整成交，从而把执行难度全部从研究里删掉。",
      ],
      examples: [
        "一个日频策略如果默认收盘后立刻知道收盘全部信息并在同一价格成交，往往已经把不可实现的优势偷偷写进了结果。",
        "事件驱动策略若没有严格处理新闻或财报的真实发布时间，回测表现很可能只是信息时间线造假的结果。",
      ],
      scenario:
        "在股票、期货、ETF 和多资产配置研究中，越接近真实交易逻辑的回测框架，越能帮助你提前发现策略到底是靠能力赚钱，还是靠假设赚钱。",
      next:
        "下一节会进一步把回测拉近真实交易，讨论滑点、成本和流动性这些最常让纸面利润缩水的因素。",
      takeaway:
        "回测框架的价值不在于把过去算得更漂亮，而在于让你更早看清策略在现实中会怎样被约束。",
      terms: ["前视偏差", "交易成本", "滑点", "时间对齐"],
      quizFocus:
        "优先把回测理解成真实性工程，而不是漂亮历史曲线的生成器。",
      applyPriority:
        "看回测结果前，先检查框架里关于时点、成交和约束的假设是否真的接近现实。",
    },
    {
      slug: "slippage-costs-and-liquidity",
      title: "滑点、成本与流动性",
      titleEn: "Slippage, Costs, and Liquidity",
      learningObjective:
        "理解策略从纸面收益走向真实收益时，成本与流动性约束为什么往往才是最终分水岭。",
      learningObjectiveEn:
        "Understand why costs and liquidity often determine whether paper profits survive in reality.",
      overview:
        "很多量化策略在研究阶段看起来很有 alpha，一到实盘却迅速失色。原因常常不是信号突然消失，而是它原本就只在忽略成本、滑点和流动性冲击的前提下成立。",
      whyImportant:
        "真实交易从来不是无摩擦世界。尤其在高频、短持有期和低流动性资产上，摩擦本身往往比信号强弱更决定策略能不能活下来。",
      connection:
        "这一节把上一节的回测真实性继续往下推，专门讨论那些最容易被量化研究低估、但最会毁掉策略的现实约束。",
      intuition:
        "可以把交易成本想成你每次穿过一道门都要交的过路费。门走得越频繁、路越拥堵、你的体量越大，这笔费用对最终结果的侵蚀就越明显。",
      corePoints: [
        "滑点、手续费、冲击成本和成交不确定性都会系统性侵蚀纸面收益。",
        "流动性限制意味着不是所有看起来有机会的交易都真的能按预期规模完成。",
        "真正可交易的策略必须在成本和流动性约束下仍然保有足够边际优势。",
      ],
      pitfalls: [
        "只在低换手假设下估计成本，忽略调仓频率和真实成交环境会显著改变净收益。",
        "看见统计上有效的微小优势就默认可以放大交易规模，忽略容量限制会让优势迅速消失。",
      ],
      examples: [
        "一个日内价差策略在忽略滑点时可能看起来极其漂亮，但一旦按真实盘口冲击估算，净收益可能大幅缩水甚至转负。",
        "一个中小盘股票信号在小资金账户上可能成立，但当资金规模上来后，成交冲击和容量瓶颈会迅速暴露问题。",
      ],
      scenario:
        "在高换手套利、事件驱动和低流动性资产策略中，真正有经验的研究者往往最先问的是‘这东西能不能交易’，而不是‘这东西理论上有没有 alpha’。",
      next:
        "下一节会继续讨论研究与回测里那些最常见的失败模式，看清错误究竟是怎样一步步被包装成成功的。",
      takeaway:
        "纸面利润只有在穿过成本和流动性这两道门后还能站住，才更接近真实利润。",
      terms: ["滑点", "交易成本", "收益率", "风险预算"],
      quizFocus:
        "优先把成本和流动性看成策略可行性的核心，而不是回测里附带修补的细节。",
      applyPriority:
        "评估策略前景时，先问净收益在真实滑点和容量约束下是否仍然成立。",
    },
    {
      slug: "bias-control-and-failure-modes",
      title: "偏差控制与失败模式",
      titleEn: "Bias Control and Failure Modes",
      learningObjective:
        "理解量化研究里最常见的偏差和失败模式，以及它们如何一步步把研究者带进错误自信。",
      learningObjectiveEn:
        "Understand the common biases and failure modes that create false confidence in quant research.",
      overview:
        "很多失败的量化研究并不是因为研究者完全不懂，而是因为每一步都只偏了一点点：数据时间线稍微错一点、样本筛选稍微松一点、参数试探稍微多一点，最后整套结论就会显得非常完整却并不真实。",
      whyImportant:
        "偏差控制的意义，在于让你更早识别哪些结果看起来像发现，其实只是研究流程中的结构性自欺。",
      connection:
        "这一节是回测与执行部分的收束，把回测框架和成本约束重新汇总到一个更根本的问题上：你究竟如何避免自己被研究结果骗到。",
      intuition:
        "这有点像财务审计。真正重要的不是把报表做得更好看，而是尽快发现有哪些地方可能一直在系统性误导你。",
      corePoints: [
        "前视偏差、生存者偏差、参数窥探和样本污染，是量化研究中最常见且最危险的结构性问题。",
        "失败模式往往不会大张旗鼓出现，而是以‘结果有点太好’‘逻辑似乎也说得通’的形式慢慢积累。",
        "一个成熟研究流程的价值，在于它能持续暴露这些问题，而不是靠研究者的直觉碰巧避开。",
      ],
      pitfalls: [
        "看到结果异常优秀时先感到兴奋，而不是先怀疑研究流程是不是哪里太理想化了。",
        "把偏差控制当作后处理步骤，而不是一开始就嵌进研究框架里。",
      ],
      examples: [
        "如果你只保留现在仍然活跃的股票样本做长期研究，生存者偏差会让历史收益和稳定性看起来比真实情况好得多。",
        "如果每次参数调完都继续在同一套样本上看效果，最终留下来的‘最优参数’往往只是对样本噪声最熟悉。",
      ],
      scenario:
        "在任何中长期系统研究里，最值得培养的能力都不是‘把结果做得更好看’，而是尽快识别研究流程里最可能制造错觉的环节。",
      next:
        "接下来课程会从单个策略推进到组合与风险管理，讨论即使单个研究成立，也不意味着资金层面就自然可承受。",
      takeaway:
        "量化研究里最危险的不是暂时没有结果，而是流程已经偏了却仍然不断给你看起来更强的结果。",
      terms: ["前视偏差", "生存者偏差", "过拟合", "样本外验证"],
      quizFocus:
        "优先建立对偏差和研究失败模式的警觉，而不是只沉迷于更强的历史表现。",
      applyPriority:
        "看到过于完美的结果时，先回头审研究流程，而不是先追加更多资金和信心。",
    },
  ],
};

const quantCourseV2Chapter4: ExampleChapterSeed = {
  slug: "portfolio-and-risk",
  title: "组合与风险",
  titleEn: "Portfolio and Risk",
  subchapters: [
    {
      slug: "position-sizing-and-risk-budgeting",
      title: "仓位管理与风险预算",
      titleEn: "Position Sizing and Risk Budgeting",
      learningObjective:
        "理解仓位管理不是附属步骤，而是把研究观点转成真实资金暴露的关键接口。",
      learningObjectiveEn:
        "Understand position sizing as the core interface between research views and real capital exposure.",
      overview:
        "很多研究者很会做信号，却在资金分配这一层暴露短板。仓位管理决定的，不只是你押得有多大，还决定你在连续错误、极端波动和不确定环境里能不能活下来。",
      whyImportant:
        "一个方向判断即使正确，只要仓位安排失衡，也可能在实现收益之前就先经历无法承受的资金波动。量化研究若不走到资金层，就还没真正闭环。",
      connection:
        "这一节把单个信号、单个策略推进到真实资金配置层面，是从研究正确走向资金可承受的第一步。",
      intuition:
        "可以把仓位管理想成给不同观点分配话语权。不是每个观点都值得同样大声，也不是每个声音都适合同样的风险预算。",
      corePoints: [
        "仓位管理的本质是分配风险，而不只是分配名义资金比例。",
        "风险预算帮助你把组合中的风险暴露按重要性和承受能力拆开管理。",
        "真正成熟的仓位设计关注的是连续错误发生时系统还能否保持生存和调整空间。",
      ],
      pitfalls: [
        "看到单个信号胜率高就给过大权重，忽略它和其他暴露之间的联动风险。",
        "把仓位管理理解成事后修补，而不是策略设计时就该同步考虑的核心环节。",
      ],
      examples: [
        "同样两个看起来都不错的策略，如果一个波动远高于另一个，却被赋予相同权重，组合真实风险往往会严重失衡。",
        "高把握度观点如果在高不确定环境下没有留出回撤缓冲，正确方向也可能因为仓位过重而带来过早止损。",
      ],
      scenario:
        "在多因子组合、CTA 配置和跨资产研究里，仓位管理往往比单个信号多赚几个百分点更决定组合长期生命力。",
      next:
        "下一节会进一步讨论组合层面的分散化、相关性与回撤，看看风险为什么常常不是单个策略内部产生的。",
      takeaway:
        "仓位管理的核心，不是把好观点压得更大，而是让资金暴露和可承受风险真正匹配。",
      terms: ["仓位管理", "风险预算", "最大回撤", "相关性"],
      quizFocus:
        "优先把仓位管理理解成风险分配问题，而不是简单权重分配问题。",
      applyPriority:
        "分配资金前，先问组合到底在承担什么风险、能承受多大回撤，而不是只看哪个信号更有把握。",
    },
    {
      slug: "diversification-correlation-and-drawdown",
      title: "分散化、相关性与回撤",
      titleEn: "Diversification, Correlation, and Drawdown",
      learningObjective:
        "理解分散化为什么不是简单多放几个策略，而是要管理相关性结构和回撤路径。",
      learningObjectiveEn:
        "Understand diversification as managing correlation structure and drawdown paths rather than merely adding more strategies.",
      overview:
        "很多组合看起来有很多资产、很多策略，但一到压力环境里却一起下跌。原因往往不是数量不够，而是这些暴露本质上还是在押同一种市场逻辑。这一节要解决的，就是分散化到底该怎么被真正理解。",
      whyImportant:
        "分散化失败通常不是因为你没有配置够多，而是因为你没有看穿这些配置背后的共同驱动因素。数量上的分散，并不自动等于风险上的分散。",
      connection:
        "这一节延续仓位管理，把组合风险从单点分配继续推进到结构联动层。",
      intuition:
        "可以把组合想成一支乐队。表面上乐器很多，不代表声音就一定更丰富；如果所有乐器都在同一个频段发力，结果仍然会显得单调而且容易失控。",
      corePoints: [
        "相关性决定了不同暴露在压力环境中会不会一起失效，是组合分散化的核心变量。",
        "回撤路径比终点收益更能体现真实资金体验，因为投资者是在过程中承受风险而不是在终点承受风险。",
        "真正有效的分散化关注的是驱动逻辑是否不同，而不只是资产名称是否不同。",
      ],
      pitfalls: [
        "把不同标的或不同因子数量的增加误认为已经实现了有效分散。",
        "只看长期平均收益，忽略组合在压力阶段是否会出现同步踩踏和深度回撤。",
      ],
      examples: [
        "两个策略表面上一个做成长、一个做景气，但如果都高度依赖同一种风险偏好环境，组合里仍可能在风险切换时一起受损。",
        "一组低相关策略即使单独看都不算最强，组合后的资金曲线却往往比堆叠多个高相关强信号更稳。",
      ],
      scenario:
        "在多资产配置、股票风格轮动和 CTA 组合管理中，看透相关性结构常常比继续寻找新信号更有价值。",
      next:
        "最后一节会继续讨论监控和适应问题，因为相关性和回撤结构并不是永远固定不变的。",
      takeaway:
        "分散化真正要管理的不是数量，而是不同暴露在坏时候会不会一起出问题。",
      terms: ["相关性", "最大回撤", "风险预算", "仓位管理"],
      quizFocus:
        "优先把分散化理解成风险结构管理，而不是简单增加策略数量。",
      applyPriority:
        "做组合判断时，先检查不同暴露在压力环境中是否仍然高度同向，而不是只看平时的平均收益。",
    },
    {
      slug: "monitoring-regime-change-and-adaptation",
      title: "监控、市场状态与策略适应",
      titleEn: "Monitoring, Regime Change, and Adaptation",
      learningObjective:
        "理解策略上线后为什么还需要持续监控，以及市场状态变化会怎样让原本有效的逻辑逐步失效。",
      learningObjectiveEn:
        "Understand why live strategies require ongoing monitoring and adaptation under changing regimes.",
      overview:
        "很多量化策略的问题，不是它一开始就没用，而是市场状态变了之后，研究者还在用旧世界的逻辑看新世界。这一节要讨论的，就是如何建立持续监控和适应意识，而不是把回测当成永久许可。",
      whyImportant:
        "市场不是静态环境。风格偏好、波动水平、参与者结构和流动性条件都会变，原本成立的信号和风控规则也可能因此逐步失去抓手。",
      connection:
        "这一节是组合与风险部分的收束，把静态配置进一步推进到动态监控和更新层。",
      intuition:
        "可以把策略想成一套在某种天气下表现良好的装备。天气变了，装备也许还能用，但你必须知道什么时候该调整、什么时候该更换，而不能把旧经验当成永恒规律。",
      corePoints: [
        "策略上线后需要持续监控收益结构、风险暴露和执行质量，而不是只看净值是否还在上涨。",
        "市场状态变化会重写信号有效性、相关性结构和容量约束。",
        "适应并不等于频繁追新，而是知道哪些变化值得调整、哪些波动只是正常噪声。",
      ],
      pitfalls: [
        "看到短期回撤就立刻推翻策略，忽略正常波动和真正结构失效之间有区别。",
        "长期坚持旧模型不动，忽略环境已经变化到原假设不再适用。",
      ],
      examples: [
        "一个动量策略在趋势明显阶段表现很好，但当市场快速切换到高波动均值回归环境时，如果还用旧参数和旧风控，回撤会明显放大。",
        "某些低频因子在交易拥挤后，可能不是完全失效，而是收益兑现速度、容量上限和回撤结构都发生了变化，这就需要监控而不是盲目坚持。",
      ],
      scenario:
        "在任何真实资金管理场景中，研究价值不只体现在你发现了什么，还体现在你能不能在环境变化后足够早地看见什么已经变了。",
      next:
        "最后一章会把量化研究放回更大的职业与应用视角，讨论策略家族、研究工作流和未来边界。",
      takeaway:
        "量化策略不是一次性被证明就永久有效，它必须在持续监控和环境变化中被重新理解。",
      terms: ["最大回撤", "相关性", "风险预算", "样本外验证"],
      quizFocus:
        "优先建立持续监控与环境适应意识，而不是把回测结果当成永久结论。",
      applyPriority:
        "策略上线后，先监控结构性变化是否出现，再决定是继续持有、调整参数还是停用逻辑。",
    },
  ],
};

const quantCourseV2Chapter5: ExampleChapterSeed = {
  slug: "applications-and-professional-judgment",
  title: "应用与专业判断",
  titleEn: "Applications and Professional Judgment",
  subchapters: [
    {
      slug: "strategy-families-and-use-cases",
      title: "策略家族与应用场景",
      titleEn: "Strategy Families and Use Cases",
      learningObjective:
        "理解不同量化策略家族各自适合解决什么问题，以及为什么不存在一套在所有环境里都最优的通用方法。",
      learningObjectiveEn:
        "Understand the major strategy families and why no single quant approach dominates every environment.",
      overview:
        "量化金融不是只有一种做法。动量、价值、均值回归、套利、事件驱动、宏观配置、CTA 等策略家族各自依赖不同的市场结构和行为逻辑。理解它们的差异，比盲目寻找“最强策略模板”更重要。",
      whyImportant:
        "如果你不区分策略家族，就容易在错误的问题上使用错误的工具。很多研究失败，并不是信号本身差，而是它从一开始就被放进了不适合的场景里。",
      connection:
        "这一节把前面的研究、验证、回测和风险管理重新带回应用层，帮助你把方法和场景配对。",
      intuition:
        "可以把不同策略家族想成不同运动项目。它们都属于“比赛”，但速度、节奏、装备和胜负逻辑完全不同，不能拿同一套训练方式对待。",
      corePoints: [
        "不同策略家族依赖的市场行为、容量限制和风险暴露结构并不相同。",
        "策略设计首先要匹配问题类型，而不是先追求某种流行模板。",
        "真正专业的判断，往往来自知道某类方法适合什么、不适合什么。",
      ],
      pitfalls: [
        "把某一类成功案例当成可复制到所有市场和时间尺度的通用方案。",
        "因为某种方法最近流行，就忽略它背后的容量、执行和环境适用性边界。",
      ],
      examples: [
        "趋势跟踪在方向性强、持续性高的环境里可能表现优异，但若市场进入频繁震荡期，它的优点很可能立刻转成缺点。",
        "事件驱动策略也许统计上不复杂，但对时间线、数据质量和执行效率要求极高，不适合直接用中低频选股逻辑去套。",
      ],
      scenario:
        "在做个人研究、团队研发或产品包装时，越能清楚地区分策略家族和场景边界，越不容易在一开始就把问题问错。",
      next:
        "下一节会从策略本身走向研究工作流，讨论一套专业量化研究究竟是怎样被组织起来的。",
      takeaway:
        "量化方法真正的专业性，不在于掌握了多少策略名字，而在于知道不同方法各自该被放在什么场景里。",
      terms: ["因子", "收益率", "相关性", "风险预算"],
      quizFocus:
        "优先建立策略家族与应用场景匹配意识，而不是追求单一万能方法。",
      applyPriority:
        "开始做策略前，先问这类方法最适合解决的到底是哪类市场问题。",
    },
    {
      slug: "research-workflows-and-tooling",
      title: "研究工作流与工具化",
      titleEn: "Research Workflows and Tooling",
      learningObjective:
        "理解专业量化研究为什么必须依赖可复用、可审计、可迭代的研究流程，而不是零散灵感堆积。",
      learningObjectiveEn:
        "Understand quant research as a reusable, auditable workflow rather than a pile of isolated insights.",
      overview:
        "优秀的量化研究者不只是会找信号，更会组织研究。数据准备、假设记录、实验比较、回测追踪、风险审查和结果复现，组成了一条完整工作流。没有这条流，再多想法也很难沉淀成持续能力。",
      whyImportant:
        "很多团队的问题不在于缺想法，而在于每次研究都像重新发明轮子，结果难复现、难协作、难迭代。工具化和流程化的价值，就在于让研究从个人灵感走向系统能力。",
      connection:
        "这一节把课程前面所有方法重新组织成研究流程视角，是从“会分析”走向“会持续做分析”的关键一步。",
      intuition:
        "可以把研究工作流想成实验室操作规范。天赋和灵感很重要，但如果样品记录、实验步骤和结果归档全靠临场发挥，长期产出就一定不稳定。",
      corePoints: [
        "可复现流程让研究结论更容易被检验、被继承和被改进。",
        "工具化的意义不是追求流程复杂，而是减少重复劳动和隐性错误。",
        "研究记录、版本管理和结果对比是把个人经验转成团队资产的关键环节。",
      ],
      pitfalls: [
        "每次研究都用临时脚本和手工步骤拼出来，结果一旦过一段时间连自己都复现不了。",
        "只记录最后表现最好的版本，忽略失败实验和中间决策过程，导致团队不断重复犯同样的错。",
      ],
      examples: [
        "同样一个因子研究，如果保留了完整的数据口径、参数版本和样本切分记录，后来的人就能更快判断它为什么有效或失效。",
        "一个团队若把回测、成本假设和风险审查都标准化，新成员即使没有完全相同的经验，也能更快接上已有研究能力。",
      ],
      scenario:
        "在资产管理、量化团队和研究平台建设中，真正构成护城河的往往不是某个瞬时高收益策略，而是能持续产出、持续审查和持续迭代研究结果的工作流。",
      next:
        "最后一节会从职业判断和行业边界角度做收束，看看量化研究未来值得期待的地方和必须警惕的地方分别是什么。",
      takeaway:
        "量化研究的长期优势，不只来自单次灵感，而来自能把灵感变成流程、把流程变成资产。",
      terms: ["样本外验证", "交易成本", "风险预算", "最大回撤"],
      quizFocus:
        "优先把研究工作流理解成能力沉淀机制，而不是附加的流程负担。",
      applyPriority:
        "优化研究效率时，先找哪些环节最难复现、最容易出错，再决定如何工具化。",
    },
    {
      slug: "limits-ethics-and-the-future-of-quant",
      title: "量化研究的边界、伦理与未来",
      titleEn: "Limits, Ethics, and the Future of Quant",
      learningObjective:
        "建立对量化研究边界、职业伦理和未来演化方向的整体判断，而不是把量化神话化或简单化。",
      learningObjectiveEn:
        "Build a grounded view of the limits, ethics, and future direction of quantitative finance.",
      overview:
        "量化研究很容易被神话化，好像只要数据足够多、模型足够强，就一定能不断稳定赚钱。但现实世界里，市场会进化、优势会拥挤、数据会失真、风险会转移。这一节讨论的，就是如何在长期视角下理解量化的真正边界。",
      whyImportant:
        "只有同时看见机会和边界，你才能既不盲目乐观，也不轻易否定。真正长期有效的专业判断，往往来自对能力边界和责任边界的清醒认识。",
      connection:
        "这一节为整门课收束，把前面的研究方法、回测框架、风险管理和应用判断重新拉回到长期职业视角。",
      intuition:
        "可以把量化行业想成一场不断变化的竞技。规则会变、对手会学、场地会换，昨天的优势不会自动变成明天的优势。",
      corePoints: [
        "量化研究的边界来自市场适应、容量限制、数据偏差和策略拥挤等现实因素。",
        "职业伦理不仅体现在合规层面，也体现在你如何处理数据、如何表达结果、如何面对不确定性。",
        "未来量化的竞争力，往往更来自研究框架、风险管理和系统化能力，而不只是单点预测技巧。",
      ],
      pitfalls: [
        "把量化理解成只要模型更复杂就会自然变强，忽略市场本身会反制和演化。",
        "为了讲好结果故事而弱化不确定性、容量限制和风险边界，最终让研究表达脱离真实可执行性。",
      ],
      examples: [
        "一个过去有效的高频机会，随着更多参与者进入和基础设施升级，可能迅速被竞争挤平，这不是研究错了，而是环境在变。",
        "团队若只奖励漂亮回测而不奖励诚实暴露风险和边界，长期很容易把研究文化引向错误方向。",
      ],
      scenario:
        "无论是做个人研究、团队管理还是面向客户解释策略，真正值得长期坚持的不是‘永远找到最强 alpha’，而是建立一种对现实约束足够诚实的研究文化。",
      next:
        "到这里，这门课程已经完成。接下来更重要的，是带着这条主线去看任何一个新策略：它的数据是否可靠、逻辑是否站得住、回测是否真实、风险是否可承受、边界是否被诚实表达。",
      takeaway:
        "量化研究真正成熟的标志，不是相信自己能预测一切，而是知道哪些可以系统化利用，哪些边界必须始终被尊重。",
      terms: ["样本外验证", "交易成本", "风险预算", "最大回撤"],
      quizFocus:
        "优先把量化的未来理解成能力、边界和伦理并存，而不是单向度的技术神话。",
      applyPriority:
        "做长期判断时，先看研究是否足够诚实地面对边界和风险，再看它讲出的机会有多诱人。",
    },
  ],
};

const quantCourseV2Seed: ExampleCourseSeed = {
  slug: "quant-finance-analysis",
  title: "量化金融分析与策略研究",
  titleEn: "Quantitative Finance: Research and Strategy",
  topic: "量化金融分析与策略研究",
  topicEn: "Quantitative Finance: Research and Strategy",
  description:
    "这门官方示例课从数据质量、信号设计、回测执行、组合风险到专业判断，系统讲清量化金融分析为什么不只是建模，更是一整套研究与决策方法。",
  descriptionEn:
    "This official sample course explains quantitative finance as a full research and decision discipline spanning data integrity, signal design, backtesting, portfolio risk, and professional judgment.",
  goals: [
    "理解量化研究从数据准备到策略判断的完整主线",
    "理解信号验证、回测真实性与风险管理之间的结构关系",
    "建立对量化方法边界、应用场景与长期职业判断的系统视角",
  ],
  goalsEn: [
    "Understand the full path from data preparation to strategy judgment",
    "Connect signal validation with realistic backtesting and risk management",
    "Build a systems-level view of quant boundaries, applications, and long-term judgment",
  ],
  chapters: [
    quantCourseV2Chapter1,
    quantCourseV2Chapter2,
    quantCourseV2Chapter3,
    quantCourseV2Chapter4,
    quantCourseV2Chapter5,
  ],
};

const quantLegacyLessonRedirects: Record<
  string,
  { chapterSlug: string; subchapterSlug: string }
> = {
  "research-foundations/market-data-and-research-hygiene": {
    chapterSlug: "research-foundations",
    subchapterSlug: "market-data-and-timeline-integrity",
  },
  "data-and-signals/data-cleaning-and-returns": {
    chapterSlug: "research-foundations",
    subchapterSlug: "return-series-and-feature-engineering",
  },
  "data-and-signals/factors-and-signal-validation": {
    chapterSlug: "signal-validation-and-factor-thinking",
    subchapterSlug: "economic-rationale-and-factor-intuition",
  },
  "strategy-and-risk/backtesting-and-bias-control": {
    chapterSlug: "backtesting-and-execution",
    subchapterSlug: "realistic-backtesting-frameworks",
  },
  "strategy-and-risk/portfolio-and-risk-metrics": {
    chapterSlug: "portfolio-and-risk",
    subchapterSlug: "diversification-correlation-and-drawdown",
  },
};

const powerCourseV2Chapter1: ExampleChapterSeed = {
  slug: "energy-conversion-foundations",
  title: "能量转换基础",
  titleEn: "Energy Conversion Foundations",
  subchapters: [
    {
      slug: "switches-storage-and-energy-flow",
      title: "开关、储能与能量流",
      titleEn: "Switches, Energy Storage, and Energy Flow",
      learningObjective:
        "理解电力电子并不是简单地“改变电压”，而是通过开关器件与储能元件协同安排能量在不同状态下的流动路径。",
      learningObjectiveEn:
        "Understand power electronics as controlled energy routing through switching devices and energy storage elements rather than simple voltage transformation.",
      overview:
        "本节从最底层的系统图景入手。你会看到功率开关、电感、电容和二极管并不是孤立元件，而是在不同开关状态下共同决定能量从哪里来、经过哪里、最后如何被送到负载。",
      whyImportant:
        "如果能量路径看不清，后面无论看到波形、损耗还是控制问题，都会像只看症状不看病因。很多设计误判，本质上都是从这里开始的。",
      connection:
        "这是整门课的第一块地基。后面的拓扑判断、PWM、环路设计和工程实现，都要建立在“看得懂能量怎么流”这件事上。",
      intuition:
        "可以把功率级想成一套高速调度系统。开关像交通灯决定什么时候放行，电感和电容像临时中转站，真正重要的不是器件摆在那里，而是它们是否在对的时刻承担了对的角色。",
      corePoints: [
        "功率开关的价值在于用导通和关断两种状态高效率地重新分配能量路径，而不是在线性区里硬扛功率。",
        "储能元件不是附属滤波件，而是把脉动输入转换成可用平均输出的关键中间层。",
        "理解一个功率级时，最先要做的不是套公式，而是画清每个开关状态下的电流路径和器件应力。",
      ],
      pitfalls: [
        "只记住器件名称和拓扑外形，却没有真的追踪不同状态下电流从哪里流到哪里。",
        "把电感和电容当成“让波形好看一点”的配件，忽略它们其实决定了能量如何被暂存和释放。",
      ],
      examples: [
        "在 Buck 变换器里，上管导通时输入给电感充能，下管或二极管续流时电感再把能量送给负载。真正要看懂的，不是元件清单，而是这两段路径为什么能接成连续输出。",
        "如果输出电容太小，负载看到的就不再是平滑电压，而会更直接暴露开关节点带来的脉动，这说明储能与缓冲角色没有被正确承担。",
      ],
      scenario:
        "无论是手机快充、电池供电、服务器电源还是电机驱动，只要涉及高效率能量转换，第一步都必须能把功率级的能量流图景在脑中立起来。",
      next:
        "接下来会继续讨论拓扑、极性与基本平衡关系，看看不同能量路径安排为什么会长成不同类型的变换器。",
      takeaway:
        "学电力电子的第一步，不是背拓扑名字，而是看懂每一种开关状态下能量究竟怎么走。",
      terms: ["电流路径", "储能元件", "开关频率", "器件应力"],
      quizFocus:
        "先从能量路径和器件角色去理解功率级，而不是先陷进局部公式和参数表里。",
      applyPriority:
        "每个开关状态下的电流路径是否清楚、储能元件承担了什么角色、器件应力落在什么位置。",
    },
    {
      slug: "topologies-polarity-and-balance-laws",
      title: "拓扑、极性与平衡规律",
      titleEn: "Topologies, Polarity, and Balance Laws",
      learningObjective:
        "理解不同拓扑为什么会表现出升压、降压、隔离或极性反转等差异，以及伏秒平衡、电荷平衡这类规律在其中扮演什么角色。",
      learningObjectiveEn:
        "Understand why different converter topologies produce buck, boost, isolation, or polarity inversion behavior and how balance laws explain their steady-state operation.",
      overview:
        "本节不把拓扑当成“电路图鉴”，而是把它们看成对能量路径的不同组织方式。你会开始理解，为什么有的电路天然适合降压，有的更擅长升压，有的则能在隔离和安全边界上提供优势。",
      whyImportant:
        "如果只背结论而不理解拓扑后的约束，你会在面对新工况时很容易失去判断。真正的设计能力，不是知道答案，而是知道答案为什么只能这样长出来。",
      connection:
        "上一节建立了能量流视角，这一节把它进一步抽象成拓扑结构与平衡规律，为后面的 PWM 和动态分析建立更稳的骨架。",
      intuition:
        "可以把拓扑想成不同的“能量搬运路线图”。路线一变，路径方向、储能顺序和输出极性就会一起变化。伏秒平衡和电荷平衡像交通规则，告诉你长期运行时这些路线必须满足什么条件。",
      corePoints: [
        "拓扑差异本质上是开关位置、储能顺序和回路方向差异，最终表现为升降压能力、极性关系和隔离属性不同。",
        "伏秒平衡和电荷平衡不是孤立公式，而是稳态下电感电容不能无限积累误差的基本约束。",
        "看懂拓扑时要同时关注平均输出关系和器件承受的电压电流应力，不能只盯着理想转换比。",
      ],
      pitfalls: [
        "把拓扑理解成静态公式模板，只记得输入输出比值，却忽略了应力、纹波和隔离代价。",
        "看到某个电路能实现目标电压就直接采用，没有先判断它在当前功率等级和约束下是否合适。",
      ],
      examples: [
        "Boost 之所以能升压，不是因为某个神秘增益，而是因为电感先储能后抬高输出路径中的有效电压；这背后其实是能量时序安排的结果。",
        "Flyback 之所以常用于隔离小功率场景，不只是因为结构简单，更因为它把储能与隔离结合在同一磁性元件里，但这也带来了不同的纹波和应力特征。",
      ],
      scenario:
        "当你需要在空间、成本、效率、隔离和输出范围之间做判断时，真正决定方案方向的，往往不是元件品牌，而是拓扑层面的选择。",
      next:
        "有了拓扑和稳态规律的基础，下一节就可以继续讨论 PWM、纹波和导通模式，看看时间控制怎样把这些结构真正驱动起来。",
      takeaway:
        "拓扑选择的本质，是选择一种满足目标约束的能量组织方式，而不是从电路图库里挑一张最熟的图。",
      terms: ["伏秒平衡", "电荷平衡", "纹波", "器件应力"],
      quizFocus:
        "把拓扑理解成能量路径与约束的组合选择，而不是孤立的公式模板。",
      applyPriority:
        "拓扑带来的极性、隔离、器件应力和稳态平衡条件是否都与目标工况匹配。",
    },
    {
      slug: "pwm-ripple-and-conduction-modes",
      title: "PWM、纹波与导通模式",
      titleEn: "PWM, Ripple, and Conduction Modes",
      learningObjective:
        "理解 PWM 如何通过时间比例调节平均输出，以及纹波与导通模式为什么会直接影响后续控制和器件设计。",
      learningObjectiveEn:
        "Understand how PWM controls average behavior through time proportion and why ripple and conduction mode strongly affect control and hardware design.",
      overview:
        "本节聚焦功率级最直观的控制抓手：PWM。重点不是只背理想占空比关系，而是看清高频开关动作怎样在平均意义上变成输出电压、电流和纹波特征。",
      whyImportant:
        "很多工程判断都依赖你是否知道系统当前处在连续导通还是断续导通、纹波大小是否合理、占空比变化到底意味着什么。如果这层没有立住，后面的控制设计很容易“看起来会，实际上偏”。",
      connection:
        "前两节说明了能量怎么走、拓扑为什么成立，这一节开始解释系统是如何被时间控制真正驱动起来的。",
      intuition:
        "可以把 PWM 想成非常快地分配“放行时间”。放行多久、间隔多久，不只是影响平均输出，还会改变电感电流是不是断掉、纹波是不是可控，以及后面的控制对象看起来像什么。",
      corePoints: [
        "占空比决定了一个周期内不同开关状态各自持续多久，因此直接塑造平均输出与能量传递节奏。",
        "纹波不是可有可无的小细节，它会影响损耗、应力、输出品质和控制模型有效性。",
        "导通模式一旦改变，功率级的稳态关系和小信号特性都可能跟着变，不能把不同模式混为一谈。",
      ],
      pitfalls: [
        "只记住理想连续导通公式，忽略轻载、器件压降和模式切换会让关系发生偏移。",
        "把提高开关频率当成万能解，却没有同步评估开关损耗、磁性元件损耗和 EMI 是否一起恶化。",
      ],
      examples: [
        "Buck 在连续导通下常见地接近输出电压等于输入电压乘占空比，但一到轻载断续导通，这个简单关系就不再足够。",
        "为了减小输出纹波而把频率提得很高，可能让磁性件变小，却同时把开关损耗和噪声问题一起推了上去。",
      ],
      scenario:
        "从车载 DC-DC 到服务器 POL，再到逆变器调制，只要你在用时间比例塑造平均行为，就一定会碰到 PWM、纹波和导通模式这组三连问题。",
      next:
        "接下来课程会从功率级过渡到建模与控制，讨论这些平均行为如何被抽象成可分析、可设计的控制对象。",
      takeaway:
        "PWM 真正控制的不是一个公式里的字母，而是一整套能量节奏、纹波水平和导通模式。",
      terms: ["占空比", "纹波", "导通模式", "开关频率"],
      quizFocus:
        "把 PWM 理解成对能量节奏和导通模式的时间控制，而不是只盯着静态转换比。",
      applyPriority:
        "系统当前处于哪种导通模式、纹波水平是否合理，以及占空比变化会把哪些器件边界一并推高。",
    },
  ],
};

const powerCourseV2Chapter2: ExampleChapterSeed = {
  slug: "modeling-and-control",
  title: "建模与控制",
  titleEn: "Modeling and Control",
  subchapters: [
    {
      slug: "average-models-and-small-signal-intuition",
      title: "平均模型与小信号直觉",
      titleEn: "Averaged Models and Small-Signal Intuition",
      learningObjective:
        "理解为什么要把高频开关系统转成平均模型和小信号模型，以及这种抽象如何帮助我们建立控制直觉。",
      learningObjectiveEn:
        "Understand why switching systems are converted into averaged and small-signal models and how these abstractions create useful control intuition.",
      overview:
        "本节把关注点从波形表面拉到控制对象本身。你会看到，平均模型并不是为了逃避真实波形，而是为了在复杂开关行为中抓住最影响控制设计的那部分结构。",
      whyImportant:
        "如果没有模型，控制设计就很容易退化成试错；如果模型理解错了，又会把参数调节建立在错误对象上。两种情况最后都会让系统表现不稳定。",
      connection:
        "前面讲了能量路径和 PWM，这一节则把这些行为压缩成更适合分析的形式，为后面的补偿和稳定性判断打基础。",
      intuition:
        "可以把平均模型想成把高频抖动先“眯着眼看远一点”，先看清整体趋势；小信号模型则像在某个工作点附近轻轻推一把，看看系统会怎么回弹。",
      corePoints: [
        "平均模型帮助我们从高速开关细节里抽出稳态关系和主要动态结构，是控制分析的第一层桥梁。",
        "小信号模型关注的是工作点附近的小扰动传播，因此特别适合讨论带宽、极点、零点和补偿。",
        "模型不是越复杂越好，关键是它是否保留了你当前要解决的问题所需的主导动态。",
      ],
      pitfalls: [
        "把平均模型当成对真实系统的完整替代，忽略它天然会隐藏部分高频细节和寄生效应。",
        "没有先确认工作点和导通模式，就直接套用小信号结论，结果模型前提已经变了。",
      ],
      examples: [
        "同一个 Buck，在重载连续导通和轻载断续导通下，控制对象的样子并不完全一样。如果模型不区分工况，补偿设计就容易偏。",
        "有时实验波形里看到振铃，但平均模型里并不明显，这不是模型没用，而是说明你面对的是寄生参数主导的高频现象，需要换观察层级。",
      ],
      scenario:
        "工程上只要你要做环路设计、动态优化或仿真验证，就需要知道什么时候该看平均模型，什么时候该回到真实波形和寄生细节。",
      next:
        "理解模型之后，下一节会真正进入反馈与补偿，讨论怎样利用这些模型去设计能跑得稳、响应也够快的控制环。",
      takeaway:
        "模型的价值，不是把真实系统变简单，而是让你在正确层级上看见主导动态。",
      terms: ["平均模型", "小信号模型", "导通模式", "交越频率"],
      quizFocus:
        "先判断当前需要哪个层级的模型，再讨论控制参数和波形结果。",
      applyPriority:
        "模型假设对应的工作点、导通模式和主导动态是否与真实工况一致。",
    },
    {
      slug: "feedback-and-compensator-design",
      title: "反馈与补偿设计",
      titleEn: "Feedback and Compensator Design",
      learningObjective:
        "理解反馈控制在电力电子里的任务，以及补偿器为什么要在速度、稳定性和噪声敏感性之间做平衡。",
      learningObjectiveEn:
        "Understand the role of feedback in power converters and why compensation balances speed, stability, and noise sensitivity.",
      overview:
        "本节进入控制设计核心。功率级本身只是被控对象，要让输出在输入波动和负载变化下仍然守住目标值，就必须建立合适的反馈和补偿结构。",
      whyImportant:
        "环路没有设计好时，系统可能稳态看起来没问题，但一遇到负载阶跃、输入扰动或采样延迟就会暴露振荡、过冲或者恢复过慢的问题。",
      connection:
        "上一节给了你分析对象，这一节开始把对象变成真正可调的系统，是从“理解”迈向“设计”的关键一步。",
      intuition:
        "反馈环有点像开车修方向。不是偏了就越猛越好，而是要看这辆车本身有多重、反应有多慢、方向盘多灵敏，然后决定修正动作该多快、多大。",
      corePoints: [
        "补偿设计的核心不是把带宽一味拉高，而是让环路在目标速度下仍然保有足够稳定裕度。",
        "交越频率、相位裕度和闭环响应彼此相关，不能只盯一个指标就判断设计好坏。",
        "控制环设计必须考虑采样、调制、功率级动态和噪声，一旦只看其中一层，结果往往会失真。",
      ],
      pitfalls: [
        "看到响应慢就一味追更高带宽，却没先判断噪声、采样延迟和功率级极点是否允许这么做。",
        "把补偿器调参当成经验手感，忽略每一次参数变化其实都在重写整条环路的增益和相位分布。",
      ],
      examples: [
        "一个看起来“反应很快”的电源，如果相位裕度太低，负载一变就可能出现连续振铃，用户看到的反而是不稳定。",
        "有些方案在仿真里很好看，但实物上采样延迟和噪声把交越频率推到了危险区域，这时问题不在补偿公式本身，而在模型和实现脱节。",
      ],
      scenario:
        "服务器电源、车载电源、工业电源几乎都要在动态响应和稳定性之间做平衡，这也是为什么补偿设计始终是电源工程的核心能力之一。",
      next:
        "下一节会继续把视角拉宽，专门讨论稳定性、瞬态和环路指标如何一起判断，而不是只看单个波形结论。",
      takeaway:
        "补偿设计不是把环路调快，而是让速度、稳定性和实现边界一起过关。",
      terms: ["补偿器", "交越频率", "相位裕度", "闭环响应"],
      quizFocus:
        "把反馈设计理解成多目标平衡问题，而不是单纯追求更快的响应。",
      applyPriority:
        "目标带宽、稳定裕度、采样与调制延迟、噪声水平是否在同一套可实现边界内。",
    },
    {
      slug: "stability-transient-and-loop-targets",
      title: "稳定性、瞬态与环路指标",
      titleEn: "Stability, Transients, and Loop Targets",
      learningObjective:
        "理解为什么稳定性判断不能只靠“有没有振荡”，以及瞬态响应、裕度和目标指标之间该如何一起看。",
      learningObjectiveEn:
        "Understand why stability is more than the absence of oscillation and how transient response, margins, and loop targets must be judged together.",
      overview:
        "本节专门讲“怎么看结果”。很多人看到波形不振荡就以为稳定，看到恢复很快就以为环路优秀，但真实工程里，稳定性其实是多个指标共同定义出来的。",
      whyImportant:
        "如果判断标准太粗糙，你就会把脆弱系统误认为合格系统。很多现场问题恰恰来自这种“看起来没事”的错觉。",
      connection:
        "这节相当于把前面的模型与补偿重新汇总成工程判断语言，帮助你从“会设计”进一步走向“会验收”。",
      intuition:
        "判断稳定性有点像评估桥梁安全。不是桥今天还没塌就叫安全，而是要看它在风、载荷和长期疲劳下还有多少余量。",
      corePoints: [
        "稳定性不只是“不振荡”，还包括是否有足够余量应对参数漂移、负载变化和实现误差。",
        "瞬态响应快慢、过冲大小和恢复时间，需要和相位裕度、交越频率一起读，不能分开解释。",
        "一个真正可靠的环路目标，应该明确性能要求、工况范围和可接受边界，而不是只追单次测试漂亮。",
      ],
      pitfalls: [
        "看到某次波形不振荡就直接宣布环路稳定，没有去看工况变化、温度漂移和元件散差下是否仍然成立。",
        "把某个单一指标做到极致，却没有意识到它可能正以牺牲鲁棒性为代价。",
      ],
      examples: [
        "两个设计都能在标称工况下恢复输出，但其中一个一到低温和轻载就开始边缘振铃，这说明稳定性余量并不真正充足。",
        "有些电源负载阶跃看起来很快，但代价是更高的过冲和更差的噪声敏感性，这时“快”本身不能直接等于“好”。",
      ],
      scenario:
        "当设计进入评审、验证和量产阶段时，真正拉开差距的不是谁会画波形，而是谁能定义出经得起工况变化的环路目标。",
      next:
        "建模与控制部分完成后，课程会转向器件、磁性件与驱动，补上那些控制之外同样决定系统边界的硬件现实。",
      takeaway:
        "稳定性判断不是看系统今天有没有抖，而是看它在真实变化下还有多少余量不出事。",
      terms: ["相位裕度", "交越频率", "闭环响应", "器件应力"],
      quizFocus:
        "把稳定性理解成带余量的系统能力，而不是一次测试没有振荡。",
      applyPriority:
        "工况变化、元件散差和实现误差叠加后，环路是否仍保有可接受的瞬态和稳定余量。",
    },
  ],
};

const powerCourseV2Chapter3: ExampleChapterSeed = {
  slug: "devices-magnetics-and-drive",
  title: "器件、磁性件与驱动",
  titleEn: "Devices, Magnetics, and Drive",
  subchapters: [
    {
      slug: "power-semiconductors-and-device-tradeoffs",
      title: "功率半导体与器件权衡",
      titleEn: "Power Semiconductors and Device Tradeoffs",
      learningObjective:
        "理解 MOSFET、二极管以及宽禁带器件在效率、速度、应力和成本上的主要权衡，不再把器件选型看成只比参数表。",
      learningObjectiveEn:
        "Understand the main tradeoffs among MOSFETs, diodes, and wide-bandgap devices beyond simple datasheet comparison.",
      overview:
        "本节聚焦功率器件本身。你会看到器件选型从来不是简单地选“最小导通电阻”或“最高电压等级”，而是在速度、损耗、应力、驱动难度和成本之间做系统权衡。",
      whyImportant:
        "器件选错时，后面很多问题会被迫用控制和散热去补救，结果往往代价更高、效果还更差。",
      connection:
        "前面的控制和拓扑给出了结构，这一节开始回答一个更现实的问题：真正承受开关动作的器件，是否真的适合这套结构。",
      intuition:
        "器件选型有点像给高速运输系统选门和轨道。门开得快，不代表整体就最好；轨道承重高，也不等于损耗最低。关键是系统节奏和器件特性是否匹配。",
      corePoints: [
        "器件权衡通常发生在导通损耗、开关损耗、驱动难度、耐压能力和成本之间，不能只看单一最优参数。",
        "宽禁带器件带来的优势往往伴随更快 dv/dt、布局更敏感和驱动更苛刻的现实代价。",
        "真正有用的器件判断，是把数据表参数放回具体拓扑、频率、温度和应力环境里重新理解。",
      ],
      pitfalls: [
        "只看导通电阻或额定电流，就以为器件一定更优，忽略了栅电荷、反向恢复和动态应力也可能成为主要矛盾。",
        "看到新器件更快更先进，就默认整机一定更好，没有评估布局、驱动和 EMI 是否也要一起升级。",
      ],
      examples: [
        "为了降低导通损耗换更大芯片，可能在低频下受益，但如果开关频率较高，栅电荷和开关损耗又可能把收益吃回去。",
        "SiC 或 GaN 器件常能带来更高频率和更高效率潜力，但如果驱动和布局没有跟上，更快的边沿反而会把系统推向新的噪声和可靠性问题。",
      ],
      scenario:
        "在快充、电机驱动、车载电源和高密度服务器供电里，器件选择往往直接决定了后续散热、EMI 和成本结构。",
      next:
        "选完器件之后，下一节会把注意力转到磁性件，看看频率提升、能量储存和损耗分布为什么总绕不开电感和变压器。",
      takeaway:
        "器件选型不是挑一颗“最强”的开关，而是挑一颗最适合当前系统节奏和边界的开关。",
      terms: ["器件应力", "开关频率", "安全工作区", "栅极驱动"],
      quizFocus:
        "把器件选择理解成系统权衡，而不是只比较单一数据表指标。",
      applyPriority:
        "目标频率、应力边界、驱动能力和布局条件是否真的支持这颗器件的优势被发挥出来。",
    },
    {
      slug: "magnetics-inductors-transformers-and-core-loss",
      title: "磁性件、电感变压器与损耗",
      titleEn: "Magnetics, Inductors, Transformers, and Losses",
      learningObjective:
        "理解磁性件为什么常常决定体积、损耗和动态品质，以及电感、变压器与磁芯材料选择背后的系统逻辑。",
      learningObjectiveEn:
        "Understand why magnetics often dominate size, loss, and dynamic behavior, and how inductors, transformers, and core choices shape the whole design.",
      overview:
        "很多初学者会把磁性件看成“卷线的配角”，但在真实电力电子设计里，它们经常决定了系统体积、纹波、损耗、隔离能力和极限频率。",
      whyImportant:
        "磁性件理解不到位时，设计很容易陷入一种错觉：原理和控制都没问题，为什么实物还是又热、又吵、又大、又难调。",
      connection:
        "这一节承接前面的拓扑、频率和器件选择，把能量传递中的磁场这一层补齐，是从“电路图正确”走向“实物合理”的关键一步。",
      intuition:
        "可以把磁性件理解成能量和时间之间的翻译器。它既决定能量每次能存多少、放多快，也决定系统愿意承受多大的频率和多高的损耗。",
      corePoints: [
        "电感和变压器不仅影响储能和隔离，还会深刻改变纹波、动态响应以及器件承受的电压电流应力。",
        "磁芯损耗和铜损往往一起决定磁性件是否真正可用，单看一个指标很容易误判。",
        "漏感、耦合、磁通摆幅和材料选择，常常比纸面电感值本身更能决定真实波形和效率。",
      ],
      pitfalls: [
        "只按名义电感值选磁件，忽略磁芯损耗、铜损、温升和饱和边界。",
        "把磁性件做得过小，以为提高频率就能解决一切，结果热、损耗和 EMI 一起恶化。",
      ],
      examples: [
        "同样满足电感值要求的两只电感，在高频大纹波下，可能因为磁芯材料和绕组结构不同，最终温升和效率表现完全不同。",
        "Flyback 设计里如果漏感控制不好，开关瞬间的尖峰和吸收损耗就会迅速上升，这说明磁性件问题会直接变成器件和效率问题。",
      ],
      scenario:
        "无论是隔离电源、高密度快充还是高电流板载供电，磁性件往往都是尺寸、热和效率三角里的核心角色。",
      next:
        "理解磁性件之后，下一节会继续进入驱动与保护，讨论这些器件怎样被安全、快速、可控地驱动起来。",
      takeaway:
        "很多电力电子设计最后拼的不是谁公式更熟，而是谁更懂磁性件怎样把理想设计拖回真实世界。",
      terms: ["磁芯损耗", "铜损", "漏感", "储能元件"],
      quizFocus:
        "把磁性件理解成决定体积、损耗和动态边界的核心部件，而不是被动附件。",
      applyPriority:
        "磁芯损耗、铜损、漏感和温升是否都在目标频率与功率等级下可接受。",
    },
    {
      slug: "gate-drive-protection-and-safe-operating-margins",
      title: "栅极驱动、保护与安全边界",
      titleEn: "Gate Drive, Protection, and Safe Operating Margins",
      learningObjective:
        "理解为什么栅极驱动和保护电路并不是“外围细节”，而是决定器件能否安全稳定工作的关键部分。",
      learningObjectiveEn:
        "Understand why gate drive and protection circuits are central to safe, stable switching rather than peripheral details.",
      overview:
        "本节关注功率器件真正被驱动和保护的那一层。很多设计纸面上成立，但一到实物就出现直通、振铃、误触发或器件击穿，往往都和驱动与保护边界有关。",
      whyImportant:
        "器件能不能活下来，不只是看额定值高不高，还要看驱动速度、死区时间、过流保护和动态应力有没有处理好。",
      connection:
        "前一节说明了磁性件如何塑造能量传递，这一节则把注意力拉回开关动作本身，补上真实硬件最容易被低估的一层。",
      intuition:
        "功率器件就像高速门闸，栅极驱动是开门机制，保护电路是防撞和急停系统。门闸再好，如果开关时序和保护逻辑不对，整套系统一样会出事。",
      corePoints: [
        "栅极驱动不仅决定开关快慢，也会影响损耗、振铃、共模噪声和器件安全边界。",
        "死区时间、欠压保护、过流保护和软启动等机制，都是为了防止理想设计在真实瞬态中失控。",
        "安全工作区的理解必须放到动态工况里，单看静态额定值很容易高估器件余量。",
      ],
      pitfalls: [
        "只关注主功率回路，忽略驱动回路布局和驱动能力，结果器件明明参数够却仍然开关异常。",
        "把保护当成最后再补的保险丝，没有把它当成正常工作边界的一部分去设计。",
      ],
      examples: [
        "半桥里死区时间太短会导致直通风险，太长又会增加体二极管导通时间和损耗，这说明驱动不是越快越好。",
        "某些器件在双脉冲测试里表现正常，但放进整机后因寄生回路和驱动布局不同出现更大尖峰，这说明安全边界不能脱离实际系统讨论。",
      ],
      scenario:
        "高压快充、车载逆变、电机驱动和高频 DC-DC 里，驱动与保护设计常常决定产品是“能工作”还是“能长期工作”。",
      next:
        "器件层面补齐后，课程会转向效率、热和可靠性，讨论一套能工作的设计如何进一步变成长期可交付的设计。",
      takeaway:
        "在功率器件世界里，真正决定能不能安全工作的不只是额定值，还有驱动方式和保护边界。",
      terms: ["栅极驱动", "死区时间", "安全工作区", "双脉冲测试"],
      quizFocus:
        "把驱动与保护看成器件安全边界的一部分，而不是外围辅助电路。",
      applyPriority:
        "驱动能力、死区时间、保护阈值和动态应力是否共同保证了器件不会越过安全边界。",
    },
  ],
};

const powerCourseV2Chapter4: ExampleChapterSeed = {
  slug: "efficiency-thermal-and-reliability",
  title: "效率、热与可靠性",
  titleEn: "Efficiency, Thermal, and Reliability",
  subchapters: [
    {
      slug: "loss-breakdown-and-efficiency-budget",
      title: "损耗拆解与效率预算",
      titleEn: "Loss Breakdown and Efficiency Budget",
      learningObjective:
        "理解为什么效率分析不能只看总数字，而要把损耗拆回不同器件和不同机理，建立真正可行动的效率预算。",
      learningObjectiveEn:
        "Understand why efficiency must be broken down by device and mechanism rather than judged only by a single final number.",
      overview:
        "本节把“效率”从口号变成分析方法。你会看到总损耗并不神秘，它总能被拆回到导通、开关、磁性件、驱动和辅助电路等多个来源。",
      whyImportant:
        "如果不知道损耗大头在哪，你后续所有优化都容易像盲调。有时你以为自己在优化效率，实际只是在移动损耗分布。",
      connection:
        "前面讲器件、磁性件和驱动，这一节则把它们重新放到损耗视角下看清楚，帮助你从结构理解走向性能归因。",
      intuition:
        "效率预算有点像公司成本表。你不能只看利润率高低，而要知道钱到底花在人工、物流还是原材料上，优化才有方向。",
      corePoints: [
        "效率分析应把总损耗拆解到器件、磁性件、驱动和辅助环节，否则很难找到真正值得优化的点。",
        "导通损耗和开关损耗常常此消彼长，频率、器件尺寸和驱动策略都会改变最优点位置。",
        "一个好的效率预算不只是解释今天为什么热，还要能预测改参数后热和损耗会往哪里转移。",
      ],
      pitfalls: [
        "只盯着最终效率百分比，不去追问主要损耗来自哪里，因此优化动作经常打在次要矛盾上。",
        "看到某个器件损耗下降就以为整机一定更优，忽略它可能把别的损耗或 EMI 成本推高了。",
      ],
      examples: [
        "把开关频率提高后，磁性件体积可能变小，但开关损耗和驱动损耗会上升；这时效率预算能帮助你看清收益和代价是不是值得。",
        "换更低导通电阻的器件后，如果栅电荷明显变大，可能会在高频下让开关损耗增加，结果整机效率并没有提升多少。",
      ],
      scenario:
        "在快充、板载电源、高密度服务器供电和车载电源里，效率预算往往是结构选择、器件选择和散热设计共同使用的语言。",
      next:
        "知道损耗在哪之后，下一节会继续讨论热路径和封装，把这些损耗如何真正变成温升这件事看清楚。",
      takeaway:
        "效率优化真正要做的，不是追一个漂亮数字，而是找出损耗从哪里来、又会被优化动作推到哪里去。",
      terms: ["效率预算", "导通损耗", "开关损耗", "器件应力"],
      quizFocus:
        "把效率分析理解成损耗归因和权衡过程，而不是只盯最终百分比。",
      applyPriority:
        "主要损耗分布是否清楚，以及优化某一处后是否会把代价转移到别的环节。",
    },
    {
      slug: "thermal-paths-cooling-and-packaging",
      title: "热路径、散热与封装",
      titleEn: "Thermal Paths, Cooling, and Packaging",
      learningObjective:
        "理解温升为什么不是损耗之后的附带结果，而是需要和封装、铜箔、散热器与气流一起提前设计的系统问题。",
      learningObjectiveEn:
        "Understand temperature rise as a system problem that must be designed together with packaging, copper, heatsinking, and airflow.",
      overview:
        "本节把视角从“损耗是多少”推进到“热是怎么走的”。电力电子设计里，一个方案能不能长期稳定工作，往往不是被原理否决，而是被热路径否决。",
      whyImportant:
        "温度一旦上来，参数会漂移、寿命会缩短、可靠性会下降，很多原本成立的设计边界也会跟着被重新改写。",
      connection:
        "上一节已经知道哪里在发热，这一节继续追踪热量如何从结温一路走到环境，帮助你把损耗分析变成真正的工程判断。",
      intuition:
        "热路径可以理解成另一条“看不见的能量路径”。电能损耗一旦变成热，就必须通过封装、铜箔、界面材料、散热器和空气流动一路排出去。",
      corePoints: [
        "结温比外壳温度更接近器件真实承受的边界，热判断不能停留在表面温度好不好看。",
        "热路径设计包括封装、铜箔铺设、散热器、气流和装配条件，任何一环薄弱都会抬高系统温升。",
        "降额设计不是保守浪费，而是为工况波动、老化和环境变化预留长期可靠性空间。",
      ],
      pitfalls: [
        "只在实验室短时间测试里看温升，忽略封闭空间、环境温度上升和长期运行后热饱和的变化。",
        "把散热问题留到最后补救，结果被迫用更大体积、更高成本去弥补前面结构上的热路径短板。",
      ],
      examples: [
        "同样的损耗，如果热路径更短、铜箔更合理、气流更顺，结温可能明显下降，这说明热设计并不是事后加风扇那么简单。",
        "某器件在室温敞开条件下表现良好，但装入小型封闭壳体后温升迅速上升，这说明真实产品边界和实验台条件完全不是一回事。",
      ],
      scenario:
        "在高功率密度电源、车规模块和长期连续运行设备中，热设计往往直接决定额定功率、寿命和质保风险。",
      next:
        "热路径讲清之后，下一节会继续讨论失效模式、保护与寿命，看看温升、应力和保护策略如何一起决定长期可靠性。",
      takeaway:
        "真正的散热设计不是把热排出去这么简单，而是从一开始就别让热走进死胡同。",
      terms: ["结温", "热路径", "热阻", "降额设计"],
      quizFocus:
        "把温升问题理解成系统级热路径设计，而不是只看器件表面温度。",
      applyPriority:
        "热量从结点到环境的路径是否清楚，以及最坏工况下是否仍留有足够热余量。",
    },
    {
      slug: "failure-modes-protection-and-lifetime",
      title: "失效模式、保护与寿命",
      titleEn: "Failure Modes, Protection, and Lifetime",
      learningObjective:
        "理解电力电子系统常见失效模式从哪里来，以及保护设计和寿命判断为什么必须从系统边界出发。",
      learningObjectiveEn:
        "Understand common failure modes in power electronics and why protection and lifetime judgments must be made from a full-system perspective.",
      overview:
        "本节不只讨论“坏了以后怎么办”，而是讨论系统通常会怎样一步步逼近失效。很多失效并不是突然发生，而是应力、温度、噪声和边界误判长期积累的结果。",
      whyImportant:
        "如果只在样机正常时做判断，你会错过真正的长期风险。可靠性往往不是由标称状态决定，而是由最坏边界决定。",
      connection:
        "这一节把器件、热、损耗和保护重新汇总成长期运行视角，是从“能工作”走向“能交付、能量产、能长期稳定”的关键补足。",
      intuition:
        "可以把失效理解成系统不断被推向边界的过程。保护策略不是最后的急救包，而是一路上不断把系统从危险边缘拉回来的护栏。",
      corePoints: [
        "失效模式常常来自过压、过流、过热、误触发、磁件饱和和布局寄生共同叠加，而不是单点原因。",
        "保护机制必须结合真实故障传播路径来设计，否则保护可能触发太晚、太慢，甚至触发方式本身又制造新问题。",
        "寿命判断要看长期热循环、应力峰值和工作余量，而不是只看一次短时测试有没有通过。",
      ],
      pitfalls: [
        "把保护理解成加几个阈值比较器就够了，没有分析故障传播速度和器件真正承受的瞬态。",
        "看到样机工作正常就默认长期可靠，忽略了热循环、老化和边界工况才是寿命真正的试金石。",
      ],
      examples: [
        "某些过流事件传播得非常快，如果保护路径比功率路径慢太多，器件可能在保护生效前就已经越过安全工作区。",
        "一个设计在常温轻载下一切正常，但在高温满载和频繁启停下逐渐出现故障，说明寿命问题往往来自长期累积而不是单次异常。",
      ],
      scenario:
        "车载、工业和通信电源里，可靠性要求高的系统往往要把故障模式、保护路径和寿命边界放在设计前期一起考虑。",
      next:
        "完成效率、热和可靠性之后，课程最后一章会进入布局、EMI、调试与应用场景，把整机落地的最后一段链条补齐。",
      takeaway:
        "可靠性不是样机今天没坏，而是系统在长期边界下仍然知道如何不坏。",
      terms: ["安全工作区", "器件应力", "结温", "降额设计"],
      quizFocus:
        "把保护和寿命看成系统边界管理，而不是出事后的补丁。",
      applyPriority:
        "最坏工况下的故障传播路径、保护触发速度和长期应力余量是否都已被验证。",
    },
  ],
};

const powerCourseV2Chapter5: ExampleChapterSeed = {
  slug: "layout-emi-and-system-applications",
  title: "布局、EMI 与系统应用",
  titleEn: "Layout, EMI, and System Applications",
  subchapters: [
    {
      slug: "layout-parasitics-and-switching-loops",
      title: "布局、寄生参数与开关回路",
      titleEn: "Layout, Parasitics, and Switching Loops",
      learningObjective:
        "理解为什么原理图成立并不等于实物行为正确，以及布局与寄生参数如何在高频下重写波形和应力。",
      learningObjectiveEn:
        "Understand why a correct schematic does not guarantee correct hardware behavior and how layout and parasitics reshape switching behavior.",
      overview:
        "本节把视角正式拉到 PCB 和物理实现层。很多原理上成立的设计，一到板子上就冒出尖峰、振铃、误触发和 EMI，根源往往不在公式，而在回路和寄生参数。",
      whyImportant:
        "高频功率回路对布局极其敏感。只要回路面积、参考地和关键节点控制不好，整个系统就会表现得像“另一套电路”。",
      connection:
        "前面的内容基本都在回答系统应该怎样工作，这一节则专门回答：为什么它到了真实板子上会突然不按理想方式工作。",
      intuition:
        "可以把寄生参数看成原理图背后偷偷带着的“隐藏元件”。平时你看不见它们，但一到高 dv/dt、di/dt 的时刻，它们就会抢过话语权。",
      corePoints: [
        "布局决定了高频电流回路有多大、多紧凑，也就决定了寄生电感和噪声耦合有多严重。",
        "开关节点和高 di/dt 回路是物理实现中的敏感中心，必须优先缩短路径并控制参考返回路径。",
        "寄生参数不会凭空消失，真正有效的设计是承认它们、管理它们，而不是假设它们不存在。",
      ],
      pitfalls: [
        "认为只要原理图正确，板子行为就一定正确，忽略高频回路面积和寄生参数会直接改写波形。",
        "把布局优化理解成“走线整齐美观”，而不是围绕关键电流环和参考回路做电磁意义上的组织。",
      ],
      examples: [
        "同样的功率级，如果高频回路面积过大，关断瞬间更容易出现尖峰和振铃，这并不是元件坏，而是回路本身在说话。",
        "驱动回路和功率回路如果耦合过强，器件可能出现误导通，这说明寄生电感和共模噪声已经进入了控制层。",
      ],
      scenario:
        "高密度快充、车载板卡、逆变器驱动板和服务器电源模块里，布局能力常常直接决定样机从“能跑”到“能过测试”之间差了多远。",
      next:
        "布局问题理解之后，下一节会继续讨论测量、调试和验证，因为很多误判本身就来自测量方式不正确。",
      takeaway:
        "在高频功率电路里，板子不是原理图的搬运工，而是决定系统真实行为的另一半设计。",
      terms: ["寄生参数", "回路面积", "开关节点", "共模噪声"],
      quizFocus:
        "把布局视为系统行为的一部分，而不是原理图完成后的收尾工作。",
      applyPriority:
        "高频回路面积、关键返回路径和开关节点附近的寄生耦合是否已被明确控制。",
    },
    {
      slug: "measurement-debugging-and-validation",
      title: "测量、调试与验证",
      titleEn: "Measurement, Debugging, and Validation",
      learningObjective:
        "理解为什么电力电子调试不只是“看波形”，而是要同时判断测量方式、工况边界和系统因果链是否可靠。",
      learningObjectiveEn:
        "Understand measurement and debugging as disciplined validation of methods, conditions, and causal behavior rather than simply viewing waveforms.",
      overview:
        "本节讨论设计落地时最容易吃亏的一件事：测量。很多人以为示波器一接就能看到真相，但在高频高压高 di/dt 环境里，测量本身也可能制造错觉。",
      whyImportant:
        "如果测量方法错了，你可能会花很长时间优化一个根本不存在的问题，或者错过一个真正危险的问题。",
      connection:
        "前面讲了布局和寄生参数，这一节顺着往下走，讨论当系统不如预期时，怎样通过测量和验证把问题真正锁定。",
      intuition:
        "调试有点像法医工作。你看到的证据不一定天然可靠，先要确认采样方式、探头接法和工况设置没有把现场污染。",
      corePoints: [
        "测量方法会改变你看到的结果，尤其是高频尖峰、振铃和地弹跳现象，必须先验证测量链路是否可信。",
        "调试时要把问题分层：先区分是功率级问题、驱动问题、控制问题还是测量假象，再决定下一步动作。",
        "真正的验证不是只看标称点是否通过，而是系统是否在边界工况下仍符合性能和安全要求。",
      ],
      pitfalls: [
        "看到异常波形就立刻改设计，没有先确认探头地线、带宽限制和测量回路是否本身引入了误差。",
        "只在最舒服的标称工况下验证，忽略启动、轻载、满载、高温和输入扰动这些更能暴露问题的条件。",
      ],
      examples: [
        "用过长的示波器地线去测开关节点，常常会把寄生回路带来的额外振铃也测进去，结果你以为板子更差，实际上是测量方式先失真了。",
        "一个电源在额定中载下看起来很好，但一到冷启动和负载突变就露出问题，这说明验证必须覆盖边界而不是只覆盖舒适区。",
      ],
      scenario:
        "不管是实验室调试、认证前验证还是量产前评审，真正有经验的工程师都会把测量可信度和工况覆盖度放在和设计本身同等重要的位置。",
      next:
        "测量与验证能力建立后，最后一节会把这些知识放回具体应用场景，讨论为什么不同系统对电力电子提出的优先级完全不同。",
      takeaway:
        "在电力电子里，调试不是看见波形，而是确认你看到的是不是真相。",
      terms: ["开关节点", "共模噪声", "差模噪声", "双脉冲测试"],
      quizFocus:
        "把测量理解成验证链的一部分，而不是默认中立的观察动作。",
      applyPriority:
        "测量链路是否可信，以及验证工况是否真正覆盖了系统最容易出问题的边界。",
    },
    {
      slug: "application-architectures-and-engineering-tradeoffs",
      title: "应用架构与工程权衡",
      titleEn: "Application Architectures and Engineering Tradeoffs",
      learningObjective:
        "理解为什么不同应用场景对电力电子设计的优先级完全不同，以及系统架构选择如何由功率密度、成本、效率和可靠性共同决定。",
      learningObjectiveEn:
        "Understand how different applications impose different design priorities and how architecture is chosen through efficiency, density, cost, and reliability tradeoffs.",
      overview:
        "课程最后一节把视角拉回系统层。你会看到，同样是电力电子设计，快充、车载、服务器供电、工业驱动在目标函数上其实非常不一样，因此“最佳方案”从来不是唯一的。",
      whyImportant:
        "如果离开应用场景谈设计优劣，很多判断都会变得空泛。真正成熟的工程判断，永远和具体约束绑定在一起。",
      connection:
        "这一节把前面所有内容重新汇总起来：拓扑、器件、控制、热、EMI、调试，最终都要服务于某个具体产品目标。",
      intuition:
        "工程权衡有点像排座位。每个需求都想坐最前排，但位置有限。你必须知道谁最重要、谁可以妥协、谁一旦妥协就会让整场演出失衡。",
      corePoints: [
        "不同应用场景对效率、功率密度、成本、隔离、安全、动态响应和可靠性的优先级排序并不相同。",
        "系统架构选择的价值，不在于追求绝对最优，而在于让关键目标最优先地被满足。",
        "真正好的工程方案，往往不是每项指标都极致，而是在主要约束下表现最均衡、最可交付。",
      ],
      pitfalls: [
        "把某个领域里的最佳实践直接照搬到另一个场景，忽略了功率等级、成本结构和认证要求已经变了。",
        "过度追求单一指标，比如极致效率或极致小体积，却没有看到它对散热、EMI、成本和可靠性的连带代价。",
      ],
      examples: [
        "快充适配器可能更在意功率密度和成本，而服务器供电则可能更强调效率、并联稳定和长期可靠性，这意味着它们的架构取舍天然不同。",
        "车载系统往往必须优先考虑宽温度范围、瞬态抗扰和功能安全，因此某些在消费电子里很激进的设计，在车规里未必合适。",
      ],
      scenario:
        "当你从实验板走向真正产品，就必须从“能做出来”转向“为什么这个场景下要这样做”。这也是工程判断和课堂知识真正合流的地方。",
      next:
        "完成这一节后，你就拥有了一条从能量路径、控制模型、器件边界到工程落地与场景取舍的完整电力电子学习主线。",
      takeaway:
        "电力电子没有脱离场景的最优解，只有在具体约束下更合适的系统解。",
      terms: ["效率预算", "降额设计", "热路径", "回路面积"],
      quizFocus:
        "把方案优劣放回具体应用约束里判断，而不是追求脱离场景的“全能最优”。",
      applyPriority:
        "当前应用真正最重要的约束是什么，以及方案是否在这些约束下保持了可交付的整体平衡。",
    },
  ],
};

const powerCourseV2Seed: ExampleCourseSeed = {
  slug: "power-electronics",
  title: "电力电子系统",
  titleEn: "Power Electronics Systems",
  topic: "电力电子系统",
  topicEn: "Power Electronics Systems",
  description:
    "这门官方示例课从能量路径、拓扑规律、控制建模、器件边界、热与 EMI，一路讲到真实应用场景中的系统权衡，帮助你建立完整的电力电子系统视角。",
  descriptionEn:
    "This official sample course builds a full systems view of power electronics, from energy flow and topology to control, devices, thermal limits, EMI, validation, and application tradeoffs.",
  goals: [
    "理解电力电子系统如何通过开关、储能与拓扑组织高效率能量转换",
    "掌握建模、反馈控制、器件选型、热设计与可靠性之间的结构关系",
    "建立面向真实工程场景的布局、调试、EMI 与系统权衡判断能力",
  ],
  goalsEn: [
    "Understand how power electronics systems organize efficient energy conversion through switching, storage, and topology",
    "Grasp the structural relationships among modeling, control, device choices, thermal design, and reliability",
    "Develop engineering judgment for layout, debugging, EMI, and application-specific tradeoffs",
  ],
  chapters: [
    powerCourseV2Chapter1,
    powerCourseV2Chapter2,
    powerCourseV2Chapter3,
    powerCourseV2Chapter4,
    powerCourseV2Chapter5,
  ],
};

const powerLegacyLessonRedirects: Record<
  string,
  { chapterSlug: string; subchapterSlug: string }
> = {
  "conversion-fundamentals/switching-devices-and-power-stages": {
    chapterSlug: "energy-conversion-foundations",
    subchapterSlug: "switches-storage-and-energy-flow",
  },
  "conversion-fundamentals/pwm-and-energy-transfer": {
    chapterSlug: "energy-conversion-foundations",
    subchapterSlug: "pwm-ripple-and-conduction-modes",
  },
  "control-and-design/feedback-control-and-compensation": {
    chapterSlug: "modeling-and-control",
    subchapterSlug: "feedback-and-compensator-design",
  },
  "control-and-design/loss-thermal-and-emi": {
    chapterSlug: "efficiency-thermal-and-reliability",
    subchapterSlug: "loss-breakdown-and-efficiency-budget",
  },
};

const exampleCourseSeedOverrides: Partial<Record<string, ExampleCourseSeed>> = {
  "ai-agent-development": aiAgentCourseV2Seed,
  "llm-principles": llmCourseV2Seed,
  "quant-finance-analysis": quantCourseV2Seed,
  "power-electronics": powerCourseV2Seed,
};

export const exampleCourses = exampleCourseSeeds.map((seed) =>
  toExampleCourse(exampleCourseSeedOverrides[seed.slug] ?? seed)
);

export function getExampleCourses() {
  return exampleCourses;
}

export function getExampleCourseBySlug(courseSlug: string) {
  return exampleCourses.find((course) => course.slug === courseSlug) ?? null;
}

export function getExampleChapterBySlug(
  courseSlug: string,
  chapterSlug: string
) {
  return (
    getExampleCourseBySlug(courseSlug)?.chapters.find(
      (chapter) => chapter.slug === chapterSlug
    ) ?? null
  );
}

export function getExampleSubchapterBySlug(
  courseSlug: string,
  chapterSlug: string,
  subchapterSlug: string
) {
  return (
    getExampleChapterBySlug(courseSlug, chapterSlug)?.subchapters.find(
      (subchapter) => subchapter.slug === subchapterSlug
    ) ?? null
  );
}

export function getExampleLessonBySlugs(
  courseSlug: string,
  chapterSlug: string,
  subchapterSlug: string,
  lessonType: string
) {
  const subchapter = getExampleSubchapterBySlug(
    courseSlug,
    chapterSlug,
    subchapterSlug
  );

  if (!subchapter) return null;
  if (!["main", "summary", "quiz"].includes(lessonType)) return null;

  const lesson = subchapter.lessons[lessonType as ContentType];
  if (!lesson) return null;

  return {
    course: getExampleCourseBySlug(courseSlug)!,
    chapter: getExampleChapterBySlug(courseSlug, chapterSlug)!,
    subchapter,
    lesson,
  };
}

export function getExampleCourseStaticParams() {
  return exampleCourses.map((course) => ({ courseSlug: course.slug }));
}

export function getExampleLessonStaticParams() {
  return exampleCourses.flatMap((course) =>
    course.chapters.flatMap((chapter) =>
      chapter.subchapters.flatMap((subchapter) =>
        (["main", "summary", "quiz"] as const).map((lessonType) => ({
          courseSlug: course.slug,
          chapterSlug: chapter.slug,
          subchapterSlug: subchapter.slug,
          lessonType,
        }))
      )
    )
  );
}

export function getExampleOverviewHref(courseSlug: string) {
  return `/examples/${courseSlug}`;
}

export function getExampleLessonHref(
  courseSlug: string,
  chapterSlug: string,
  subchapterSlug: string,
  lessonType: ExampleLessonType
) {
  return `/examples/${courseSlug}/chapters/${chapterSlug}/subchapters/${subchapterSlug}/${lessonType}`;
}

export function resolveLegacyExampleLessonRedirect(
  courseSlug: string,
  chapterSlug: string,
  subchapterSlug: string,
  lessonType: string
) {
  if (!["main", "summary", "quiz"].includes(lessonType)) return null;

  const redirectMap =
    courseSlug === "ai-agent-development"
      ? aiAgentLegacyLessonRedirects
      : courseSlug === "llm-principles"
        ? llmLegacyLessonRedirects
        : courseSlug === "quant-finance-analysis"
          ? quantLegacyLessonRedirects
          : courseSlug === "power-electronics"
            ? powerLegacyLessonRedirects
        : null;

  if (!redirectMap) return null;

  const mapped = redirectMap[`${chapterSlug}/${subchapterSlug}`];
  if (!mapped) return null;

  return getExampleLessonHref(
    courseSlug,
    mapped.chapterSlug,
    mapped.subchapterSlug,
    lessonType as ExampleLessonType
  );
}

export function getFirstExampleLesson(course: ExampleCourse) {
  const firstChapter = course.chapters[0];
  const firstSubchapter = firstChapter?.subchapters[0];

  if (!firstChapter || !firstSubchapter) return null;

  return {
    chapter: firstChapter,
    subchapter: firstSubchapter,
    href: getExampleLessonHref(
      course.slug,
      firstChapter.slug,
      firstSubchapter.slug,
      "main"
    ),
  };
}
