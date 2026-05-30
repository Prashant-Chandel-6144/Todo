import { connectDB } from "@/lib/db";
import User from "@/lib/models/user.model";
import bcrypt from "bcrypt";

export async function POST(req) {
  await connectDB();
  const { fname, lname, email, password } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  const users = await User.create({
    fname,
    lname,
    email,
    password: hashedPassword,
  });

  return Response.json(users, {
    status: 201,
  });
}

