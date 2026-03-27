import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import { SettingsContent } from "@/components/settings/settings-content";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <>
      <Header />
      <SettingsContent
        user={{
          name: session.user.name ?? "",
          email: session.user.email ?? "",
          image: session.user.image ?? "",
          isGuest: !!(session.user as Record<string, unknown>).isGuest,
        }}
      />
    </>
  );
}
