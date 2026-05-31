// Place this at: app/api/user/signup/route.js

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";

export async function POST(req) {
  try {
    await connectDB();
    const { fname, lname, email, password } = await req.json();

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fname,
      lname,
      email,
      password: hashedPassword,
    });

    // Return user without password
    const safeUser = {
      _id:   user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
    };

    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: error.message || "Signup failed" },
      { status: 500 }
    );
  }
}