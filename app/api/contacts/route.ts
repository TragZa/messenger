import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' });
    }

    const { contact } = await request.json();
    const email = session?.user?.email;

    const userExists = await sql`SELECT email FROM users WHERE email=${contact}`;

    if (userExists.rows.length === 0) {
      return NextResponse.json({ message: 'User does not exist' });
    }

    const existingContact = await sql`SELECT email FROM contacts WHERE email=${email} AND contact=${contact}`;
  
    if (existingContact.rows.length > 0) {
      return NextResponse.json({ message: 'Contact already exists' });
    }

    await sql`INSERT INTO contacts (email, contact) VALUES (${email}, ${contact})`;

    return NextResponse.json({ message: 'success' });
  } catch (e) {
    return NextResponse.json({ error: 'An error occurred' })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' });
    }

    const email = session?.user?.email;
    
    const contacts = await sql`SELECT * FROM contacts WHERE email=${email}`;

    return NextResponse.json({ contacts: contacts.rows });
  } catch (e) {
    return NextResponse.json({ error: 'An error occurred' })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' });
    }

    const { contact_id } = await request.json();
    const email = session?.user?.email;
    
    await sql`DELETE FROM contacts WHERE contact_id=${contact_id} AND email=${email}`;

    return NextResponse.json({ message: 'success' });
  } catch (e) {
    return NextResponse.json({ error: 'An error occurred' })
  }
}
