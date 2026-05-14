'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { X, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string | null;
  video?: any;
  courseId?: string;
}

export function VideoPlayerModal({ isOpen, onClose, videoId, video: initialVideo, courseId }: VideoPlayerModalProps) {
  const [fetchedVideo, setFetchedVideo] = useState<any>(null);
  const [playerUrl, setPlayerUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Use either the provided video object or the one we fetch
  const video = initialVideo || fetchedVideo;

  useEffect(() => {
    async function getDetails() {
      if (!isOpen || !videoId) return;
      
      setIsLoading(true);
      setError(false);

      try {
        let currentVideo = initialVideo;
        
        // Always try to fetch details if we don't have enough info
        if (courseId) {
          const detailRes = await fetch(`/api/video-details?courseid=${courseId}&videoid=${videoId}`);
          const detailData = await detailRes.json();
          if (detailData.status === 200 && detailData.data) {
            currentVideo = detailData.data;
            setFetchedVideo(currentVideo);
          }
        }

        if (currentVideo?.video_player_url) {
          const token = currentVideo.video_player_token || '1234';
          let url = currentVideo.video_player_url;
          
          if (!url.includes('isMobile=true')) {
            const extra = url.includes('?') ? '&isMobile=true' : '?isMobile=true';
            url = `${url}${extra}`;
          }

          if (url.includes('token=')) {
            url = `${url}${token}`;
          } else {
            url = `${url}&token=${token}`;
          }
          
          setPlayerUrl(url);
          setIsLoading(false);
        } else {
          setError(true);
          setIsLoading(false);
        }
      } catch (err) {
        setError(true);
        setIsLoading(false);
      }
    }

    getDetails();
  }, [isOpen, videoId, courseId, initialVideo]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-0 shadow-2xl bg-white sm:rounded-lg focus:outline-none ring-0 w-[100vw] h-auto md:w-[80vw]">
        <DialogTitle className="sr-only">
          {video?.Title || 'Video Player'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Playing video lesson {video?.Title || videoId}
        </DialogDescription>

        <div className="flex flex-col w-full bg-white rounded-lg">
          {isLoading ? (
            <div className="w-full h-full min-h-[300px] flex flex-col bg-white rounded-lg">
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100 relative">
                <h2 className="text-[22px] font-bold text-[#1e2329]">Please wait</h2>
                <button 
                  onClick={onClose}
                  className="rounded-full bg-[#9ca3af] hover:bg-gray-500 text-white h-[26px] w-[26px] flex items-center justify-center transition-colors absolute right-4"
                >
                  <X className="w-[18px] h-[18px] stroke-[3]" />
                </button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center mt-6 pb-12">
                <div className="relative w-10 h-10 animate-spin mb-10">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2.5 h-2.5 bg-[#1e2329] rounded-full"
                      style={{
                        opacity: 1 - i * 0.1,
                        top: `${50 - 45 * Math.cos(i * Math.PI / 4)}%`,
                        left: `${50 + 45 * Math.sin(i * Math.PI / 4)}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  ))}
                </div>
                <p className="text-[#374151] text-[17px] sm:text-[18px]">We are fetching the video details...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header Area */}
              {playerUrl && (
                <div className="h-12 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0 relative z-10 w-full rounded-t-lg">
                  <div className="hidden sm:block text-sm font-semibold text-gray-800 line-clamp-1 truncate max-w-[80%]">
                    {video?.Title || 'Video Class'}
                  </div>
                  <button 
                    onClick={onClose}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-[#9da3af] hover:bg-gray-500 text-white h-[26px] w-[26px] flex items-center justify-center transition-colors shadow-sm"
                  >
                    <X className="w-[18px] h-[18px] stroke-[3]" />
                  </button>
                </div>
              )}

              {/* Video Player Section */}
              <div className="relative aspect-video w-full bg-black flex flex-col justify-center overflow-hidden sm:rounded-b-lg">
                {error ? (
                  <div className="text-center p-10 flex flex-col items-center justify-center h-full bg-gray-900 w-full relative z-20">
                    <div className="bg-red-500/10 p-4 rounded-full mb-4">
                      <X className="w-6 h-6 text-red-500" />
                    </div>
                    <p className="text-white font-semibold text-sm mb-1">Stream Unavailable</p>
                    <p className="text-xs opacity-60 max-w-xs mx-auto text-white">This video could not be loaded. Please try again later.</p>
                    <Button onClick={onClose} className="mt-6 bg-white text-black hover:bg-gray-200 font-bold px-6 h-9 rounded-lg text-xs">
                      GO BACK
                    </Button>
                  </div>
                ) : playerUrl ? (
                  <iframe
                    src={playerUrl}
                    className="w-full h-full border-0 absolute inset-0 z-0 bg-black"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-white text-center p-10 flex flex-col items-center justify-center h-full bg-black w-full relative z-20">
                    <Play className="w-10 h-10 text-gray-700 mb-2" />
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Unavailable</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
