"use client"

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Lock, User, Eye, EyeOff, NotebookText, KeyRound, FolderPen, ArrowLeft, Save, Shield, AlertCircle} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useState, useCallback, useMemo} from "react";
import toast from "react-hot-toast";
import {Skeleton} from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  name: string;
  username: string;
  password: string;
  notes: string;
}

const EditPage = () => {
  const router = useRouter();
  const { id } = useParams();
  
  const [form, setForm] = useState<FormData>({
    name: "",
    username: "",
    password: "",
    notes: ""
  });
  
  const [originalForm, setOriginalForm] = useState<FormData>({
    name: "",
    username: "",
    password: "",
    notes: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [error, setError] = useState<string | null>(null);

  // Memoized form validation
  const isFormValid = useMemo(() => {
    return form.name.trim().length > 0 && 
           form.username.trim().length > 0 && 
           form.password.trim().length > 0;
  }, [form]);

  // Check if form has changes
  const hasChanges = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(originalForm);
  }, [form, originalForm]);

  // Validate form
  const validateForm = useCallback(() => {
    const errors: Partial<FormData> = {};
    
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.username.trim()) errors.username = 'Username is required';
    if (!form.password.trim()) errors.password = 'Password is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form]);

  // Optimized update handler
  const handleUpdate = useCallback(async () => {
    if (!validateForm()) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/vault/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        toast.success(`${form.name} updated successfully!`);
        router.push("/vault");
      } else {
        const result = await response.json();
        toast.error(result.error || "Failed to update password");
      }
    } catch (error) {
      console.error("Failed to update", error);
      toast.error("Failed to update password");
    } finally {
      setIsUpdating(false);
    }
  }, [form, id, validateForm, router]);

  // Optimized change handler
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [formErrors]);

  // Optimized cancel handler
  const handleCancel = useCallback(() => {
    if (hasChanges) {
      const confirmed = confirm("You have unsaved changes. Are you sure you want to cancel?");
      if (!confirmed) return;
    }
    router.push("/vault");
  }, [hasChanges, router]);

  // Fetch data effect
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/vault/${id}`, {
          method: "GET",
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();

        if (json.success) {
          const formData = {
            name: json.data.name,
            username: json.data.username,
            password: json.data.password,
            notes: json.data.notes || "",
          };
          setForm(formData);
          setOriginalForm(formData);
        } else {
          throw new Error(json.error || "Failed to fetch password data");
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        setError(error instanceof Error ? error.message : "Failed to load password data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Lock className="h-6 w-6 text-blue-600"/>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Update Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-11 w-full" />
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between pt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Error Loading Password</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => router.push("/vault")} className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vault
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Lock className="h-6 w-6 text-blue-600"/>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Update Password</CardTitle>
          <p className="text-gray-600 mt-2">Modify your stored credentials</p>
          {hasChanges && (
            <Badge variant="outline" className="mt-2 text-orange-600 border-orange-300">
              Unsaved changes
            </Badge>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <FolderPen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"/>
              <Input
                id="name"
                name="name"
                placeholder="Enter name"
                className={`pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${formErrors.name ? 'border-red-500' : ''}`}
                value={form.name}
                onChange={handleChange}
                disabled={isUpdating}
              />
            </div>
            {formErrors.name && (
              <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
            )}
          </div>

          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"/>
              <Input
                id="username"
                name="username"
                placeholder="Enter your username"
                className={`pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${formErrors.username ? 'border-red-500' : ''}`}
                value={form.username}
                onChange={handleChange}
                disabled={isUpdating}
              />
            </div>
            {formErrors.username && (
              <p className="text-sm text-red-500 mt-1">{formErrors.username}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
              <Badge variant="secondary" className="ml-2 text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Encrypted
              </Badge>
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"/>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${formErrors.password ? 'border-red-500' : ''}`}
                value={form.password}
                onChange={handleChange}
                disabled={isUpdating}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                disabled={isUpdating}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {formErrors.password && (
              <p className="text-sm text-red-500 mt-1">{formErrors.password}</p>
            )}
          </div>

          {/* Notes Field */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Notes <span className="text-gray-400 text-xs">(Optional)</span>
            </Label>
            <div className="relative">
              <NotebookText className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add any additional notes..."
                className="pl-10 min-h-[100px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={form.notes}
                onChange={handleChange}
                disabled={isUpdating}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6">
          <Button 
            variant="outline" 
            onClick={handleCancel} 
            disabled={isUpdating}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            disabled={isUpdating || !isFormValid || !hasChanges}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Password
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditPage;