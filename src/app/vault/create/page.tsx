"use client"

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from "@/components/ui/button";
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Lock, User, NotebookText, KeyRound, FolderPen} from 'lucide-react';
import React, {useState} from 'react';
import {useRouter} from "next/navigation";
import GeneratePassword from "@/components/GeneratePassword";
import {useUser} from "@clerk/nextjs";
import toast from "react-hot-toast";
import {Skeleton} from "@/components/ui/skeleton";

const CreatePage = () => {
  const {user, isLoaded} = useUser();
  const router = useRouter();

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement
  >) => {
    setForm({...form, [e.target.name]: e.target.value});
    setIsPasswordFocused(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/vault", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          name: form.name,
          username: form.username,
          password: form.password,
          notes: form.notes,
        })
      });

      const result = await response.json();

      if(response.ok) {
        toast.success(`${form.name} saved successfully!`);
        router.push("/vault");
      } else {
        console.error("Failed to create", result);
      }
    } catch (error) {
      console.log("Failed to create", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({name: '', username: '', password: '', notes: ''});
    router.push('/vault');
  };

  const useGeneratedPassword = (newPassword: string) => {
    setForm((prev) => ({ ...prev, password: newPassword }));
  }

  const showGeneratedField = isPasswordFocused && form.password.trim().length === 0;

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lock className="h-5 w-5"/>
              Create Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <FolderPen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"/>
                <Skeleton className="h-10 w-full bg-gray-300" />
              </div>
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"/>
                <Skeleton className="h-10 w-full bg-gray-300" />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"/>
                <Skeleton className="h-10 w-full bg-gray-300" />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <div className="relative">
                <NotebookText className="absolute left-3 top-1/10 h-4 w-4 text-gray-500"/>
                <Skeleton className="h-24 w-full bg-gray-300" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Skeleton className="h-10 w-20 bg-gray-300" />
            <Skeleton className="h-10 w-20 bg-gray-300" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lock className="h-5 w-5"/>
            Create Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <FolderPen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"/>
              <Input
                id="name"
                name="name"
                placeholder="Enter name"
                className="pl-10"
                value={form.name}
                onChange={handleChange}
                disabled={isSaving}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"/>
              <Input
                id="username"
                name="username"
                placeholder="Enter your username"
                className="pl-10"
                value={form.username}
                onChange={handleChange}
                disabled={isSaving}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"/>
              <Input
                id="password"
                name="password"
                type="password"
                className="pl-10"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setIsPasswordFocused(true)}
                disabled={isSaving}
              />
            </div>
          </div>
          <GeneratePassword show={showGeneratedField} sendPassword={useGeneratedPassword} />

          <div>
            <Label htmlFor="notes">Notes</Label>
            <div className="relative">
              <NotebookText className="absolute left-3 top-1/10 h-4 w-4 text-gray-500"/>
              <textarea
                  id="notes"
                  name="notes"
                  placeholder="Enter notes"
                  className="pl-10 min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={form.notes}
                  onChange={handleChange}
                  rows={4}
                  disabled={isSaving}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreatePage;