"use client"

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useUser} from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {ArrowRightIcon, Copy, Eye, EyeOff, LockIcon, Pencil, Trash2} from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  _id: string;
  name: string;
  username: string;
  password: string;
}

const ITEMS_PER_PAGE = 5;

const VaultPage = () => {
  const [passwords, setPasswords] = useState<Props[]>([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

      if(json.success) setPasswords(json.data);
    }

    fetchPasswords();

  }, [isLoaded, user?.id]);

  const filtered = passwords.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.username.toLowerCase().includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="p-8 flex-grow bg-white">
      <div className="flex flex-col sm:flex-row gap-4 pt-6 pb-6 justify-end">
        <Button
          size="lg"
          asChild
          className="overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium"
        >
          <Link href={"/vault/create"} className="flex items-center font-mono">
            Create New Password
            <ArrowRightIcon className="ml-2 size-5" />
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold flex items-center gap-2 text-xl uppercase">
          <LockIcon className="h-4 w-4" />Vault
        </h2>
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded px-3 py-1 text-md"
          value={filter}
          onChange={(e) => {
            setCurrentPage(1);
            setFilter(e.target.value);
          }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300 border border-gray-200">
          <thead className="bg-gray-50">
          <tr>
            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r">
              Name
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r">
              Username
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r">
              Password
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
          </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
          {paginated.map((item, index) => (
            <tr key={index}>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 border-r">
                {item.name}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 border-r">
                {item.username}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 border-r">
                <div className="flex items-center justify-between gap-2">
                  <span>{visiblePasswords[item._id] ? item.password : "************"}</span>
                  <button
                    onClick={() =>
                      setVisiblePasswords((prev) => ({
                        ...prev,
                        [item._id]: !prev[item._id],
                      }))
                    }
                    className="text-gray-500 hover:text-gray-700"
                    title="Toggle Visibility"
                  >
                    {visiblePasswords[item._id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4"></Eye>
                    )}
                  </button>
                </div>

              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                <div className="flex gap-6">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.password);
                      toast.success("Copied value to clipboard!");
                    }}
                    className="text-gray-500 hover:text-gray-700"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <Link
                    href={`/vault/edit/${item._id}`}
                    title="Edit"
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {paginated.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="text-center text-sm py-6 text-gray-400"
              >
                No results found.
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <div className="space-x-2">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VaultPage;