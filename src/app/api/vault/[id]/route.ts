import {connectDB} from "@/lib/mongodb";
import {Password} from "@/models/password.model";
import {NextResponse} from "next/server";
import {decrypt} from "@/lib/decrypt";
import {encrypt} from "@/lib/encrypt";

export async function GET(
  req: Request,
  {params}: { params: Promise<{ id: string }>  }
) {
  await connectDB();

  try {
    const { id } = await params;

    const data = await Password.findById(id);

    if (!data) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    const decrypted = {
      ...data,
      name: data.name,
      username: data.username,
      password: decrypt(data.password)
    }

    return NextResponse.json({success: true, data: decrypted});

  } catch (error) {
    console.error("Failed to fetch data:", error);
    return NextResponse.json({error: "Server error"}, {status: 500});
  }
}

export async function PUT(
  req: Request,
  {params}: { params: Promise<{ id: string }>  }
) {

  try {
    const { id } = await params;
    const body = await req.json();
    await connectDB();

    const encryptBody = {
      ...body,
      password: encrypt(body.password)
    }

    const updated = await Password.findByIdAndUpdate(id, encryptBody, {new: true});

    return NextResponse.json({success: true, data: updated});

  } catch (error) {
    console.error("Failed to update password:", error);
    return NextResponse.json({error: "Server error"}, {status: 500});
  }
}

export async function DELETE(
  req: Request,
  {params}: { params: Promise<{ id: string }>  }
) {

  try {
    const { id } = await params;
    await connectDB();
    const deleted = await Password.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({error: 'User does not exist'}, {status: 404});
    }

    return NextResponse.json({success: true});
  } catch (error) {
    console.error("Error deleting password:", error);
    return NextResponse.json({error: "Server error"}, {status: 500});
  }
}