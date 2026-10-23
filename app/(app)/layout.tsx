import { redirect } from "next/navigation";
import { currentUser } from "@/src/lib/auth";
import { AppFrame } from "@/src/ui/AppFrame";

// Telas internas exigem sessão (S2); sem ela, volta para a Entrada
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!(await currentUser())) redirect("/");
  return <AppFrame>{children}</AppFrame>;
}
