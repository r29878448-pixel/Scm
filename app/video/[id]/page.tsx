'use client';

import React from 'react';
import useSWR from 'swr';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { fetchVideoDetails } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Play, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function VideoPlayerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const courseId = searchParams.get('courseid');
  const router = useRouter();

  const { data, error, isLoading } = useSWR(
    id && courseId ? `video-details-${id}-${courseId}` : null,
    () => fetchVideoDetails(courseId as string, id)
  );

  const video = data?.data;

  if (error) return <div>Failed to load video details</div>;

  return (
    <div className="px-0 py-0 pb-20 max-w-4xl mx-auto">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md p-4 flex items-center space-x-4 border-b">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold truncate">{video?.video_name || 'Loading Video...'}</h1>
      </div>

      <div className="w-full aspect-video bg-black relative">
        {isLoading ? (
          <Skeleton className="w-full h-full rounded-none" />
        ) : video?.video_url ? (
          <video 
            src={video.video_url} 
            controls 
            className="w-full h-full"
            poster={video.video_thumbnail}
            controlsList="nodownload"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white text-center p-8">
            <div>
              <p className="text-lg mb-2">Video player restricted or URL missing</p>
              <p className="text-sm opacity-50">Please ensure you have access to this course.</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center space-x-3 text-blue-600">
              <Info className="w-5 h-5" />
              <h2 className="font-bold">Description</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {video?.video_description || 'No description available for this video lesson.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
