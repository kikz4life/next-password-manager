"use client"

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from "@/components/ui/button";
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Lock, User} from 'lucide-react';
import React, {useState} from 'react';
import {useRouter} from "next/navigation";
import GeneratePassword from "@/components/GeneratePassword";
import {useUser} from "@clerk/nextjs";
import toast from "react-hot-toast";

const CreatePage = () => {
  const {user} = useUser();
  const router = useRouter();

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [form, setForm] = useState({
    name: '',
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
    setIsPasswordFocused(false);
  };

  const handleSave = async () => {
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
    }

  };

  const handleCancel = () => {
    setForm({name: '', username: '', password: ''});
    router.push('/vault');
  };

  const useGeneratedPassword = (newPassword: string) => {
    setForm((prev) => ({ ...prev, password: newPassword }));
  }

  const showGeneratedField = isPasswordFocused && form.password.trim().length === 0;

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
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"/>
              <Input
                id="name"
                name="name"
                placeholder="Enter name"
                className="pl-10"
                value={form.name}
                onChange={handleChange}
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
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setIsPasswordFocused(true)}
            />
          </div>
          <GeneratePassword show={showGeneratedField} sendPassword={useGeneratedPassword} />
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreatePage;