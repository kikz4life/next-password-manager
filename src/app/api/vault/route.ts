import {NextResponse} from "next/server";
import {savePassword} from "@/services/vaultService"
import {Password} from "@/models/password.model";
import {encrypt} from "@/lib/encrypt"
import {decrypt} from "@/lib/decrypt";
import {auth} from "@clerk/nextjs/server";
import {connectDB} from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const {userId, name, username, password} = body;

    if (!userId || !name || !username || !password || !password.length) {
      return NextResponse.json({error: "Missing fields"}, {status: 400})
    }

    //encrypt password
    const encryptedPassword = encrypt(password);
    const saved = await savePassword({userId, name, username, password: encryptedPassword});

    return NextResponse.json({success: true, data: saved}, {status: 200});

  } catch (error) {
    console.log("Error saving password:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}

export async function GET() {
  try {
    await connectDB();

    const {userId} = await auth();

    const passwords = await Password.find({userId}).lean();

    // Decrypt the password field
    const decryptedPasswords = passwords.map((entry) => ({
      ...entry,
      password: decrypt(entry.password),
    }));

    return NextResponse.json({success: true, data: decryptedPasswords});

  } catch (error) {
    console.error("Error fetching passwords:", error);
    return NextResponse.json({success: false, error: "Failed to fetch passwords"}, {status: 500});
  }
}