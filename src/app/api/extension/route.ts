import {NextResponse} from 'next/server';
import {connectDB} from "@/lib/mongodb";
import {Password} from "@/models/password.model";
import {auth} from "@clerk/nextjs/server";


export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId } = await auth(); // Clerk user ID

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();

    const saved = await Password.findOne({ userId, name: url });

    if (!saved) {
      return NextResponse.json({ error: "No entry found" }, { status: 404 });
    }

    return NextResponse.json({
      username: saved.username,
      password: saved.password
    });

  } catch (error) {
    console.error("Error fetching autofill data:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}