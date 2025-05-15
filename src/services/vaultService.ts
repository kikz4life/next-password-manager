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
}

export const savePassword = async ({userId, name, username, password}: SavePasswordProps) => {
  await connectDB();

  const newPassword = await Password.create({
    userId,
    name,
    username,
    password,
  });

  return newPassword;
}