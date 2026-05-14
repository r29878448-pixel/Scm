'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

export function TestSeriesCard({ item }: any) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} className="h-full">
      <Card className="flex flex-col h-full overflow-hidden border border-gray-100/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl bg-white group transition-all hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] cursor-default">
        <div className="relative aspect-[16/10] w-full overflow-hidden shrink-0">
          <Image
            src={item.logo || 'https://i.ibb.co/R4ZZD0m0/file-0000000054c0720cb5566045d5a72dd9.png'}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2.5 left-2.5">
            <Badge className="bg-emerald-600 text-white border-0 font-black px-2 py-0.5 text-[7px] shadow-lg uppercase tracking-tight">
              TEST SERIES
            </Badge>
          </div>
        </div>
        <CardContent className="flex flex-col flex-grow p-3.5">
          <h3 className="font-bold text-gray-900 text-[13px] line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors h-[32px]">
            {item.title}
          </h3>
          
          <div className="mt-3 flex items-center justify-between">
            <div className="bg-emerald-50/50 px-2 py-1 rounded-lg border border-emerald-100/50">
              <span className="text-[11px] text-emerald-700 font-black tracking-tight">₹{item.price}</span>
            </div>
            {item.expiryDate && (
              <div className="flex items-center space-x-1.5 text-gray-300 font-bold text-[8px] uppercase tracking-tighter">
                <Calendar className="w-3 h-3 text-gray-200" />
                <span>{item.expiryDate}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <Link href="#" className="block w-full">
              <Button 
                size="sm"
                className="w-full h-9 bg-gray-900 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black transition-all border-0 uppercase tracking-widest shadow-lg shadow-gray-200 hover:shadow-emerald-200"
              >
                Start Test
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
