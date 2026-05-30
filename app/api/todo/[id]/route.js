import { connectDB } from "@/lib/db";
import Todo from "@/lib/models/todo.model";

export async function DELETE(req, {params}) {
    await connectDB()
    const {id}  = await params
    await Todo.findByIdAndDelete(id)
    return Response.json({
        message:"Deleted"
    })
}