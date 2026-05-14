import { NextResponse } from 'next/server';
import { fetchApi } from '@/lib/aggregator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const course_id = searchParams.get('course_id');

  if (!course_id) {
    return NextResponse.json({ error: 'course_id is required' }, { status: 400 });
  }

  try {
    const result = await fetchApi("/get/get_previous_live_videos", { 
      course_id, 
      start: "1",
      folder_wise_course: "0"
    });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
