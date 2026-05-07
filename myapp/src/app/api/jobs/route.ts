import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";

export async function GET() {
  try {
    await dbConnect();
    const jobs = await Job.find({}).sort({ date: -1 });
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const job = await Job.create(body);
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
