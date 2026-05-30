// app/api/todo/[id]/route.js
import { connectDB } from "@/lib/db";
import Todo from "@/lib/models/todo.model";

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  const { title, description, status, priority, dueDate, userId } = await req.json();

  const todo = await Todo.findOneAndUpdate(
    { _id: id, userId },
    { title, description, status, priority, dueDate },
    { new: true }
  );

  if (!todo) {
    return Response.json({ message: "Todo not found or unauthorized" }, { status: 404 });
  }

  return Response.json(todo, { status: 200 });
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const todo = await Todo.findOneAndDelete({ _id: id, userId });

  if (!todo) {
    return Response.json({ message: "Todo not found or unauthorized" }, { status: 404 });
  }

  return Response.json({ message: "Deleted" }, { status: 200 });
}