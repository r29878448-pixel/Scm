import { NextResponse } from 'next/server';
import { fetchApi } from '@/lib/aggregator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseid = searchParams.get('courseid');
  const subjectid = searchParams.get('subjectid');

  if (!courseid || !subjectid) {
    return NextResponse.json({ error: 'courseid and subjectid are required' }, { status: 400 });
  }

  try {
    const result = await fetchApi("/get/livecourseclassbycoursesubtopconceptapiv3", { 
      courseid, 
      subjectid, 
      topicid: "1",
      conceptid: "",
      start: "1" 
    });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
