"use client"

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useUser} from "@clerk/nextjs";
import { useEffect, useState, useCallback, useMemo } from "react";
import {ArrowRightIcon, LockIcon, PlusIcon, RefreshCw, AlertCircle, Database} from "lucide-react";
import toast from "react-hot-toast";
import {PasswordTable} from "@/components/PasswordTable";
import {columns} from "@/components/PasswordColumn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type PasswordEntry = {
  _id: string;
  name: string;
  username: string;
  password: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const VaultPage = () => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const {user, isLoaded} = useUser();

  // Memoized statistics
  const stats = useMemo(() => {
    const total = passwords.length;
    const withNotes = passwords.filter(p => p.notes && p.notes.trim().length > 0).length;
    const recentlyAdded = passwords.filter(p => {
      const createdDate = new Date(p.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate > weekAgo;
    }).length;

    return { total, withNotes, recentlyAdded };
  }, [passwords]);

  // Optimized delete handler with optimistic updates
  const handleDelete = useCallback(async (id: string) => {
    const passwordToDelete = passwords.find(p => p._id === id);
    if (!passwordToDelete) return;

    const confirmed = confirm(`Are you sure you want to delete "${passwordToDelete.name}"?`);
    if (!confirmed) return;

    // Optimistic update
    setPasswords(prev => prev.filter(p => p._id !== id));
    
    try {
      const response = await fetch(`/api/vault/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success(`"${passwordToDelete.name}" deleted successfully`);
      } else {
        // Revert optimistic update on error
        setPasswords(prev => [...prev, passwordToDelete]);
        toast.error("Failed to delete password");
      }
    } catch (error) {
      // Revert optimistic update on error
      setPasswords(prev => [...prev, passwordToDelete]);
      console.error("Failed to delete password", error);
      toast.error("Failed to delete password");
    }
  }, [passwords]);

  // Optimized fetch function
  const fetchPasswords = useCallback(async (showToast = false) => {
    if (!isLoaded || !user?.id) return;

    try {
      setError(null);
      const response = await fetch('/api/vault', {
        method: "GET",
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();

      if (json.success) {
        setPasswords(json.data || []);
        if (showToast) {
          toast.success("Passwords refreshed successfully");
        }
      } else {
        throw new Error(json.error || "Failed to fetch passwords");
      }
    } catch (error) {
      console.error("Error fetching passwords:", error);
      setError(error instanceof Error ? error.message : "Failed to load passwords");
      if (showToast) {
        toast.error("Failed to refresh passwords");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isLoaded, user?.id]);

  // Manual refresh handler
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPasswords(true);
  }, [fetchPasswords]);

  // Initial load effect
  useEffect(() => {
    fetchPasswords();
  }, [fetchPasswords]);

  // Memoized table columns
  const tableColumns = useMemo(() => 
    columns(visiblePasswords, setVisiblePasswords, handleDelete), 
    [visiblePasswords, handleDelete]
  );

  // Loading state
  if (loading && passwords.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between pt-8 mb-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-48" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Error Loading Vault</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 mt-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-8 mb-8 gap-4">
          <div>
            <h1 className="font-bold flex items-center gap-3 text-3xl text-gray-800">
              <div className="p-2 bg-blue-100 rounded-lg">
                <LockIcon className="h-6 w-6 text-blue-600" />
              </div>
              Vault
            </h1>
            <p className="text-gray-600 mt-2">Secure password management</p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button
              size="lg"
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link href="/vault/create" className="flex items-center gap-2">
                <PlusIcon className="h-5 w-5" />
                Create New Password
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Passwords</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">With Notes</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.withNotes}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Added This Week</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.recentlyAdded}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Database className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl font-semibold text-gray-800">Password Entries</span>
              <Badge variant="secondary" className="text-sm">
                {passwords.length} entries
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {passwords.length === 0 ? (
              <div className="text-center py-12">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No passwords stored yet</h3>
                <p className="text-gray-500 mb-6">Start by creating your first password entry</p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/vault/create" className="flex items-center gap-2">
                    <PlusIcon className="h-4 w-4" />
                    Create Your First Password
                  </Link>
                </Button>
              </div>
            ) : (
              <PasswordTable 
                columns={tableColumns} 
                data={passwords} 
                loading={loading}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VaultPage;