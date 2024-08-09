import { NextRequest, NextResponse } from "next/server";
import { CreateExcel, ReadExcel } from "./xlsx";
import { writeFile, rm } from "fs/promises";
import path from "path";

export async function PUT(req: NextRequest) {
  const data = await req.formData();
  const file: any = data.get("file");

  if (file !== null) {
    const filePath = path.join(process.cwd(), "public", "excelFile.xlsx");
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    // const read = await ReadExcel(filePath, data.get('owner'))
    const read: any[] = await ReadExcel(
      filePath,
      data.get("owner"),
      data.get("cols"),
    );
    await rm(filePath);
    return NextResponse.json(read);
  }
}

export async function GET() {
  return new NextResponse("Hello, from API!");
}

export async function POST(req: NextRequest) {
  console.log("hello fetch");
  const { data, cols } = await req.json();
  const res = await CreateExcel(cols, data);
  return new NextResponse(res);
}
