import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, Users, Brain, Heart, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link } from "wouter";
import { type FacePhoto } from "@shared/schema";

export default function FacesGamePage() {
  const { user } = useAuth();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [shuffledPhotos, setShuffledPhotos] = useState<FacePhoto[]>([]);

  // Fetch face photos
  const { data: facePhotos = [], isLoading } = useQuery<FacePhoto[]>({
    queryKey: ['/api/face-photos'],
  });

  // Shuffle photos when game starts or photos change
  useEffect(() => {
    if (facePhotos.length >= 3) {
      const shuffled = shuffleArray(facePhotos);
      setShuffledPhotos(shuffled);
      setCurrentPhotoIndex(0);
      setIsFlipped(false);
    }
  }, [facePhotos, gameStarted]);

  const currentPhoto = shuffledPhotos[currentPhotoIndex];
  const hasEnoughPhotos = facePhotos.length >= 3;

  // Fisher-Yates shuffle algorithm for true randomization
  const shuffleArray = (array: FacePhoto[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleFlipCard = () => {
    setIsFlipped(true);
  };

  const handleNextPhoto = () => {
    setIsFlipped(false);
    const nextIndex = (currentPhotoIndex + 1) % shuffledPhotos.length;
    
    // Re-shuffle when we complete a full cycle to keep it random
    if (nextIndex === 0) {
      const newShuffled = shuffleArray(facePhotos);
      setShuffledPhotos(newShuffled);
      setCurrentPhotoIndex(0);
    } else {
      setCurrentPhotoIndex(nextIndex);
    }
  };

  const handlePrevPhoto = () => {
    setIsFlipped(false);
    setCurrentPhotoIndex((prev) => (prev - 1 + shuffledPhotos.length) % shuffledPhotos.length);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleQuitGame = () => {
    setGameStarted(false);
    setIsFlipped(false);
    setCurrentPhotoIndex(0);
  };

  const handleRestart = () => {
    const shuffled = shuffleArray(facePhotos);
    setShuffledPhotos(shuffled);
    setCurrentPhotoIndex(0);
    setIsFlipped(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">You need to be signed in to play the faces game.</p>
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your photos...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation Bar - Mobile Optimized */}
      <nav className="bg-white border-b-2 border-gray-200 sticky top-0 z-50" role="navigation" aria-label="Faces game navigation">
        <div className="max-w-6xl mx-auto px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2 md:space-x-3 cursor-pointer">
                <Brain className="text-[var(--button-primary)] w-6 h-6 md:w-8 md:h-8" aria-hidden="true" />
                <span className="text-lg md:text-2xl font-bold">heyMemory</span>
              </div>
            </Link>
            
            {/* Desktop: Centered title */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Faces Game</h1>
            </div>
            
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="outline" className="touch-button bg-white text-black font-bold text-sm md:text-lg px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl border-2 border-gray-300 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-gray-400 transition-colors">
                  <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Mobile: Title below nav */}
          <div className="md:hidden text-center mt-2 pb-2">
            <h1 className="text-xl font-bold text-gray-900">Faces Game</h1>
          </div>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {!hasEnoughPhotos ? (
          /* Not Enough Photos Screen */
          (<div className="text-center">
            <Card className="max-w-2xl mx-auto bg-white shadow-lg">
              <CardContent className="p-12">
                <div className="mb-8">
                  <Users className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Need More Photos
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">To play the faces game, you need at least 3 photos of family, friends, pets or caregivers.</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Currently you have {facePhotos.length} photo{facePhotos.length !== 1 ? 's' : ''}
                  </h3>
                  <p className="text-blue-700">
                    Add {3 - facePhotos.length} more photo{(3 - facePhotos.length) !== 1 ? 's' : ''} to start playing
                  </p>
                </div>

                <div className="space-y-4">
                  <Link href="/caregiver">
                    <Button size="lg" className="w-full text-lg py-6">
                      <Users className="w-5 h-5 mr-3" />
                      Add Photos Now
                    </Button>
                  </Link>
                  <p className="text-sm text-gray-500">
                    A caregiver can help you add photos of important people in your life
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>)
        ) : !gameStarted ? (
          /* Game Start Screen */
          (<div className="text-center">
            <Card className="max-w-2xl mx-auto bg-white shadow-lg">
              <CardContent className="p-12">
                <div className="mb-8">
                  <Brain className="w-20 h-20 text-blue-600 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Ready to Play!
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Exercise your memory by recognizing faces of people you love.
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">
                    How to Play:
                  </h3>
                  <div className="text-left space-y-2 text-green-800">
                    <p>• Look at each photo carefully</p>
                    <p>• Try to remember their name and relationship</p>
                    <p>• Touch the photo to see the answer</p>
                    <p>• Take your time - this is practice, not a test</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button 
                    size="lg" 
                    className="w-full bg-blue-600 text-white font-bold text-xl py-6 px-8 rounded-xl border-2 border-blue-600 hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-colors" 
                    onClick={handleStartGame}
                  >
                    <Heart className="w-6 h-6 mr-3" />
                    Start Game
                  </Button>
                  <p className="text-sm text-gray-500">
                    Play daily to keep memories of loved ones fresh
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>)
        ) : (
          /* Game Play Screen */
          (<div className="text-center">
            <div className="max-w-2xl mx-auto">
              {/* Game Card */}
              <div className="relative mb-8">
                <div 
                  className={`w-full bg-white shadow-2xl transition-all duration-700 cursor-pointer rounded-lg overflow-hidden ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                  onClick={!isFlipped ? handleFlipCard : undefined}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    height: '650px'
                  }}
                >
                  {!isFlipped ? (
                    /* Front of Card - Photo */
                    (<div className="p-0 flex flex-col h-full w-full">
                      <div className="w-full h-96 bg-gray-100 flex items-center justify-center overflow-hidden">
                        {currentPhoto?.photoUrl ? (
                          <img
                            src={currentPhoto.photoUrl}
                            alt="Person to remember"
                            className="w-96 h-96 object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-gray-400">
                            <Users className="w-20 h-20 mb-4" />
                            <p className="text-lg">No photo available</p>
                          </div>
                        )}
                      </div>
                      <div className="p-8 flex-1 flex flex-col justify-center">
                        <h3 className="font-bold text-gray-900 mb-4 text-[32px]">Who is this?</h3>
                        
                        <Button size="lg" className="w-full">
                          <Heart className="w-5 h-5 mr-2" />
                          See Answer
                        </Button>
                      </div>
                    </div>)
                  ) : (
                    /* Back of Card - Answer */
                    (<div className="p-0 flex flex-col h-full w-full">
                      <div className="w-full aspect-square bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center overflow-hidden">
                        <div className="text-center space-y-4 p-6">
                          <div className="bg-white rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-red-500" />
                          </div>
                          
                          <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-2">
                              {currentPhoto?.name}
                            </h2>
                            <Badge variant="secondary" className="text-lg px-4 py-2">
                              {currentPhoto?.relationship}
                            </Badge>
                          </div>

                          {currentPhoto?.description && (
                            <div className="bg-white/50 rounded-lg p-4 max-w-sm mx-auto">
                              <p className="text-gray-700 text-lg leading-relaxed">
                                {currentPhoto.description}
                              </p>
                            </div>
                          )}

                          <Button 
                            size="lg" 
                            onClick={() => setIsFlipped(false)} 
                            variant="outline" 
                            className="w-full max-w-sm mx-auto bg-white text-black font-bold text-xl py-4 px-8 rounded-xl border-2 border-gray-300 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors"
                          >
                            <Eye className="w-6 h-6 mr-3" />
                            See Photo Again
                          </Button>
                        </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col justify-center">
                        <div className="flex gap-4">
                          <Button 
                            size="lg" 
                            onClick={handlePrevPhoto} 
                            variant="outline" 
                            className="flex-1 bg-white text-black font-bold text-xl py-4 px-6 rounded-xl border-2 border-gray-300 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={currentPhotoIndex === 0}
                          >
                            <ChevronLeft className="w-6 h-6 mr-2" />
                            Previous
                          </Button>
                          
                          <Button 
                            size="lg" 
                            onClick={handleNextPhoto} 
                            className="flex-1 bg-blue-600 text-white font-bold text-xl py-4 px-6 rounded-xl border-2 border-blue-600 hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-colors"
                          >
                            Next
                            <ChevronRight className="w-6 h-6 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>)
                  )}
                </div>
              </div>

              {/* Quit Game Button - Always visible for easy access */}
              <div className="mt-8 flex justify-center">
                <Button 
                  size="lg" 
                  onClick={handleQuitGame} 
                  variant="destructive" 
                  className="bg-red-600 text-white font-bold text-xl py-4 px-8 rounded-xl border-2 border-red-600 hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-400 transition-colors flex items-center gap-3"
                >
                  <X className="w-6 h-6" />
                  Quit Game
                </Button>
              </div>

            </div>
          </div>)
        )}
      </div>
    </div>
  );
}