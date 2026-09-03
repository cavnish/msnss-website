import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";
  const session = await getSession();

  // Allow the login page to render without a session
  const isLogin = pathname.endsWith("/admin/login");

  if (!session && !isLogin) {
    redirect("/admin/login");
  }

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 lg:flex-row">
      <Sidebar name={session?.name || "Admin"} />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
