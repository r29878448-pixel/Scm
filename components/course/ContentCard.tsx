'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Video, MoreHorizontal, Clock, Download, FileText, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

interface ContentCardProps {
  item: {
    id: string;
    Title: string;
    material_type: string;
    thumbnail: string;
    video_thumbnail?: string;
    image?: string;
    file_link?: string;
    duration?: string;
    pdf_link?: string;
    date_and_time?: string;
    created_at?: string;
    is_purchased?: string | number;
  };
  onClick: (item: any) => void;
}

export function ContentCard({ item, onClick }: ContentCardProps) {
  const isVideo = item.material_type === 'VIDEO' || !item.material_type; // Fallback if no type but listed in videos
  const isLocked = false; 
  
  const thumbUrl = item.thumbnail || item.video_thumbnail || item.image || item.file_link || 'https://i.ibb.co/R4ZZD0m0/file-0000000054c0720cb5566045d5a72dd9.png';

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLocked) onClick(item);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer"
      onClick={() => !isLocked && onClick(item)}
    >
      <Card className="border border-gray-100 shadow-sm rounded-xl bg-white overflow-hidden hover:border-blue-200 hover:shadow-md transition-all p-3 flex space-x-3 items-center">
        {/* Left: Thumbnail */}
        <div className="relative w-[110px] h-[70px] sm:w-[130px] sm:h-[80px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 shadow-sm">
          <Image
            src={thumbUrl}
            alt={item.Title || 'Content'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
          {isLocked && (
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center">
              <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-md border border-white/30">
                <Lock className="w-3 h-3 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Right: Content */}
        <div className="flex-1 flex flex-col min-w-0 justify-between h-full py-0.5">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                {isVideo ? (
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tight">Video Lecture</span>
                ) : (
                  <span className="text-[9px] font-bold text-purple-600 uppercase tracking-tight">Note / PDF</span>
                )}
                {item.duration && (
                  <span className="text-[9px] text-gray-400 font-medium">• {item.duration}</span>
                )}
              </div>
              <h4 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                {item.Title}
              </h4>
              <p className="text-[10px] text-gray-500 mt-1 line-clamp-1 flex items-center">
                <Clock className="w-2.5 h-2.5 mr-1" />
                {item.date_and_time || item.created_at || 'Available'}
              </p>
            </div>
            
            <div className="shrink-0 flex items-center h-full">
              {isVideo ? (
                <Button 
                  onClick={handleActionClick} 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-md h-7 px-4 text-[11px] font-bold shadow-sm"
                >
                  Play
                </Button>
              ) : (item.pdf_link && !isLocked) ? (
                <Button 
                  onClick={handleActionClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-md h-7 px-4 text-[11px] font-bold shadow-sm"
                >
                  Open
                </Button>
              ) : (
                <button className="h-7 w-7 rounded-md text-gray-400 hover:bg-gray-50 flex items-center justify-center transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
