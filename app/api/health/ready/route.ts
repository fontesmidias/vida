import { prisma } from "@/src/lib/prisma";

// S7: verificação com banco, usada pelo healthcheck do Docker. O Nginx bloqueia este caminho de fora.
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok" }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("[health/ready]", error);
    return Response.json({ status: "indisponivel" }, { status: 503, headers: { "cache-control": "no-store" } });
  }
}
