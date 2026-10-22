import { forbidden, internalError, isSameOrigin } from "@/src/lib/http";
import { getSession } from "@/src/lib/session";

// Encerra a sessão; os dados ficam preservados no banco (R7)
export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return forbidden();
  try {
    const session = await getSession();
    session.destroy();
    return new Response(null, { status: 204 });
  } catch (error) {
    return internalError("session", error);
  }
}
