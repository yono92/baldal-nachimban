import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "./_components/admin-shell";
import { AdminUnauthorized } from "./_components/admin-unauthorized";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    return <AdminUnauthorized email={user.email} />;
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
