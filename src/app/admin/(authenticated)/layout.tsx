import AdminSidebar from "@/components/sidebar/AdminSidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Basic role protection (assuming role is on user object)
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans selection:bg-nss-red selection:text-white">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-10 md:p-20 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
