'use client';

import { use, useState } from 'react';
import useSWR from 'swr';
import { fetchVideos } from '@/lib/api';
import { ContentCard } from '@/components/course/ContentCard';
import { VideoPlayerModal } from '@/components/course/VideoPlayerModal';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Play, FileText, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export default function ContentListPage({ params }: { params: Promise<{ id: string, subjectId: string, topicId: string }> }) {
  const { id, subjectId, topicId } = use(params);
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const { data, error, isLoading } = useSWR(`content-${id}-${subjectId}-${topicId}`, () => fetchVideos(id, subjectId, topicId));

  const contentItems = data?.data || [];
  const videos = contentItems.filter((item: any) => item.material_type === 'VIDEO');
  const pdfs = contentItems.filter((item: any) => item.material_type !== 'VIDEO' || item.pdf_link);

  const handleContentClick = (item: any) => {
    if (item.material_type === 'VIDEO') {
      setSelectedVideo(item.id);
    } else if (item.pdf_link) {
      window.open(item.pdf_link, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 truncate max-w-[150px] md:max-w-md">Course Content</h1>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Share2 className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8">
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="bg-white p-1 rounded-2xl border border-gray-100 w-full mb-6">
            <TabsTrigger value="videos" className="flex-1 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Play className="w-4 h-4 mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="pdfs" className="flex-1 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              PDF Notes
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="videos" key="videos-tab" className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                  ))}
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-20 text-gray-400">No videos found.</div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {videos.map((item: any, index: number) => (
                    <ContentCard key={item.id || index} item={item} onClick={handleContentClick} />
                  ))}
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="pdfs" key="pdfs-tab" className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                  ))}
                </div>
              ) : pdfs.length === 0 ? (
                <div key="no-pdfs" className="text-center py-20 text-gray-400">No PDF notes found.</div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {pdfs.map((item: any, index: number) => (
                    <ContentCard key={item.id || index} item={item} onClick={handleContentClick} />
                  ))}
                </motion.div>
              )}
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>

      <VideoPlayerModal 
        isOpen={!!selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
        videoId={selectedVideo}
        courseId={id}
      />
    </div>
  );
}
