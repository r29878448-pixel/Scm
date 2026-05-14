import { NextResponse } from 'next/server';
import { performLogin } from '@/lib/aggregator';

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json({ error: 'phone and password are required' }, { status: 400 });
    }

    const auth = await performLogin(phone, password);
    if (auth) {
      return NextResponse.json({
        status: "Success",
        message: "Logged in and Token Saved",
        data: auth
      });
    }

    return NextResponse.json({ error: 'Login Failed' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
