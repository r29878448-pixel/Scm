'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useParams, useRouter } from 'next/navigation';
import { fetchSubjects } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BookOpen, FileText } from 'lucide-react';
import { SubjectCard } from '@/components/course/SubjectCard';
import { VideoPlayerModal } from '@/components/course/VideoPlayerModal';
import { Play, Calendar, Video, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchLiveLectures, fetchPreviousLiveVideos, fetchTestSeries } from '@/lib/api';
import Image from 'next/image';

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'test' | 'live'>('content');

  const { data, error, isLoading } = useSWR(id ? `subjects-${id}` : null, () => fetchSubjects(id));
  const { data: liveData, isLoading: isLoadingLive } = useSWR(id ? `live-${id}` : null, () => fetchLiveLectures(id, '')); 
  const { data: prevLiveData } = useSWR(id ? `prev-live-${id}` : null, () => fetchPreviousLiveVideos(id));
  const { data: testsData, isLoading: isLoadingTests } = useSWR(id ? `tests-${id}` : null, () => fetchTestSeries(id));

  const subjects = data?.data || [];
  const liveLectures = liveData?.data || [];
  const prevLiveVideos = prevLiveData?.data || [];
  const tests = testsData?.data || [];

  if (error) return <div>Failed to load course details</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <VideoPlayerModal 
        isOpen={!!selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
        videoId={selectedVideo?.id || selectedVideo}
        video={selectedVideo && typeof selectedVideo === 'object' ? selectedVideo : null}
        courseId={id}
      />

      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4 md:px-8 max-w-7xl mx-auto flex items-center space-x-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 line-clamp-1">Course Details</h1>
        </div>
        
        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar border-t border-gray-100 px-4 md:px-8 max-w-7xl mx-auto">
           <div className="flex space-x-6 min-w-max">
             {[
               { id: 'content', label: 'Content', icon: BookOpen },
               { id: 'test', label: 'Test', icon: FileText },
               { id: 'live', label: 'Live & Upcoming', icon: Video }
             ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'content' | 'test' | 'live')}
                  className={`flex items-center pb-4 pt-4 border-b-2 font-semibold text-[15px] transition-colors whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'border-[#1a73e8] text-[#1a73e8]' 
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? 'text-[#1a73e8]' : 'text-gray-400'}`} />
                  {tab.label}
                  {tab.id === 'live' && liveLectures.length > 0 && (
                    <span className="ml-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </button>
             ))}
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 space-y-10">
        <AnimatePresence mode="wait">
          {activeTab === 'live' && (
            <motion.div 
              key="live"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-10"
            >
              {/* Live & Upcoming Section */}
              {(liveLectures.length > 0 || isLoadingLive) && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                      <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center">
                        LIVE & UPCOMING
                      </h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isLoadingLive ? (
                      [1, 2].map(i => <Skeleton key={i} className="h-24 rounded-3xl" />)
                    ) : (
                      liveLectures.map((lecture: any) => (
                        <motion.div 
                          key={lecture.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedVideo(lecture)}
                          className="bg-white p-4 rounded-3xl border border-red-100 flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-all relative overflow-hidden"
                        >
                           <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-xl tracking-wider">
                             LIVE NOW
                           </div>
                          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-red-100">
                            <Video className="w-6 h-6 text-red-500" />
                          </div>
                          <div className="flex-1 min-w-0 pr-2">
                            <h4 className="font-bold text-gray-900 text-[15px] leading-snug line-clamp-2">{lecture.Title}</h4>
                            <p className="text-[11px] text-red-500 font-bold mt-1.5 flex items-center w-max bg-red-50 px-2 py-0.5 rounded-lg border border-red-100/50">
                              <Clock className="w-3 h-3 mr-1" /> {lecture.date_and_time || 'Starting Soon'}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </section>
              )}

              {/* Previous Live Videos */}
              <section className="space-y-4">
                <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center mb-1">
                  PREVIOUS SESSIONS
                </h2>
                {prevLiveVideos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prevLiveVideos.map((video: any) => (
                      <motion.div 
                        key={video.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedVideo(video)}
                        className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all group"
                      >
                        <div className="relative w-24 h-16 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-200/60 group-hover:border-[#1a73e8]/30 transition-colors overflow-hidden">
                           <Image 
                             src={video.thumbnail || video.video_thumbnail || 'https://i.ibb.co/R4ZZD0m0/file-0000000054c0720cb5566045d5a72dd9.png'} 
                             alt={video.Title || 'Video Thumbnail'} 
                             fill 
                             className="object-cover" 
                             referrerPolicy="no-referrer"
                           />
                           <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                             <div className="w-6 h-6 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                               <Play className="w-3 h-3 text-white fill-current" />
                             </div>
                           </div>
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight group-hover:text-[#1a73e8] transition-colors">{video.Title}</h4>
                          <p className="text-[11px] text-gray-500 font-medium mt-1 truncate">{video.subject || 'Recorded Session'}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-white rounded-3xl border border-gray-100">
                    <Video className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No previous sessions available.</p>
                  </div>
                )}
              </section>
            </motion.div>
          )}

          {activeTab === 'test' && (
            <motion.div 
              key="test"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {isLoadingTests ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
                </div>
              ) : tests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tests.map((test: any) => (
                    <motion.div
                      key={test.id}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-[#1a73e8] transition-all flex space-x-4 cursor-pointer group"
                    >
                       <div className="w-[80px] h-[80px] rounded-xl flex-shrink-0 overflow-hidden bg-gray-50 border border-gray-100 relative">
                         {test.logo ? (
                            <Image 
                              src={test.logo} 
                              alt={test.title || 'Test Logo'} 
                              fill 
                              className="object-contain" 
                              referrerPolicy="no-referrer"
                            />
                         ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[#1a73e8] bg-blue-50">
                               <FileText className="w-7 h-7 mb-1" />
                            </div>
                         )}
                       </div>
                       <div className="flex-1 min-w-0 py-1 flex flex-col">
                         <h3 className="font-bold text-gray-900 text-[15px] sm:text-base leading-snug line-clamp-2 group-hover:text-[#1a73e8] transition-colors">{test.title}</h3>
                         <div className="flex items-center text-xs text-gray-500 mt-1 font-medium">
                            <span className="bg-gray-100 px-2 py-0.5 rounded-md mr-2">{test.examname || 'General Tests'}</span>
                            <span>{test.totaltesttitle || '0'} Tests</span>
                         </div>
                         <div className="mt-auto pt-2 flex items-center justify-between">
                            <span className="text-xs font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded w-max">Active</span>
                            <span className="text-[13px] font-bold text-[#1a73e8] group-hover:underline">View All</span>
                         </div>
                       </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                     <FileText className="w-8 h-8 text-[#1a73e8]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No Tests Found</h3>
                  <p className="text-sm text-gray-500 font-medium">There are no test series available for this course yet.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-[140px] rounded-[24px]" />)}
                </div>
              ) : subjects.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {subjects.map((subject: any) => {
                    const subjectData = {
                      subjectid: subject.id || subject.subjectid,
                      subject_name: subject.subject_name,
                      subject_logo: subject.subject_logo || subject.subject_image || subject.image
                    };
                    return (
                      <SubjectCard key={subjectData.subjectid} courseId={id} subject={subjectData} />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                     <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No Content Found</h3>
                  <p className="text-sm text-gray-500 font-medium">There are no subjects listed for this course yet.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
