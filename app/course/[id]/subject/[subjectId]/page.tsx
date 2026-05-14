'use client';

import { use, useState } from 'react';
import useSWR from 'swr';
import { fetchTopics, fetchLiveLectures, fetchPreviousLiveVideos } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Layers, ChevronRight, PlayCircle, Radio, Clock, Video } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { VideoPlayerModal } from '@/components/course/VideoPlayerModal';

export default function TopicsPage({ params }: { params: Promise<{ id: string, subjectId: string }> }) {
  const { id, subjectId } = use(params);
  const router = useRouter();
  
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'live' | 'prev'>('content');

  const { data, error, isLoading } = useSWR(`topics-${id}-${subjectId}`, () => fetchTopics(id, subjectId));
  const { data: liveData, isLoading: isLiveLoading } = useSWR(`live-${id}-${subjectId}`, () => fetchLiveLectures(id, subjectId));
  const { data: prevLiveData, isLoading: isPrevLoading } = useSWR(`prev-live-${id}`, () => fetchPreviousLiveVideos(id));

  const topics = data?.data || [];
  const liveLectures = liveData?.data || [];
  const prevLiveVideos = prevLiveData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <VideoPlayerModal 
        isOpen={!!selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
        videoId={selectedVideo?.id || (typeof selectedVideo === 'string' ? selectedVideo : null)}
        video={selectedVideo && typeof selectedVideo === 'object' ? selectedVideo : null}
        courseId={id}
      />
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 px-4 py-4 md:px-8">
        <div className="flex items-center space-x-4 max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 truncate max-w-[200px]">Course Content</h1>
            <div className="flex items-center text-[10px] text-gray-400 font-medium uppercase">
              <Layers className="w-3 h-3 mr-1" />
              <span>{activeTab === 'content' ? `${topics.length} Units` : activeTab === 'live' ? `${liveLectures.length} Classes` : `${prevLiveVideos.length} Videos`}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8">
        {/* Navigation Tabs - Small Buttons */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          {[
            { id: 'content', label: 'Content', icon: Layers },
            { id: 'live', label: 'Live & Upcoming', icon: Radio },
            { id: 'prev', label: 'Prev. Live Videos', icon: PlayCircle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border-2 ${
                activeTab === tab.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                  : 'bg-white border-gray-50 text-gray-400 hover:border-gray-200 hover:text-gray-600'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'content' && (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-10 text-gray-500">Failed to load topics.</div>
              ) : (
                <div className="space-y-3">
                  {topics.map((topic: any, idx: number) => {
                    const logoUrl = topic.topic_logo || topic.topic_image || topic.thumbnail || 'https://i.ibb.co/R4ZZD0m0/file-0000000054c0720cb5566045d5a72dd9.png';
                    return (
                      <motion.div
                        key={topic.topicid || topic.id || idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Link href={`/course/${id}/subject/${subjectId}/topic/${topic.topicid}`}>
                          <Card className="border-0 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white group cursor-pointer overflow-hidden">
                            <CardContent className="p-4 flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-orange-50 flex-shrink-0 flex items-center justify-center text-orange-600 font-bold text-sm border border-orange-100">
                                  <Image 
                                    src={logoUrl} 
                                    alt={topic.topic_name}
                                    fill
                                    className="object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <h4 className="font-semibold text-gray-800 text-sm md:text-base leading-tight">
                                  {topic.topic_name}
                                </h4>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    )
                  })}
                  {topics.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                      <Layers className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-400 font-bold">No topics found for this subject</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'live' && (
            <motion.div 
              key="live"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                {isLiveLoading ? (
                  [1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
                ) : liveLectures.length > 0 ? (
                  liveLectures.map((lecture: any, idx: number) => (
                    <motion.div key={lecture.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                      <Card 
                        className="border-0 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white cursor-pointer group"
                        onClick={() => setSelectedVideo(lecture)}
                      >
                        <CardContent className="p-4 flex items-center space-x-4">
                          <div className="relative w-20 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                            <Image src={lecture.thumbnail || lecture.image || 'https://i.ibb.co/R4ZZD0m0/file-0000000054c0720cb5566045d5a72dd9.png'} alt={lecture.Title} fill className="object-cover" />
                            <div className="absolute inset-0 bg-red-600/10 flex items-center justify-center">
                              <Radio className="w-6 h-6 text-red-600" />
                            </div>
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{lecture.Title}</h4>
                            <p className="text-[10px] text-red-600 font-black mt-1 flex items-center uppercase">
                              <Clock className="w-3 h-3 mr-1" />
                              {lecture.date_and_time}
                            </p>
                          </div>
                          <PlayCircle className="w-6 h-6 text-gray-300 group-hover:text-red-600 transition-colors" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-20 text-center">
                      <Video className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-400 font-bold">No live classes scheduled</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'prev' && (
            <motion.div 
              key="prev"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                {isPrevLoading ? (
                  [1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
                ) : prevLiveVideos.length > 0 ? (
                  prevLiveVideos.map((lecture: any, idx: number) => (
                    <motion.div key={lecture.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                      <Card 
                        className="border-0 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white cursor-pointer group"
                        onClick={() => setSelectedVideo(lecture)}
                      >
                        <CardContent className="p-4 flex items-center space-x-4">
                          <div className="relative w-20 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                            <Image src={lecture.thumbnail || lecture.image || 'https://i.ibb.co/R4ZZD0m0/file-0000000054c0720cb5566045d5a72dd9.png'} alt={lecture.Title} fill className="object-cover" />
                             <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{lecture.Title}</h4>
                            <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-tighter">HD RECORDING AVAILABLE</p>
                          </div>
                          <PlayCircle className="w-6 h-6 text-gray-300 group-hover:text-blue-600 transition-colors" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-20 text-center">
                      <PlayCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-400 font-bold">No previous recordings found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
