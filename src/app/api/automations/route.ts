import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { id: "send_email", label: "Send Email", params: ["to", "subject"] },
    {
      id: "generate_doc",
      label: "Generate Document",
      params: ["template", "recipient"],
    },
  ]);
}
