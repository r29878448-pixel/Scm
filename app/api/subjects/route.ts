import { NextResponse } from 'next/server';
import { fetchApi } from '@/lib/aggregator';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseid = searchParams.get('courseid');

  if (!courseid) {
    return NextResponse.json({ error: 'courseid is required' }, { status: 400 });
  }

  try {
    const result = await fetchApi("/get/allsubjectfrmlivecourseclass", { courseid });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
