// app/api/todo/route.js
import { connectDB } from "@/lib/db";
import Todo from "@/lib/models/todo.model";

export async function POST(req) {
  await connectDB();
  const { title, description, status, dueDate, priority, userId } = await req.json();

  const todo = await Todo.create({
    userId,
    title,
    description,
    status,
    dueDate,
    priority,
  });

  return Response.json(todo, { status: 201 });
}

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ message: "userId is required" }, { status: 400 });
  }

  const todos = await Todo.find({ userId }).sort({ created_at: -1 });
  return Response.json(todos, { status: 200 });
}