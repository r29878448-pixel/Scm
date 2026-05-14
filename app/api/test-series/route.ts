import { NextResponse } from 'next/server';
import { fetchApi } from '@/lib/aggregator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseid = searchParams.get('courseid');

    if (!courseid) {
      return NextResponse.json({ error: 'courseid is required' }, { status: 400 });
    }

    const data = await fetchApi('/get/test_seriesbycourseid', {
      courseid,
      folder_wise_course: 0,
      start: -1
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Test Series API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
