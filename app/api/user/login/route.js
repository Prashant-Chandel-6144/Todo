import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {connectDB} from "@/lib/db.js";
import User from "@/lib/models/user.model";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 400 });
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ message: "Invalid password" }, { status: 400 });
  }
  return NextResponse.json(
    { message: "Login successful", user },
    { status: 200 },
  );
}
