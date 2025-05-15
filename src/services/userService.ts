import {connectDB} from "@/lib/mongodb"
import {User} from "@/models/user.model"

export const syncUser = async (data: {
  email: string,
  name: string,
  image: string,
  clerkId: string,
}) => {
  await connectDB();

  // Check if user exists by clerkId or email
  const existingUser = await User.findOne({
    $or: [{ clerkId: data.clerkId }, { email: data.email }],
  });

  if(existingUser) {
    console.log(`User with clerkId ${data.clerkId} already exists.`);
    return;
  }

  return await User.create(data)
}