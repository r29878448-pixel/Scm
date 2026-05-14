'use client';

import React from 'react';
import useSWR from 'swr';
import { fetchMyBatches, fetchPurchasedTestSeries } from '@/lib/api';
import { CourseCard } from '@/components/course/CourseCard';
import { TestSeriesCard } from '@/components/course/TestSeriesCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'motion/react';

const fetcherBatches = () => fetchMyBatches();
const fetcherTests = () => fetchPurchasedTestSeries();

export default function MyBatchesPage() {
  const { data: coursesData, error: coursesError, isLoading: coursesLoading } = useSWR('my-batches', fetcherBatches);
  const { data: testsData, error: testsError, isLoading: testsLoading } = useSWR('purchased-tests', fetcherTests);
  
  const batches = coursesData?.data || [];
  const testSeries = testsData?.data || [];

  return (
    <div className="px-4 py-8 md:px-8 space-y-12 pb-20">
      <header className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Enrollments</h1>
          <p className="text-gray-500 text-sm">Access your purchased courses and test series here.</p>
        </div>
        <div className="flex items-center space-x-2">
           <Input placeholder="Search..." className="w-full md:w-64 rounded-xl" />
        </div>
      </header>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">My Courses</h2>
        {coursesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="aspect-video rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {batches.map((batch: any) => (
              <CourseCard key={batch.id} course={batch} />
            ))}
            {batches.length === 0 && <p className="text-gray-500 col-span-3">No courses purchased yet.</p>}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">My Test Series</h2>
        {testsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="aspect-video rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testSeries.map((test: any) => (
              <TestSeriesCard key={test.id} item={test} />
            ))}
            {testSeries.length === 0 && <p className="text-gray-500 col-span-3">No test series purchased yet.</p>}
          </div>
        )}
      </section>
    </div>
  );
}
