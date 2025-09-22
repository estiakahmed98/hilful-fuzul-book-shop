"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import Image from "next/image";

const sampleReviews = [
  {
    id: 1,
    name: "আব্দুল্লাহ",
    rating: 5,
    date: "১০ মার্চ, ২০২৪",
    comment:
      "অসাধারণ বই! লেখকের ভাষা এবং বিষয়বস্তু খুবই আকর্ষণীয়। আমি এই বইটি সবাইকে পড়ার পরামর্শ দিব।",
    avatar: "/assets/authors/profile.png",
  },
  {
    id: 2,
    name: "ফাতিমা",
    rating: 4,
    date: "৫ মার্চ, ২০২৪",
    comment:
      "খুব ভালো বই, তবে কিছু জায়গায় আরও বিস্তারিত আলোচনা থাকলে ভালো হতো।",
    avatar: "/assets/authors/profile.png",
  },
  {
    id: 3,
    name: "রহিম",
    rating: 5,
    date: "২৮ ফেব্রুয়ারি, ২০২৪",
    comment:
      "এই বইটি আমার জীবনে অনেক পরিবর্তন এনেছে। লেখকের চিন্তাধারা অত্যন্ত গভীর এবং প্রেরণাদায়ক।",
    avatar: "/assets/authors/profile.png",
  },
];

// Define TypeScript props type
interface BookReviewsProps {
  bookId?: string; // Optional if not used
}

export default function BookReviews({ bookId }: BookReviewsProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [reviews, setReviews] = useState(sampleReviews);

  // Define parameter types
  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleRatingHover = (value: number) => {
    setHoverRating(value);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const handleSubmitReview = () => {
    if (rating === 0 || !comment.trim()) {
      return;
    }

    const newReview = {
      id: reviews.length + 1,
      name: "আপনি",
      rating,
      date: new Date().toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      comment,
      avatar: "/assets/authors/profile.png",
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment("");
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">রিভিউ লিখুন</h3>
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="mr-2">রেটিং:</span>
          <div className="flex" onMouseLeave={handleRatingLeave}>
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                className={`h-6 w-6 cursor-pointer ${
                  (hoverRating || rating) >= value
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
                onClick={() => handleRatingClick(value)}
                onMouseEnter={() => handleRatingHover(value)}
              />
            ))}
          </div>
        </div>
        <Textarea
          placeholder="আপনার মতামত লিখুন..."
          className="mb-2"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button onClick={handleSubmitReview}>রিভিউ জমা দিন</Button>
      </div>

      <div className="border-t pt-6 mt-6">
        <h3 className="text-xl font-bold mb-4">গ্রাহকদের রিভিউ</h3>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">এখনও কোন রিভিউ নেই।</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-start">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={review.avatar || "/placeholder.svg"}
                      alt={review.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{review.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                    <div className="flex my-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          className={`h-4 w-4 ${
                            review.rating >= value
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
