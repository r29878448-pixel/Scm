import { NextResponse } from 'next/server';
import { fetchApi } from '@/lib/aggregator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseid = searchParams.get('courseid');
  const subjectid = searchParams.get('subjectid');
  const topicid = searchParams.get('topicid');

  if (!courseid || !subjectid || !topicid) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const result = await fetchApi("/get/livecourseclassbycoursesubtopconceptapiv3", {
      courseid,
      subjectid,
      topicid,
      conceptid: "",
      windowsapp: "false",
      start: "0"
    });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
