import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server"
import { NextRequest } from "next/server";
import { syncUser } from "@/services/userService";


export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new Response("Missing Clerk webhook secret", { status: 500 });
  }

  const svix_id = req.headers.get("svix-id");
  const svix_signature = req.headers.get("svix-signature");
  const svix_timestamp = req.headers.get("svix-timestamp");

  if (!svix_id || !svix_signature || !svix_timestamp) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, first_name, last_name, image_url, email_addresses } = evt.data;

    const email = email_addresses[0].email_address;
    const name = `${first_name || ""} ${last_name || ""}`.trim();

    try {
      await syncUser({ email, name, image: image_url, clerkId: id });
    } catch (error) {
      console.error("Error syncing user:", error);
      return new Response("Error syncing user", { status: 500 });
    }
  }

  /*if (eventType === "user.updated") {
    const { id, first_name, last_name, image_url, email_addresses } = evt.data;

    const email = email_addresses[0].email_address;
    const name = `${first_name || ""} ${last_name || ""}`.trim();

    try {
      await updateUser({ email, name, image: image_url, clerkId: id });
    } catch (error) {
      console.error("Error updating user:", error);
      return new Response("Error updating user", { status: 500 });
    }
  }*/

  return new Response("Webhook processed", { status: 200 });
}