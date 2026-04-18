import { slothFacts } from "@/lib/facts";

export const dynamic = "force-dynamic";

export async function GET() {
  const fact = slothFacts[Math.floor(Math.random() * slothFacts.length)];
  return Response.json({ fact });
}
