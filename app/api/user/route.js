import { connectDB } from "@/lib/db";

export async function POST(req){
    await connectDB()
    const {user} = await res.json()
}