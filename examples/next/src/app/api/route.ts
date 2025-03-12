import { t } from "@/i18n/api";
import { NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET(request: Request) {
  // Do whatever you want
  return NextResponse.json(
    { message: t("I can speak your language") },
    { status: 200 }
  );
}
