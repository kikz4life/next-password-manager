import {connectDB} from "@/lib/mongodb"
import {Password} from "@/models/password.model"

interface SavePasswordProps {
  userId: string,
  name: string,
  username: string,
  password: {
    iv: string,
    content: string
  },
  notes: string,
}

export const savePassword = async ({userId, name, username, password, notes}: SavePasswordProps) => {
  await connectDB();

  return (await Password.create({
    userId,
    name,
    username,
    password,
    notes
  })).toObject();
}