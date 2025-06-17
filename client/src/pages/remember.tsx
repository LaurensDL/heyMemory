import { useState } from "react";
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
  Tag
} from "lucide-react";
import { Link } from "wouter";
import type { RememberItem } from "@shared/schema";

export default function RememberPage() {
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
      {/* Navigation Bar */}
      <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-50" role="navigation" aria-label="Remember this navigation">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <Brain className="text-[var(--button-primary)] w-8 h-8" aria-hidden="true" />
                <span className="text-2xl font-bold">heyMemory</span>
              </div>
            </Link>
            
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-2xl font-bold text-gray-900">Remember This</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" className="bg-white text-black font-bold text-lg px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors">
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
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Important Things to Remember</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Click on any card to view detailed information and helpful photos
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your memory items...</p>
          </div>
        ) : rememberItems.length > 0 ? (
          <>
            {/* Items Count */}
            <div className="text-center mb-8">
              <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-lg">
                {rememberItems.length} memory item{rememberItems.length !== 1 ? 's' : ''} available
              </span>
            </div>

            {/* Items Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {rememberItems.map((item) => (
                <Card 
                  key={item.id} 
                  className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 hover:border-green-300"
                  onClick={() => handleItemClick(item)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-bold text-gray-900 flex-1 pr-2">
                        {item.title}
                      </CardTitle>
                      <Eye className="w-5 h-5 text-gray-400 flex-shrink-0" />
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No Memory Items Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Ask your caregiver to add important information and reminders for you.
                </p>
                <Link href="/caregiver">
                  <Button className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-6 py-3">
                    <FileText className="w-5 h-5 mr-2" />
                    Caregiver Tools
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {selectedItem?.title}
              </DialogTitle>
            </DialogHeader>
            
            {selectedItem && (
              <div className="space-y-6">
                {/* Category Badge */}
                <div>
                  <Badge variant="secondary" className="text-sm">
                    <Tag className="w-4 h-4 mr-1" />
                    {selectedItem.category}
                  </Badge>
                </div>

                {/* Photo */}
                {selectedItem.photoUrl && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Reference Photo:</h4>
                    <img 
                      src={selectedItem.photoUrl} 
                      alt={selectedItem.title}
                      className="w-full max-w-md mx-auto rounded-lg border shadow-sm"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Details:</h4>
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {selectedItem.content}
                  </p>
                </div>

                {/* Date */}
                <div className="flex items-center text-sm text-gray-500 pt-4 border-t">
                  <Clock className="w-4 h-4 mr-2" />
                  Added on {formatDate(selectedItem.createdAt)}
                </div>

                {/* Close Button */}
                <div className="flex justify-end pt-4">
                  <Button onClick={handleCloseDetail} className="bg-green-600 hover:bg-green-700 text-white">
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}