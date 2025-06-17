import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  ArrowLeft, 
  FileText,
  Eye,
  Clock,
  Tag,
  Phone
} from "lucide-react";
import { Link } from "wouter";
import type { RememberItem } from "@shared/schema";

export default function RememberPage() {
  useEffect(() => {
    // Add canonical URL
    const canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = window.location.origin + '/remember';
    document.head.appendChild(canonicalLink);

    // Add language attribute
    document.documentElement.lang = 'en';

    // Screen reader announcement for page load
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Remember This page loaded. View and manage your important reminders, notes, and information.';
    document.body.appendChild(announcement);

    // Remove announcement after screen readers have time to read it
    const announcementTimer = setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);

    return () => {
      const existingCanonical = document.querySelector('link[rel="canonical"]');
      if (existingCanonical) {
        document.head.removeChild(existingCanonical);
      }
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
      clearTimeout(announcementTimer);
    };
  }, []);
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = useState<RememberItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Fetch remember items
  const { data: rememberItems = [], isLoading } = useQuery<RememberItem[]>({
    queryKey: ['/api/remember-items'],
  });

  const handleItemClick = (item: RememberItem) => {
    setSelectedItem(item);
    setIsDetailDialogOpen(true);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
    setIsDetailDialogOpen(false);
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation Bar - Mobile Optimized */}
      <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-50" role="navigation" aria-label="Remember this navigation">
        <div className="max-w-6xl mx-auto px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2 md:space-x-3 cursor-pointer">
                <Brain className="text-[var(--button-primary)] w-6 h-6 md:w-8 md:h-8" aria-hidden="true" />
                <span className="text-lg md:text-2xl font-bold">heyMemory</span>
              </div>
            </Link>
            
            {/* Mobile: Simple centered title */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-2xl lg:text-4xl font-black text-gray-900">Remember This</h1>
            </div>
            
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="outline" className="touch-button bg-white text-black font-bold text-sm md:text-xl px-3 md:px-8 py-2 md:py-4 rounded-lg md:rounded-xl border-2 md:border-3 border-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-gray-400 transition-colors">
                  <ArrowLeft className="w-4 h-4 md:w-6 md:h-6 mr-1 md:mr-3" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Mobile: Title below nav */}
          <div className="md:hidden text-center mt-2 pb-2">
            <h1 className="text-2xl font-black text-gray-900">Remember This</h1>
          </div>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6">Things to Remember</h2>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-xl font-bold text-gray-700">Loading your memory items...</p>
          </div>
        ) : rememberItems.length > 0 ? (
          <>
            {/* Caregiver Phone Number Card - Mobile Optimized Emergency Card */}
            {user?.caregiverPhoneNumber && (
              <div className="mb-6 md:mb-8">
                <Card className="max-w-sm md:max-w-md mx-auto bg-red-50 border-3 border-red-300 shadow-xl">
                  <CardContent className="p-4 md:p-8 text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <Phone className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-red-800 mb-3 md:mb-4">
                      Call Your Caregiver
                    </h3>
                    <a href={`tel:${user.caregiverPhoneNumber}`}>
                      <Button className="touch-button bg-red-600 text-white font-black text-lg md:text-2xl px-6 md:px-8 py-4 md:py-6 rounded-xl border-3 border-red-600 hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-400 transition-colors w-full">
                        <Phone className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                        {user.caregiverPhoneNumber}
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Items Count - Mobile Optimized */}
            <div className="text-center mb-6 md:mb-8">
              <span className="inline-block bg-green-100 text-green-800 px-4 md:px-6 py-2 md:py-3 rounded-full font-black text-lg md:text-2xl border-2 border-green-300">
                {rememberItems.length} memory item{rememberItems.length !== 1 ? 's' : ''} available
              </span>
            </div>

            {/* Items Grid - Mobile First Design */}
            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              {rememberItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="mobile-card bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 hover:border-green-300 active:scale-95"
                  onClick={() => handleItemClick(item)}
                >
                  <CardHeader className="pb-2 md:pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="tracking-tight font-black text-gray-900 flex-1 pr-2 text-2xl md:text-[32px]">
                        {item.title}
                      </CardTitle>
                      <Eye className="w-5 h-5 md:w-6 md:h-6 text-gray-600 flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {item.photoUrl && (
                      <div>
                        <img 
                          src={item.photoUrl} 
                          alt={item.title}
                          className="w-full aspect-square object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Card className="max-w-md mx-auto bg-white shadow-lg">
              <CardContent className="p-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-4xl font-black text-gray-900 mb-6">
                  No Memory Items Yet
                </h3>
                <p className="text-xl font-bold text-gray-700 mb-8">
                  Ask your caregiver to add important information and reminders for you.
                </p>
                <Link href="/caregiver">
                  <Button className="bg-black text-white font-black text-2xl px-8 py-6 rounded-xl border-3 border-black hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors">
                    <FileText className="w-6 h-6 mr-3" />
                    Caregiver Tools
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detail Dialog - Elderly-Friendly Full Screen */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] h-auto p-0 bg-white rounded-lg">
            <div className="flex flex-col h-full">
              {/* Header */}
              <DialogHeader className="p-4 md:p-6 pb-2 border-b border-gray-200 flex-shrink-0">
                <DialogTitle className="text-2xl md:text-3xl font-black text-gray-900 text-center">
                  {selectedItem?.title}
                </DialogTitle>
              </DialogHeader>
              
              {selectedItem && (
                <div className="flex-1 p-4 md:p-6 overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 h-full">
                    {/* Photo Column */}
                    {selectedItem.photoUrl && (
                      <div className="flex items-center justify-center">
                        <img 
                          src={selectedItem.photoUrl} 
                          alt={selectedItem.title}
                          className="max-w-full max-h-[60vh] object-contain rounded-lg border-2 border-gray-300 shadow-lg"
                        />
                      </div>
                    )}

                    {/* Content Column */}
                    <div className={`flex flex-col justify-center ${!selectedItem.photoUrl ? 'lg:col-span-2' : ''}`}>
                      <div className="space-y-4">
                        <p className="text-gray-800 text-lg md:text-xl lg:text-2xl font-bold leading-relaxed whitespace-pre-wrap">
                          {selectedItem.content}
                        </p>
                        
                        {/* Metadata */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                          <Badge variant="secondary" className="text-sm md:text-base px-3 py-1">
                            <Tag className="w-4 h-4 mr-1" />
                            {selectedItem.category}
                          </Badge>
                          <Badge variant="outline" className="text-sm md:text-base px-3 py-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDate(selectedItem.createdAt)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Footer with close button */}
              <div className="p-4 md:p-6 pt-2 border-t border-gray-200 flex justify-center flex-shrink-0">
                <Button 
                  onClick={handleCloseDetail} 
                  className="touch-button bg-red-600 text-white font-black text-lg md:text-xl px-6 md:px-8 py-3 md:py-4 rounded-xl border-2 border-red-600 hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-red-400 transition-colors"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}