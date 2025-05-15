This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# 🏋️‍♀️ NextJS - Password Manager

Your Password Manager Built for Security. End-to-end encrypted. Only **you** can see your passwords. Sign up securely with your favorite provider.

---

## 🚀 Tools & Technologies

### 🧑‍💼 [Clerk](https://clerk.com/)
The most comprehensive **User Management Platform**, providing seamless authentication and user session handling.

### 🍃 [MongoDB](https://www.mongodb.com/)
A highly scalable NoSQL document-based database used for secure and efficient password storage.

### 🔗 [Convex](https://www.convex.dev/)
A fully integrated backend platform for modern web apps, handling **database**, **functions**, and **real-time updates** without server management. (Optional / legacy)

### 🎨 [shadcn/ui](https://ui.shadcn.com/)
A beautifully designed **component library** based on Tailwind CSS and Radix UI. Perfect for rapidly building accessible UI with modern aesthetics.

### 🌐 [ngrok](https://ngrok.com/)
Used during development to expose local servers to the public internet and test webhooks in real-time.

### 📬 [Svix](https://www.npmjs.com/package/svix)
An SDK for **webhook verification and delivery**, used for integrating with event-based systems like Clerk.

### 🔔 [react-hot-toast](https://react-hot-toast.com/)
For sleek and customizable toast notifications in the UI.

### 💨 [Tailwind CSS](https://tailwindcss.com/)
A utility-first CSS framework for rapid UI development.

---

## 🔐 Features

- 🔒 End-to-end password encryption
- 🔑 Authentication via Clerk (email, Google, etc.)
- 🧠 Password storage with MongoDB
- 🧾 Copy-to-clipboard functionality
- 👀 Toggle password visibility
- 🧹 Filter/search passwords
- ✏️ Edit or delete stored credentials
- 📦 API routes with secure data access
- 🎛️ Paginated table layout with Shadcn UI
- 📡 Clerk webhook handling with Svix

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
