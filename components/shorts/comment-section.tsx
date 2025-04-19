"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";

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

interface CommentSectionProps {
  shortId: string;
  initialComments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ shortId, initialComments }) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/shorts/${shortId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments((prev) => [newCommentData, ...prev]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-black/50 backdrop-blur-sm rounded-lg">
      <h3 className="text-white text-lg font-semibold mb-4">Comments ({comments.length})</h3>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={user?.imageUrl} alt="user avatar" />
            <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="bg-black/30 text-white border-gray-700 focus:border-gray-600"
              rows={2}
            />
            <div className="flex justify-end mt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src="" alt="commenter avatar" />
              <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{comment.user.name}</span>
                <span className="text-gray-400 text-sm">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-white mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection; 