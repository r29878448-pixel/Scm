import { NextResponse } from 'next/server';
import { fetchApi } from '@/lib/aggregator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseid = searchParams.get('courseid');
  const videoid = searchParams.get('videoid');

  if (!courseid || !videoid) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const result = await fetchApi("/get/fetchVideoDetailsById", {
      course_id: courseid,
      video_id: videoid,
      ytflag: "0",
      folder_wise_course: "0"
    });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
