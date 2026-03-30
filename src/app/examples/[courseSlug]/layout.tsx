import { notFound } from "next/navigation";
import { ExampleCourseSidebar } from "@/components/example/example-course-sidebar";
import { Header } from "@/components/layout/header";
import { ProjectLayoutShell } from "@/components/project/project-layout-shell";
import { getExampleCourseBySlug, getExampleCourseStaticParams } from "@/lib/examples/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return getExampleCourseStaticParams();
}

export default async function ExampleCourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const course = getExampleCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <ProjectLayoutShell
        sidebar={<ExampleCourseSidebar course={course} />}
      >
        {children}
      </ProjectLayoutShell>
    </div>
  );
}
