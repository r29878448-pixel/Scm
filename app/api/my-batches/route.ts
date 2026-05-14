import { NextResponse } from 'next/server';
import { ACCOUNTS, redis, performLogin, fetchApi } from '@/lib/aggregator';

export async function GET() {
  const combinedData: any[] = [];
  const seenIds = new Set();

  try {
    for (const acc of ACCOUNTS) {
      let token = await redis.get<string>(`token:${acc.phone}`);
      let userid = await redis.get<string>(`userid:${acc.phone}`);

      if (!token || !userid) {
        const auth = await performLogin(acc.phone, acc.pass);
        if (auth) {
          token = auth.token;
          userid = auth.userid;
        }
      }

      if (token && userid) {
        const result = await fetchApi("/get/mycourseweb", { userid }, { token, userid });

        if (result && result.status === 200) {
          const batchList = result.data || [];
          for (const batch of batchList) {
            const bId = batch.id || batch.course_id;
            if (!seenIds.has(bId)) {
              combinedData.push(batch);
              seenIds.add(bId);
              // Store which phone owns this course so subsequent calls know whose token to use
              await redis.set(`courseOwner:${bId}`, acc.phone);
            }
          }
        }
      }
    }

    return NextResponse.json({
      status: 200,
      message: "All Batches Merged",
      data: combinedData
    });
  } catch (error: any) {
    return NextResponse.json({ status: 500, error: error.message }, { status: 500 });
  }
}
