import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' });
    }

    const { groupName, contactEmails } = await request.json();
    const userEmail = session?.user?.email;

    if (!groupName) {
      return NextResponse.json({ message: 'Group name cannot be empty' });
    }

    if (!contactEmails || contactEmails.length <= 1) {
      return NextResponse.json({ message: 'Select atleast 2 contacts' });
    }

    const groupResponse = await sql`SELECT * FROM group_names WHERE group_name = ${groupName}`;

    if (groupResponse.rows.length > 0) {
      return NextResponse.json({ message: 'Group already exists' });
    }

    await sql`INSERT INTO conversations DEFAULT VALUES`;

    const conversationResponse = await sql`SELECT * FROM conversations ORDER BY created_on DESC LIMIT 1`;
    const conversation_id = conversationResponse.rows[0].conversation_id;

    await sql`INSERT INTO group_names (group_name, conversation_id) VALUES (${groupName}, ${conversation_id})`;
    await sql`INSERT INTO user_conversations (email, conversation_id) VALUES (${userEmail}, ${conversation_id})`;
    
    for (let contactEmail of contactEmails) {
      await sql`INSERT INTO user_conversations (email, conversation_id) VALUES (${contactEmail}, ${conversation_id})`;
    }

    return NextResponse.json({ message: 'Success' });
  } catch (e) {
    return NextResponse.json({ error: 'An error occurred' })
  }
}