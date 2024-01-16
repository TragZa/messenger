import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email cannot be empty' });
    }

    const user = await sql`SELECT * FROM users WHERE email=${email}`;

    if (user.rows.length > 0) {
      return NextResponse.json({ message: 'Email already exists' });
    }

    const hashedPassword = await hash(password, 10);

    const response = await sql`
    INSERT INTO users (email, password) VALUES (${email}, ${hashedPassword})`;

    return NextResponse.json({ message: 'Success' });
  } catch (e) {
    return NextResponse.json({ error: 'An error occurred' })
  }
}
