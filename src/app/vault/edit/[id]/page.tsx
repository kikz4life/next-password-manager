"use client"

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Lock, User, Eye, EyeOff} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import toast from "react-hot-toast";

interface FormProps {
  name: string;
  username: string;
  password: string;
}

const EditPage = () => {

  const router = useRouter();
  const [form, setForm] = useState<FormProps>({
    name: "",
    username: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false);
  const {id} = useParams();

  const handleUpdate = async () => {
    const response = await fetch(`/api/vault/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if(response.ok){
      toast.success(`${form.name} updated successfully!`);
      router.push("/vault");
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/vault/${id}`, {
        method: "GET",
      });
      const json = await response.json();

      if(json.success) {
        setForm({
          name: json.data.name,
          username: json.data.username,
          password: json.data.password
        });
      }
    }

    if(id) fetchData();
  }, [id]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lock className="h-5 w-5"/>
            Update Password
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

          <div className="space-y-2 relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="pl-10"
              value={form.password}
              onChange={handleChange}
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent mt-2"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button type="submit" variant="outline" onClick={() => router.push("/vault")}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Update</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditPage;