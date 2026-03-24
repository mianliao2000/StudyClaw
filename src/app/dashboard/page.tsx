import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Header } from "@/components/layout/header";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const projects = await prisma.learningProject.findMany({
    where: { userId: session.user.id, status: { not: "planning" } },
    include: { progress: true, chapters: { include: { subchapters: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <>
      <Header />
      <DashboardContent projects={projects} />
    </>
  );
}
