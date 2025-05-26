"use client"

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useUser} from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {ArrowRightIcon, LockIcon} from "lucide-react";
import toast from "react-hot-toast";
import {PasswordTable} from "@/components/PasswordTable";
import {columns} from "@/components/PasswordColumn";

type Props = {
  _id: string;
  name: string;
  username: string;
  password: string;
}

const VaultPage = () => {
  const [passwords, setPasswords] = useState<Props[]>([]);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});

  const {user, isLoaded} = useUser();

  const handleDelete = async (id: string) => {
    const confirmed = confirm(`Are you sure you want to delete this entry`);

    if(!confirmed) return;

    const response = await fetch(`/api/vault/${id}`, {
      method: 'DELETE',
    })

    if(response.ok) {
      toast.success("Deleted successfully");
      setPasswords((prev) => prev.filter((p) => p._id !== id));
    } else {
      console.error("Failed to delete password");
      toast.error("Failed to delete password\"");
    }
  }

  useEffect(() => {
    const fetchPasswords = async () => {
      if(!isLoaded || !user?.id) return;

      const response = await fetch(`/api/vault`,{
        method: "GET",
      });
      const json = await response.json();
      console.log(json.data);

      if(json.success) setPasswords(json.data);
    }

    fetchPasswords();

  }, [isLoaded, user?.id]);

  return (
    <div className="min-h-screen bg-[#f7f7f7] p-8 flex-grow justify-center px-4 py-12">
      <div className="flex items-center justify-between pt-8  mb-4">
        <h1 className="font-semibold flex items-center gap-2 text-xl uppercase">
          <LockIcon className="h-4 w-4" />Vault
        </h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Button
          size="lg"
          asChild
          className="overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium"
        >
          <Link href={"/vault/create"} className="flex items-center font-mono animate-bounce">
            Create New Password
            <ArrowRightIcon className="ml-2 size-5" />
          </Link>
        </Button>
      </div>


        <PasswordTable columns={columns(visiblePasswords, setVisiblePasswords, handleDelete)} data={passwords} />
    </div>
  );
};

export default VaultPage;