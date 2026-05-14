import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userid = searchParams.get('userid') || '533219';

  const res = await fetch(`https://sachinacademyapi.classx.co.in/get/purchasedtest_series?userid=${userid}`, {
    method: 'GET',
    headers: {
      'Client-Service': 'Appx',
      'Auth-Key': 'appxapi',
      'source': 'website',
      'User-ID': userid,
      'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjUzMzIxOSIsInRpbWVzdGFtcCI6MTc3ODYzMzYwNywiaXZfdmVyIjoyMiwic2Vzc2lvbiI6ImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSklVekkxTmlKOS5leUpwWkNJNklqVXpNekl4T1NJc0ltVnRZV2xzSWpvaWNtRm9kV3hyZFhOb2QyRm9OelF5TjBCbmJXRnBiQzVqYjIwaUxDSnVZVzFsSWpvaVVtRm9kV3dpTENKMFpXNWhiblJVZVhCbElqb2lkWE5sY2lJc0luUmxibUZ1ZEU1aGJXVWlPaUp6WVdOb2FXNWhZMkZrWlcxNVgyUmlJaXdpZEdWdVlXNTBTV1FpT2lJaUxDSmthWE53YjNOaFlteGxJanBtWVd4elpYMC4wTVYwOExHSE5ueWN5Y3JQM0Q3Vl9yQ2RQRDZRWC1RQTNfaTBadFI4TkZ3In0.ZYuNne5zS7amBd4eBlbyNXfdNSLESqZHS1YoSwgjJOQ', // Token from user or hardcoded here for testing
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch test series' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
