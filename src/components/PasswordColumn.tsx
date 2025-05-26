import { ColumnDef } from "@tanstack/react-table";
import {ArrowUpDown, Copy, Eye, EyeOff, Pencil, Trash} from "lucide-react";
import {Button} from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"
import toast from "react-hot-toast";
import Link from "next/link";
import React from "react";


export type Password = {
  _id: string;
  name: string;
  username: string;
  password: string;

}

export function columns(
  visiblePasswords: { [key: string]: boolean },
  setVisiblePasswords: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>,
  handleDelete: (id: string) => void
): ColumnDef<Password>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) =>
            row.toggleSelected(!!value)
          }
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          <span className="font-semibold text-lg">Name</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "password",
      header: "Password",
      cell: ({ row }) => {
        const item = row.original as Password;

        return (
          <div className="flex items-center justify-between">
            <span>{visiblePasswords[item._id] ? item.password : "************"}</span>
            <Button variant="outline" size="icon"
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
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        );
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original as Password;
        return (
          <div className="flex gap-6 justify-center">
            <Button variant="outline" size="icon"
              onClick={() => {
                navigator.clipboard.writeText(item.password);
                toast.success("Copied value to clipboard!");
              }}
              className="text-gray-500 hover:text-gray-700"
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button asChild variant="outline" size="icon">
              <Link
                href={`/vault/edit/${item._id}`}
                title="Edit"
                className="text-indigo-600 hover:text-indigo-900"
              >
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="destructive" size="icon"
              onClick={() => handleDelete(item._id)}
              className="font-semibold"
              title="Delete"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )
      },
      meta: {
        className: "text-center"
      }
    },
  ];
}