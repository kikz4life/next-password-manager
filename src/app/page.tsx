"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Facebook, Lock, ShieldCheck, LogIn } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
          Your <span className="text-red-600">Password Manager</span> Built for Security
        </h1>
        <p className="text-gray-600 text-lg">
          End-to-end encrypted. Only **you** can see your passwords. Sign up securely with your favorite provider.
        </p>

        <div className="flex justify-center gap-4 flex-wrap pt-6">
          <Button asChild variant="outline" className="flex items-center gap-2 px-6 py-3 text-md">
            <Link href="/sign-up?provider=google">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                   className="bi bi-google" viewBox="0 0 16 16">
                <path
                  d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
              </svg>
              Sign up with Google
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex items-center gap-2 px-6 py-3 text-md">
            <Link href="/sign-up?provider=facebook">
              <Facebook className="h-5 w-5 text-[#1877F2]"/>
              Sign up with Facebook
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex items-center gap-2 px-6 py-3 text-md">
            <Link href="/sign-up?provider=github">
              <Github className="h-5 w-5" />
              Sign up with GitHub
            </Link>
          </Button>
        </div>

        <div className="pt-8">
          <Link href="/vault">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-md">
              <LogIn className="mr-2 h-5 w-5" />
              Go to Vault
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full text-gray-700">
        <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow">
          <Lock className="h-6 w-6 text-red-600 mt-1" />
          <div>
            <h3 className="font-semibold text-lg">End-to-End Encryption</h3>
            <p className="text-sm">
              Your data is encrypted using modern cryptography. Only you hold the key.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow">
          <ShieldCheck className="h-6 w-6 text-green-600 mt-1" />
          <div>
            <h3 className="font-semibold text-lg">Secure Third-Party Login</h3>
            <p className="text-sm">
              Easily sign in with trusted providers like Google, GitHub, and Facebook.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
