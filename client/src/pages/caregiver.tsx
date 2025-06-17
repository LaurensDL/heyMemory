import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  ArrowLeft, 
  Upload, 
  Plus, 
  Trash2, 
  Edit, 
  Users, 
  Lightbulb,
  Heart,
  Camera,
  FileText
} from "lucide-react";
import { Link } from "wouter";
import { z } from "zod";

// Schema for face photos - using the shared schema from backend
import { insertFacePhotoSchema, insertRememberItemSchema, type FacePhoto as FacePhotoType, type RememberItem } from "@shared/schema";

// Schema for face photos - makes photo optional for edits
const facePhotoFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relationship: z.string().optional(),
  description: z.string().optional(),
  photo: z.any().optional()
});

// Schema for remember this items
const rememberItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  photo: z.any().optional()
});

type FacePhotoFormData = z.infer<typeof facePhotoFormSchema>;
type RememberItemData = z.infer<typeof rememberItemSchema>;

export default function CaregiverPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [isRememberDialogOpen, setIsRememberDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<FacePhotoType | null>(null);
  const [editingRemember, setEditingRemember] = useState<RememberItem | null>(null);

  // Form setup
  const photoForm = useForm<FacePhotoFormData>({
    resolver: zodResolver(facePhotoFormSchema),
    defaultValues: {
      name: "",
      relationship: "",
      description: ""
    }
  });

  const rememberForm = useForm<RememberItemData>({
    resolver: zodResolver(rememberItemSchema),
    defaultValues: {
      title: "",
      content: "",
      category: ""
    }
  });

  // Fetch face photos
  const { data: facePhotos = [] } = useQuery<FacePhotoType[]>({
    queryKey: ['/api/face-photos'],
  });

  // Fetch remember items
  const { data: rememberItems = [] } = useQuery<RememberItem[]>({
    queryKey: ['/api/remember-items'],
  });

  // Mutations
  const addPhotoMutation = useMutation({
    mutationFn: async (data: FacePhotoFormData) => {
      let photoUrl = "";
      
      // Convert file to data URL if photo is provided
      if (data.photo && data.photo.length > 0) {
        const file = data.photo[0];
        photoUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }
      
      return apiRequest("POST", "/api/face-photos", {
        name: data.name,
        relationship: data.relationship || "",
        description: data.description || "",
        photoUrl: photoUrl
      });
    },
    onSuccess: () => {
      toast({ title: "Photo added successfully" });
      setIsPhotoDialogOpen(false);
      photoForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/face-photos'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error adding photo", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const addRememberMutation = useMutation({
    mutationFn: async (data: RememberItemData): Promise<RememberItem> => {
      let photoUrl = "";
      
      // Convert file to data URL if photo is provided
      if (data.photo && data.photo.length > 0) {
        const file = data.photo[0];
        photoUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }
      
      const response = await apiRequest("POST", "/api/remember-items", {
        title: data.title,
        content: data.content,
        category: data.category,
        photoUrl: photoUrl || undefined
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Memory item added successfully" });
      setIsRememberDialogOpen(false);
      rememberForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/remember-items'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error adding memory item", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const updateRememberMutation = useMutation({
    mutationFn: async (data: RememberItemData): Promise<RememberItem> => {
      if (!editingRemember) throw new Error("No item being edited");
      
      let photoUrl = editingRemember.photoUrl;
      
      // Convert file to data URL if photo is provided
      if (data.photo && data.photo.length > 0) {
        const file = data.photo[0];
        photoUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }
      
      const response = await apiRequest("PUT", `/api/remember-items/${editingRemember.id}`, {
        title: data.title,
        content: data.content,
        category: data.category,
        photoUrl: photoUrl || undefined
      });
      return response.json();
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['/api/remember-items'] });
      const previousItems = queryClient.getQueryData(['/api/remember-items']);
      
      queryClient.setQueryData(['/api/remember-items'], (old: RememberItem[] = []) => 
        old.map(item => 
          item.id === editingRemember?.id 
            ? { ...item, ...newData } 
            : item
        )
      );
      
      return { previousItems };
    },
    onSuccess: (updatedItem: RememberItem) => {
      toast({ title: "Memory item updated successfully" });
      setIsRememberDialogOpen(false);
      setEditingRemember(null);
      rememberForm.reset();
      
      queryClient.setQueryData(['/api/remember-items'], (old: RememberItem[] = []) => 
        old.map(item => item.id === updatedItem.id ? updatedItem : item)
      );
    },
    onError: (error: Error, newData, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(['/api/remember-items'], context.previousItems);
      }
      toast({ 
        title: "Error updating memory item", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deleteRememberMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/remember-items/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Memory item deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/remember-items'] });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error deleting memory item", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: number) => {
      return apiRequest("DELETE", `/api/face-photos/${photoId}`, {});
    },
    onMutate: async (photoId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['/api/face-photos'] });
      
      // Snapshot the previous value
      const previousPhotos = queryClient.getQueryData(['/api/face-photos']);
      
      // Optimistically update to remove the photo
      queryClient.setQueryData(['/api/face-photos'], (old: FacePhotoType[] | undefined) => {
        if (!old) return [];
        return old.filter(photo => photo.id !== photoId);
      });
      
      // Return a context object with the snapshotted value
      return { previousPhotos };
    },
    onSuccess: () => {
      toast({ title: "Photo deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/face-photos'] });
    },
    onError: (error: Error, photoId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['/api/face-photos'], context?.previousPhotos);
      toast({ 
        title: "Error deleting photo", 
        description: error.message,
        variant: "destructive" 
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['/api/face-photos'] });
    }
  });

  const updatePhotoMutation = useMutation<FacePhotoType, Error, FacePhotoFormData & { id: number }>({
    mutationFn: async (data: FacePhotoFormData & { id: number }) => {
      let photoUrl = "";
      
      // Convert file to data URL if new photo is provided
      if (data.photo && data.photo.length > 0) {
        const file = data.photo[0];
        photoUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }
      
      const response = await apiRequest("PATCH", `/api/face-photos/${data.id}`, {
        name: data.name,
        relationship: data.relationship || "",
        description: data.description || "",
        ...(photoUrl && { photoUrl: photoUrl })
      });
      
      return response.json() as Promise<FacePhotoType>;
    },
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['/api/face-photos'] });
      
      // Snapshot the previous value
      const previousPhotos = queryClient.getQueryData(['/api/face-photos']);
      
      // Convert photo to URL if provided for optimistic update
      let optimisticPhotoUrl = undefined;
      if (newData.photo && newData.photo.length > 0) {
        const file = newData.photo[0];
        optimisticPhotoUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }
      
      // Optimistically update to the new value
      queryClient.setQueryData(['/api/face-photos'], (old: FacePhotoType[] | undefined) => {
        if (!old) return [];
        return old.map(photo => 
          photo.id === newData.id 
            ? { 
                ...photo, 
                name: newData.name, 
                relationship: newData.relationship || "", 
                description: newData.description || "",
                ...(optimisticPhotoUrl && { photoUrl: optimisticPhotoUrl })
              }
            : photo
        );
      });
      
      // Return a context object with the snapshotted value
      return { previousPhotos };
    },
    onSuccess: (updatedPhoto: FacePhotoType) => {
      // Update the cache with the server response immediately
      queryClient.setQueryData(['/api/face-photos'], (old: FacePhotoType[] | undefined) => {
        if (!old) return [updatedPhoto];
        return old.map(photo => 
          photo.id === updatedPhoto.id ? updatedPhoto : photo
        );
      });
      
      toast({ title: "Photo updated successfully" });
      setIsPhotoDialogOpen(false);
      setEditingPhoto(null);
      photoForm.reset();
    },
    onError: (error: Error, newData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['/api/face-photos'], context?.previousPhotos);
      toast({ 
        title: "Error updating photo", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const onSubmitPhoto = (data: FacePhotoFormData) => {
    if (editingPhoto) {
      updatePhotoMutation.mutate({ ...data, id: editingPhoto.id });
    } else {
      addPhotoMutation.mutate(data);
    }
  };

  const onSubmitRemember = (data: RememberItemData) => {
    if (editingRemember) {
      updateRememberMutation.mutate(data);
    } else {
      addRememberMutation.mutate(data);
    }
  };

  const handleDeleteRemember = (id: number) => {
    if (confirm("Are you sure you want to delete this memory item?")) {
      deleteRememberMutation.mutate(id);
    }
  };

  const handleEditRemember = (item: RememberItem) => {
    setEditingRemember(item);
    rememberForm.reset({
      title: item.title,
      content: item.content,
      category: item.category,
      photo: undefined // Clear photo field for editing
    });
    setIsRememberDialogOpen(true);
  };

  const handleCancelRememberEdit = () => {
    setEditingRemember(null);
    rememberForm.reset({
      title: "",
      content: "",
      category: "",
      photo: undefined
    });
    setIsRememberDialogOpen(false);
  };

  const handleDeletePhoto = (photoId: number) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      deletePhotoMutation.mutate(photoId);
    }
  };

  const handleEditPhoto = (photo: FacePhotoType) => {
    setEditingPhoto(photo);
    photoForm.reset({
      name: photo.name,
      relationship: photo.relationship || "",
      description: photo.description || "",
      photo: undefined // Clear photo field for new selection
    });
    setIsPhotoDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingPhoto(null);
    photoForm.reset({
      name: "",
      relationship: "",
      description: "",
      photo: undefined // Clear photo field
    });
    setIsPhotoDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-50" role="navigation" aria-label="Caregiver navigation">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <Brain className="text-[var(--button-primary)] w-8 h-8" aria-hidden="true" />
                <span className="text-2xl font-bold">heyMemory</span>
              </div>
            </Link>
            
            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" className="bg-white text-black font-bold text-lg px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-100">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Caregiver Tools</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help your loved one by adding photos for the faces game and important information they should remember. 
            These tools are designed for caregivers, family, and friends to support memory care.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Face Photos Section */}
          <Card className="bg-white border-2 border-gray-300 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold flex items-center justify-center">
                <Camera className="w-8 h-8 mr-3 text-blue-600" />
                Faces Game Photos
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Add photos of important people for memory practice
              </p>
              <div className="mt-3 text-center">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                  {facePhotos.length} photo{facePhotos.length !== 1 ? 's' : ''} added
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Photo Button */}
              <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4">
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Photo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingPhoto ? 'Edit Photo' : 'Add Face Photo'}</DialogTitle>
                  </DialogHeader>
                  <Form {...photoForm}>
                    <form onSubmit={photoForm.handleSubmit(onSubmitPhoto)} className="space-y-4">
                      <FormField
                        control={photoForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter their name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={photoForm.control}
                        name="relationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ""} placeholder="e.g., Son, Daughter, Friend" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={photoForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea {...field} value={field.value || ""} placeholder="Special notes or memories" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={photoForm.control}
                        name="photo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Photo *</FormLabel>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  onChange={(e) => field.onChange(e.target.files)}
                                  className="hidden"
                                  id={`camera-input-${editingPhoto?.id || 'new'}`}
                                  key={`camera-${editingPhoto?.id || 'new'}`}
                                />
                                <Button 
                                  type="button"
                                  variant="outline"
                                  className="w-full h-12 border-2 border-dashed"
                                  onClick={() => document.getElementById(`camera-input-${editingPhoto?.id || 'new'}`)?.click()}
                                >
                                  <Camera className="w-5 h-5 mr-2" />
                                  Take Photo
                                </Button>
                              </div>
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => field.onChange(e.target.files)}
                                  className="hidden"
                                  id={`gallery-input-${editingPhoto?.id || 'new'}`}
                                  key={`gallery-${editingPhoto?.id || 'new'}`}
                                />
                                <Button 
                                  type="button"
                                  variant="outline"
                                  className="w-full h-12 border-2 border-dashed"
                                  onClick={() => document.getElementById(`gallery-input-${editingPhoto?.id || 'new'}`)?.click()}
                                >
                                  <Upload className="w-5 h-5 mr-2" />
                                  From Gallery
                                </Button>
                              </div>
                            </div>
                            <FormMessage />
                            {editingPhoto && (
                              <p className="text-sm text-blue-600 text-center mt-2">
                                Current photo will be replaced if you select a new one
                              </p>
                            )}
                            {!editingPhoto && (
                              <p className="text-sm text-gray-500 text-center mt-2">
                                Take a new photo or choose from your gallery
                              </p>
                            )}
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={addPhotoMutation.isPending || updatePhotoMutation.isPending}>
                          {(addPhotoMutation.isPending || updatePhotoMutation.isPending) 
                            ? (editingPhoto ? "Updating..." : "Adding...") 
                            : (editingPhoto ? "Update Photo" : "Add Photo")
                          }
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Photos List */}
              {facePhotos.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 mb-3">Added Photos:</h4>
                  {facePhotos.map((photo) => (
                    <div key={photo.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center space-x-4">
                        {photo.photoUrl && (
                          <img 
                            src={photo.photoUrl} 
                            alt={photo.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{photo.name}</p>
                          {photo.relationship && (
                            <p className="text-sm text-gray-600">{photo.relationship}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditPhoto(photo)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeletePhoto(photo.id)}
                          disabled={deletePhotoMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No photos added yet</p>
                  <p className="text-sm">Add photos to help with memory practice</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Remember This Section */}
          <Card className="bg-white border-2 border-gray-300 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold flex items-center justify-center">
                <FileText className="w-8 h-8 mr-3 text-green-600" />
                Remember This Items
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Add important information and memories
              </p>
              <div className="mt-3 text-center">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                  {rememberItems.length} item{rememberItems.length !== 1 ? 's' : ''} added
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Remember Item Button */}
              <Dialog open={isRememberDialogOpen} onOpenChange={setIsRememberDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-4">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Memory Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingRemember ? 'Edit Memory Item' : 'Add Remember This Item'}</DialogTitle>
                  </DialogHeader>
                  <Form {...rememberForm}>
                    <form onSubmit={rememberForm.handleSubmit(onSubmitRemember)} className="space-y-4">
                      <FormField
                        control={rememberForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="What should they remember?" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={rememberForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Family, Medical, Daily Routine" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={rememberForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Details *</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Important details to remember" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={rememberForm.control}
                        name="photo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Photo (Optional)</FormLabel>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  onChange={(e) => field.onChange(e.target.files)}
                                  className="hidden"
                                  id={`camera-input-remember-${editingRemember?.id || 'new'}`}
                                  key={`camera-remember-${editingRemember?.id || 'new'}`}
                                />
                                <Button 
                                  type="button"
                                  variant="outline"
                                  className="w-full h-12 border-2 border-dashed"
                                  onClick={() => document.getElementById(`camera-input-remember-${editingRemember?.id || 'new'}`)?.click()}
                                >
                                  <Camera className="w-5 h-5 mr-2" />
                                  Take Photo
                                </Button>
                              </div>
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => field.onChange(e.target.files)}
                                  className="hidden"
                                  id={`gallery-input-remember-${editingRemember?.id || 'new'}`}
                                  key={`gallery-remember-${editingRemember?.id || 'new'}`}
                                />
                                <Button 
                                  type="button"
                                  variant="outline"
                                  className="w-full h-12 border-2 border-dashed"
                                  onClick={() => document.getElementById(`gallery-input-remember-${editingRemember?.id || 'new'}`)?.click()}
                                >
                                  <Upload className="w-5 h-5 mr-2" />
                                  From Gallery
                                </Button>
                              </div>
                            </div>
                            <FormMessage />
                            {editingRemember && (
                              <p className="text-sm text-blue-600 text-center mt-2">
                                Current photo will be replaced if you select a new one
                              </p>
                            )}
                            {!editingRemember && (
                              <p className="text-sm text-gray-500 text-center mt-2">
                                Take a new photo or choose from your gallery
                              </p>
                            )}
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={handleCancelRememberEdit}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={addRememberMutation.isPending || updateRememberMutation.isPending}>
                          {(addRememberMutation.isPending || updateRememberMutation.isPending) 
                            ? (editingRemember ? "Updating..." : "Adding...") 
                            : (editingRemember ? "Update Item" : "Add Item")
                          }
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Items List */}
              {rememberItems.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 mb-3">Memory Items:</h4>
                  {rememberItems.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h5 className="font-semibold text-gray-900">{item.title}</h5>
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{item.content}</p>
                          {item.photoUrl && (
                            <div className="mt-3">
                              <img 
                                src={item.photoUrl} 
                                alt={item.title}
                                className="w-20 h-20 rounded-lg object-cover border"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditRemember(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteRemember(item.id)}
                            disabled={deleteRememberMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No memory items added yet</p>
                  <p className="text-sm">Add important information to help with daily life</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions Section */}
        <Card className="mt-8 bg-blue-50 border-2 border-blue-200">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-4 text-blue-800">How to Use These Tools</h3>
            <div className="grid md:grid-cols-2 gap-6 text-blue-700">
              <div>
                <h4 className="font-bold mb-2">Faces Game Photos:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Add photos of family members, friends, and caregivers</li>
                  <li>• Include clear, recent photos showing the person's face</li>
                  <li>• Add helpful details about their relationship</li>
                  <li>• Photos will appear in the faces game for practice</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">Remember This Items:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Add important daily information and reminders</li>
                  <li>• Include medical information, routines, and preferences</li>
                  <li>• Upload reference photos to help with locations and items</li>
                  <li>• Items will appear in the Remember This section</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}