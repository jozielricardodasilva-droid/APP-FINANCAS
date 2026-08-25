import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { UserMenu } from "@/components/user-menu";
import { Toaster } from "@/components/ui/sonner";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex min-h-svh">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-8">
          <span className="font-semibold tracking-tight md:hidden">App Finanças</span>
          <div className="ml-auto">
            <UserMenu email={user.email ?? ""} />
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden px-4 pb-20 pt-6 md:px-8 md:pb-8">
          {children}
        </main>
      </div>
      <MobileNav />
      <Toaster />
    </div>
  );
}
