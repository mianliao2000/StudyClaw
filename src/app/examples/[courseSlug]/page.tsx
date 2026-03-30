import { notFound } from "next/navigation";
import { ExampleCourseOverview } from "@/components/example/example-course-overview";
import { getExampleCourseBySlug } from "@/lib/examples/catalog";

export default async function ExampleCoursePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const course = getExampleCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  return <ExampleCourseOverview course={course} />;
}
