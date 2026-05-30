import { connectDB } from "@/lib/db";
import Todo from "@/lib/models/todo.model";

export async function POST(req) {
  await connectDB();
  const { title, description, status, priority } = await req.json();

  const todos = await Todo.create({
    title,
    description,
    status,
    priority,
  });

  return Response.json(todos, { status: 201 });
}

export async function GET(req) {
  await connectDB();
  const todos = await Todo.find().sort({ createdAt: -1 });

  return Response.json(todos, { status: 200 });
}

export async function DELETE(params) {
  
}
