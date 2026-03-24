import { Header } from "@/components/layout/header";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">关于学习规划器</h1>

        <div className="prose prose-sm dark:prose-invert">
          <p>
            学习规划器是一个 AI 驱动的个人化学习平台。它帮助你将复杂的技术主题
            分解为结构化的学习计划，并为每个章节生成教材、总结和测验。
          </p>

          <h2>工作原理</h2>
          <ol>
            <li>
              <strong>规划阶段</strong>：通过与 AI 对话，定义你想学的主题、
              学习目标和时间安排。AI 会为你生成一个结构化的课程大纲。
            </li>
            <li>
              <strong>学习阶段</strong>：进入项目工作区后，你可以逐章阅读 AI
              生成的课文，查看学习总结，完成测验来检验理解程度。
            </li>
            <li>
              <strong>辅导阶段</strong>：每节课都配有 AI
              辅导助手，你可以随时提问，获取更深入的解释或实际例子。
            </li>
          </ol>

          <h2>适用场景</h2>
          <ul>
            <li>学习计算机系统、AI、软件架构等技术主题</li>
            <li>掌握 MATLAB/Simulink、PLECS 等专业工具</li>
            <li>自学编程语言和框架</li>
            <li>系统性地学习任何复杂知识领域</li>
          </ul>

          <h2>技术栈</h2>
          <p>
            本项目基于 Next.js + TypeScript + Tailwind CSS 构建，使用
            Prisma + SQLite 存储数据，通过 NextAuth.js 实现用户认证。
          </p>
        </div>
      </main>
    </>
  );
}
