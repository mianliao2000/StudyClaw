export type Lang = "zh" | "en";

const translations = {
  // Navigation
  "nav.myProjects": { zh: "我的项目", en: "My Projects" },
  "nav.login": { zh: "登录", en: "Login" },

  // Homepage
  "home.badge": {
    zh: "AI 驱动的个性化学习",
    en: "AI-Powered Personalized Learning",
  },
  "home.title": { zh: "你的 AI 学习搭档", en: "Your AI Learning Partner" },
  "home.subtitle": {
    zh: "告诉 AI 你想学什么，它会为你规划课程、生成教材、辅导学习。从规划到精通，一站式个性化学习体验。",
    en: "Tell AI what you want to learn. It plans courses, generates materials, and tutors you. From planning to mastery - one-stop personalized learning.",
  },
  "home.start": { zh: "开始学习", en: "Start Learning" },
  "home.learnMore": { zh: "了解更多", en: "Learn More" },
  "home.feature1.title": { zh: "AI 对话规划", en: "AI Planning" },
  "home.feature1.desc": {
    zh: "通过自然对话，AI 帮你量身定制学习路线",
    en: "AI customizes your learning path through natural conversation",
  },
  "home.feature2.title": { zh: "结构化课程", en: "Structured Courses" },
  "home.feature2.desc": {
    zh: "自动生成章节、课文、总结和测验",
    en: "Auto-generate chapters, lessons, summaries, and quizzes",
  },
  "home.feature3.title": { zh: "智能辅导", en: "AI Tutoring" },
  "home.feature3.desc": {
    zh: "每节课配备 AI 助教，随时解答疑问",
    en: "Each lesson has an AI tutor ready to answer questions",
  },
  "home.feature4.title": { zh: "进度追踪", en: "Progress Tracking" },
  "home.feature4.desc": {
    zh: "清晰的学习进度，让你始终掌控节奏",
    en: "Clear progress tracking keeps you on pace",
  },
  "home.topicsTitle": { zh: "你可以学习任何复杂主题", en: "Learn Any Complex Topic" },
  "home.footer": {
    zh: "Pandora AI - AI 驱动的个性化学习平台",
    en: "Pandora AI - AI-Powered Personalized Learning Platform",
  },

  // Dashboard
  "dash.title": { zh: "我的学习项目", en: "My Projects" },
  "dash.subtitle": {
    zh: "管理你的个性化学习计划",
    en: "Manage your personalized learning plans",
  },
  "dash.new": { zh: "新建项目", en: "New Project" },
  "dash.empty": { zh: "还没有学习项目", en: "No projects yet" },
  "dash.emptyHint": {
    zh: "点击「新建项目」开始你的第一个学习计划",
    en: 'Click "New Project" to start your first learning plan',
  },
  "dash.createFirst": { zh: "创建第一个项目", en: "Create First Project" },

  // Status
  "status.planning": { zh: "未完成", en: "Incomplete" },
  "status.active": { zh: "学习中", en: "Active" },
  "status.completed": { zh: "已完成", en: "Completed" },
  "status.archived": { zh: "已归档", en: "Archived" },

  // Plan page
  "plan.title": { zh: "学习规划", en: "Learning Plan" },
  "plan.subtitle": {
    zh: "和 AI 讨论你想学什么，它会帮你制定学习计划",
    en: "Discuss with AI what you want to learn",
  },
  "plan.creating": { zh: "创建中...", en: "Creating..." },
  "plan.create": { zh: "创建课程", en: "Create Course" },
  "plan.hint": {
    zh: "继续对话以完善计划，AI 准备就绪后「创建课程」按钮将亮起",
    en: 'Keep chatting to refine the plan. The "Create Course" button will light up when AI is ready.',
  },
  "plan.readyBanner": {
    zh: "课程计划已就绪！点击右上角「创建课程」按钮生成你的个性化课程",
    en: 'Your course plan is ready! Click "Create Course" above to generate your personalized course.',
  },
  "plan.placeholder": { zh: "告诉 AI 你想学什么...", en: "Tell AI what you want to learn..." },

  // Project overview
  "project.progress": { zh: "学习进度", en: "Progress" },
  "project.structure": { zh: "课程结构", en: "Structure" },
  "project.chapters": { zh: "章节", en: "Chapters" },
  "project.sections": { zh: "小节", en: "Sections" },
  "project.units": { zh: "个学习单元", en: "learning units" },
  "project.goals": { zh: "学习目标", en: "Learning Goals" },
  "project.toc": { zh: "章节目录", en: "Table of Contents" },
  "project.planReady": { zh: "计划已就绪", en: "Plan Ready" },
  "project.confirmHint": {
    zh: "确认后将自动为所有章节生成正文、总结和测验",
    en: "Content will be generated for all chapters after confirmation",
  },
  "project.confirmHintFirst": {
    zh: "确认后将为第一章生成内容，其余章节可单独生成",
    en: "First chapter will be generated. Other chapters can be generated individually.",
  },
  "project.confirm": { zh: "确认计划", en: "Confirm Plan" },
  "project.generating": { zh: "正在生成内容...", en: "Generating content..." },
  "project.genWait": {
    zh: "生成过程可能需要几分钟，请勿关闭页面",
    en: "This may take a few minutes. Please don't close the page.",
  },
  "project.generateChapter": { zh: "生成此章内容", en: "Generate Chapter" },
  "project.genFailed": { zh: "生成失败", en: "Generation failed" },

  // Sidebar
  "sidebar.main": { zh: "正文", en: "Lesson" },
  "sidebar.summary": { zh: "总结", en: "Summary" },
  "sidebar.quiz": { zh: "测验", en: "Quiz" },

  // Delete
  "delete.title": { zh: "确认删除项目？", en: "Delete Project?" },
  "delete.desc": {
    zh: "将永久删除此项目及其所有章节、内容和聊天记录。此操作无法撤销。",
    en: "This will permanently delete the project and all its chapters, content, and chat history. This cannot be undone.",
  },
  "delete.cancel": { zh: "取消", en: "Cancel" },
  "delete.confirm": { zh: "确认删除", en: "Delete" },
  "delete.deleting": { zh: "删除中...", en: "Deleting..." },
  "delete.menu": { zh: "删除项目", en: "Delete Project" },

  // Login
  "login.title": { zh: "Pandora AI", en: "Pandora AI" },
  "login.subtitle": { zh: "使用你的账号登录以继续", en: "Sign in to continue" },
  "login.google": { zh: "使用 Google 登录", en: "Sign in with Google" },
  "login.guest": { zh: "游客试用", en: "Try as Guest" },
  "guest.banner": {
    zh: "你正在以游客身份试用，数据不会被保存。",
    en: "You're in guest mode. Data won't be saved.",
  },
  "guest.loginLink": { zh: "登录以保存进度", en: "Log in to save progress" },

  // Model selector
  "model.model": { zh: "模型:", en: "Model:" },
  "model.reasoning": { zh: "推理:", en: "Reasoning:" },
  "model.low": { zh: "低", en: "Low" },
  "model.medium": { zh: "中", en: "Med" },
  "model.high": { zh: "高", en: "High" },

  // Lesson content
  "lesson.goal": { zh: "目标", en: "Goal" },
  "content.main": { zh: "课文内容", en: "Lesson Content" },
  "content.summary": { zh: "学习总结", en: "Summary" },
  "content.quiz": { zh: "测验", en: "Quiz" },
  "content.notReady": { zh: "尚未生成", en: "Not yet generated" },
  "content.error": { zh: "生成失败，请重试", en: "Generation failed, please retry" },
  "content.generate": { zh: "生成内容", en: "Generate" },
  "content.regenerate": { zh: "重新生成", en: "Regenerate" },
  "content.generating": { zh: "正在生成", en: "Generating" },

  // Tutor chat
  "tutor.title": { zh: "AI 辅导助手", en: "AI Tutor" },
  "tutor.subtitle": {
    zh: "关于本节内容有任何问题都可以问我",
    en: "Ask me anything about this lesson",
  },
  "tutor.placeholder": { zh: "问个问题...", en: "Ask a question..." },
  "tutor.explain": { zh: "用简单的话解释一下", en: "Explain simply" },
  "tutor.example": { zh: "给我一个例子", en: "Give an example" },
  "tutor.quizMe": { zh: "考考我", en: "Quiz me" },
  "tutor.error": {
    zh: "抱歉，暂时无法回答，请稍后重试。",
    en: "Sorry, unable to answer right now. Please try again.",
  },

  // Quiz
  "quiz.generating": { zh: "正在生成测验...", en: "Generating quiz..." },
  "quiz.error": { zh: "生成失败", en: "Generation failed" },
  "quiz.pending": { zh: "测验尚未生成", en: "Quiz not generated yet" },
  "quiz.generate": { zh: "生成测验", en: "Generate Quiz" },
  "quiz.formatError": { zh: "测验数据格式错误", en: "Quiz data format error" },
  "quiz.score": { zh: "得分", en: "Score" },
  "quiz.retry": { zh: "重做", en: "Retry" },
  "quiz.submit": { zh: "提交答案", en: "Submit" },
  "quiz.regenerate": { zh: "重新生成", en: "Regenerate" },

  // Misc
  "misc.chapter": { zh: "章", en: "ch" },
  "misc.section": { zh: "节", en: "sec" },
  "misc.creatingProject": {
    zh: "正在创建项目并启动对话...",
    en: "Creating project and starting conversation...",
  },
  "misc.badgeMain": { zh: "文", en: "L" },
  "misc.badgeSummary": { zh: "结", en: "S" },
  "misc.badgeQuiz": { zh: "测", en: "Q" },
} satisfies Record<string, Record<Lang, string>>;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key]?.[lang] || key;
}

export default translations;
