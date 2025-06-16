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
import { insertFacePhotoSchema, type FacePhoto as FacePhotoType } from "@shared/schema";

// Simplified form schema for face photos
const facePhotoFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relationship: z.string().optional(),
  description: z.string().optional(),
  photo: z.any().refine((files) => files?.length > 0, "Photo is required")
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

interface RememberItem {
  id: number;
  title: string;
  content: string;
  category: string;
  photoUrl?: string;
  userId: number;
  createdAt: Date;
}

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

  // Fetch remember items (placeholder for now)
  const { data: rememberItems = [] } = useQuery<RememberItem[]>({
    queryKey: ['/api/caregiver/remember'],
    enabled: false // Will implement API later
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
    }
  });

  const addRememberMutation = useMutation({
    mutationFn: async (data: RememberItemData) => {
      // Will implement API call
      console.log("Adding remember item:", data);
    },
    onSuccess: () => {
      toast({ title: "Memory item added successfully" });
      setIsRememberDialogOpen(false);
      rememberForm.reset();
    }
  });

  const onSubmitPhoto = (data: FacePhotoFormData) => {
    addPhotoMutation.mutate(data);
  };

  const onSubmitRemember = (data: RememberItemData) => {
    addRememberMutation.mutate(data);
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
                    <DialogTitle>Add Face Photo</DialogTitle>
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
                            <FormControl>
                              <Input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => field.onChange(e.target.files)}
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-sm text-gray-500">Upload a clear photo of this person or pet</p>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsPhotoDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={addPhotoMutation.isPending}>
                          {addPhotoMutation.isPending ? "Adding..." : "Add Photo"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Photos List Placeholder */}
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No photos added yet</p>
                <p className="text-sm">Add photos to help with memory practice</p>
              </div>
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
                    <DialogTitle>Add Remember This Item</DialogTitle>
                  </DialogHeader>
                  <Form {...rememberForm}>
                    <form onSubmit={rememberForm.handleSubmit(onSubmitRemember)} className="space-y-4">
                      <FormField
                        control={rememberForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
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
                            <FormLabel>Category</FormLabel>
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
                            <FormLabel>Details</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Important details to remember" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-2">
                        <Label>Photo (Optional)</Label>
                        <Input type="file" accept="image/*" />
                        <p className="text-sm text-gray-500">Upload a helpful reference photo</p>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsRememberDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={addRememberMutation.isPending}>
                          {addRememberMutation.isPending ? "Adding..." : "Add Item"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Items List Placeholder */}
              <div className="text-center py-8 text-gray-500">
                <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No memory items added yet</p>
                <p className="text-sm">Add important information to help with daily life</p>
              </div>
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