import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  let isAuthenticated = false;

  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch (e) { }
  }

  if (!isAuthenticated && process.env.NODE_ENV !== "development") {
    redirect('/admin/login');
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full flex-1 flex flex-col bg-muted/40 relative min-h-screen">
        <div className="flex h-14 items-center gap-4 border-b bg-background px-6 shrink-0 transition-all">
          <SidebarTrigger />
          <h1 className="font-semibold text-lg text-secondary hidden sm:block">
            Dashboard
          </h1>
        </div>
        <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
