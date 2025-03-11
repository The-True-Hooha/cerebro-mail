import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const url = process.env.WAITLIST_URL;
  if (!url) return;
  try {
    const data = await req.json();
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const data_ = await res.json();
    return NextResponse.json(
      { success: true, data_ },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json({ error: `Failed to perform search | ${err}` }, { status: 500 });
  }
}
