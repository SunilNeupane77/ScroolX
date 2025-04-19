"use client";

import type { Prisma } from "@prisma/client";
import { IKVideo, ImageKitProvider } from "imagekitio-next";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardFooter } from "../ui/card";
import { Heart, MessageCircle, Eye, Music, MapPin, X } from "lucide-react";
import { useRouter } from "next/navigation";
import CommentSection from "./comment-section";
import { useUser } from "@clerk/nextjs";

const urlEndPoint = process.env.NEXT_PUBLIC_URL_ENDPOINT as string;
console.log("ImageKit URL Endpoint:", urlEndPoint);

interface Comment {
  id: string;
  content: string;
  userId: string;
  shortsId: string;
  createdAt: Date;
  updateAt: Date;
  user: {
    name: string;
    email: string;
  };
}

type ShortCardProps = {
  short: {
    id: string;
    title: string;
    description: string;
    url: string;
    userId: string;
    createdAt: Date;
    updateAt: Date;
    likes: number;
    views: number;
    duration: number;
    thumbnailUrl: string | null;
    isPublic: boolean;
    hashtags: string[];
    music: string | null;
    location: string | null;
    comments?: Comment[];
    user: {
      name: string;
      email: string;
    };
  };
};

const ShortCard: React.FC<ShortCardProps> = ({ short }) => {
  const [likes, setLikes] = useState(short.likes);
  const [views, setViews] = useState(short.views);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(short.comments || []);
  const router = useRouter();
  const { user: currentUser } = useUser();
  const relativePath = short.url.startsWith(urlEndPoint)
    ? short.url.replace(urlEndPoint, "")
    : short.url;

  useEffect(() => {
    // Track view when component mounts
    const trackView = async () => {
      try {
        await fetch(`/api/shorts/${short.id}/view`, {
          method: "POST",
        });
        setViews((prev) => prev + 1);
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    };

    trackView();
  }, [short.id]);

  const handleLike = async () => {
    if (isLiked) return;

    try {
      const response = await fetch(`/api/shorts/${short.id}/like`, {
        method: "POST",
      });

      if (response.ok) {
        setLikes((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error liking short:", error);
    }
  };

  const handleCommentClick = async () => {
    if (!showComments) {
      try {
        const response = await fetch(`/api/shorts/${short.id}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
    setShowComments(!showComments);
  };

  const handleCloseComments = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowComments(false);
  };

  console.log("Short URL:", short.url);
  console.log("Relative Path for IKVideo:", relativePath);

  return (
    <div className="relative group">
      <Card className="p-0 w-[360px] h-[640px] flex flex-col items-center justify-center overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative transform hover:scale-[1.02]">
        <ImageKitProvider urlEndpoint={urlEndPoint}>
          <div className="absolute inset-0 w-full h-full transition-opacity duration-300">
            <IKVideo
              path={relativePath.startsWith("/") ? relativePath : `/${relativePath}`}
              transformation={[{ height: "640", width: "360" }]}
              autoPlay
              muted
              loop
              controls
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </ImageKitProvider>

        {/* Channel Information */}
        <CardFooter className="absolute bottom-20 -left-2 text-white transition-all duration-300 transform group-hover:translate-y-0">
          <div>
            <div className="flex items-center space-x-2">
              <div className="transform transition-transform duration-300 hover:scale-110">
                <Avatar className="w-10 h-10 border-2 border-white">
                  <AvatarImage 
                    src={currentUser?.imageUrl || ""} 
                    alt={`${short.user.name}'s profile`}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    {short.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold">{short.title}</h3>
                <span className="text-sm">{short.user.name}</span>
              </div>
            </div>
            <div className="text-sm mt-2">
              <p>{short.description}</p>
            </div>
          </div>
        </CardFooter>

        {/* Engagement Metrics */}
        <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-4 transition-all duration-300 transform group-hover:translate-x-0">
          <div className="flex flex-col items-center transform transition-transform duration-300 hover:scale-110 active:scale-95">
            <Heart 
              className={`w-6 h-6 cursor-pointer transition-colors duration-300 ${isLiked ? 'text-red-500' : 'text-white hover:text-red-500'}`}
              onClick={handleLike}
            />
            <span className="text-white text-sm">{likes}</span>
          </div>
          <div className="flex flex-col items-center transform transition-transform duration-300 hover:scale-110 active:scale-95">
            <MessageCircle 
              className={`w-6 h-6 cursor-pointer transition-colors duration-300 ${showComments ? 'text-blue-500' : 'text-white hover:text-blue-500'}`}
              onClick={handleCommentClick}
            />
            <span className="text-white text-sm">{comments.length}</span>
          </div>
          <div className="flex flex-col items-center">
            <Eye className="w-6 h-6 text-white" />
            <span className="text-white text-sm">{views}</span>
          </div>
        </div>

        {/* Additional Metadata */}
        <div className="absolute bottom-4 left-4 right-4 text-white text-sm transition-all duration-300 transform group-hover:translate-y-0">
          {short.music && (
            <div className="flex items-center space-x-2 mb-2 transition-transform duration-300 hover:translate-x-1">
              <Music className="w-4 h-4" />
              <span>{short.music}</span>
            </div>
          )}
          {short.location && (
            <div className="flex items-center space-x-2 transition-transform duration-300 hover:translate-x-1">
              <MapPin className="w-4 h-4" />
              <span>{short.location}</span>
            </div>
          )}
          {short.hashtags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {short.hashtags.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-blue-400 transition-transform duration-300 hover:scale-110 active:scale-95"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Comments Section */}
      {showComments && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300"
          onClick={handleCloseComments}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto transition-all duration-300 transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleCloseComments}
                className="p-2 rounded-full hover:bg-white/10 transition-all duration-300 transform hover:rotate-90 active:scale-90"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <CommentSection shortId={short.id} initialComments={comments} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortCard;
