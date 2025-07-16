"use client"

import { Construction, Download, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

type PasswordData = {
  _id: string;
  name: string;
  username: string;
  password: string;
  notes: string;
  createdAt: string;
}

const ProfilePage = () => {
  const { user, isLoaded } = useUser();
  const [isDownloading, setIsDownloading] = useState(false);

  const convertToCSV = (data: PasswordData[]) => {
    const headers = ['Name', 'Username', 'Password', 'Notes', 'Date Created'];
    const csvRows = [headers.join(',')];

    data.forEach(item => {
      const row = [
        `"${item.name.replace(/"/g, '""')}"`,
        `"${item.username.replace(/"/g, '""')}"`,
        `"${item.password.replace(/"/g, '""')}"`,
        `"${(item.notes || '').replace(/"/g, '""')}"`,
        `"${new Date(item.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}"`
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadCSV = async () => {
    if (!isLoaded || !user?.id) {
      toast.error("Please wait for authentication to complete");
      return;
    }

    setIsDownloading(true);
    
    try {
      const response = await fetch('/api/vault', {
        method: 'GET',
      });
      
      const json = await response.json();
      
      if (json.success && json.data) {
        if (json.data.length === 0) {
          toast.error("No passwords found to export");
          return;
        }

        const csvContent = convertToCSV(json.data);
        const filename = `passwords_export_${new Date().toISOString().split('T')[0]}.csv`;
        
        downloadCSV(csvContent, filename);
        toast.success(`Successfully exported ${json.data.length} passwords`);
      } else {
        toast.error("Failed to fetch passwords");
      }
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast.error("Error downloading CSV file");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8  mt-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between pt-8 mb-8">
          <h1 className="font-bold flex items-center gap-3 text-3xl text-gray-800">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Export Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Download all your stored passwords as a CSV file. This will include names, usernames, unencrypted passwords, notes, and creation dates.
              </p>
              <Button 
                onClick={handleDownloadCSV}
                disabled={isDownloading || !isLoaded}
                className="w-full"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? "Downloading..." : "Download CSV"}
              </Button>
              <div className="text-xs text-gray-500 space-y-1">
                <p>⚠️ <strong>Security Warning:</strong></p>
                <p>• The CSV file contains unencrypted passwords</p>
                <p>• Store the file securely and delete after use</p>
                <p>• Don&apos;t share or email the file</p>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Construction className="h-5 w-5 text-yellow-500" />
                More Features Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Additional profile features are currently under development:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Account settings</li>
                <li>• Security preferences</li>
                <li>• Import data</li>
                <li>• Account statistics</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* User Info Section */}
        {isLoaded && user && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                {user.imageUrl && (
                  <Image 
                    src={user.imageUrl} 
                    alt="Profile" 
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-600">{user.emailAddresses[0]?.emailAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;