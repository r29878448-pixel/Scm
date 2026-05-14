'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

interface SubjectCardProps {
  courseId: string;
  subject: {
    subjectid: string;
    subject_name: string;
    subject_logo: string;
    subject_image?: string;
  };
}

export function SubjectCard({ courseId, subject }: SubjectCardProps) {
  const logoUrl = subject.subject_logo || subject.subject_image || 'https://i.ibb.co/R4ZZD0m0/file-0000000054c0720cb5566045d5a72dd9.png';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/course/${courseId}/subject/${subject.subjectid}`}>
        <Card className="flex flex-col items-center p-3 border-0 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all rounded-xl bg-white group cursor-pointer h-full justify-center text-center border-b-4 border-transparent hover:border-blue-500">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 flex-shrink-0 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-inner">
            <Image
              src={logoUrl}
              alt={subject.subject_name}
              fill
              className="object-contain p-2"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 px-1">
            <h4 className="font-bold text-gray-900 text-[11px] md:text-xs leading-tight line-clamp-2">
              {subject.subject_name}
            </h4>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
