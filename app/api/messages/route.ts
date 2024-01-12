import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { sql } from '@vercel/postgres';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.app_id || "",
  key: process.env.key || "",
  secret: process.env.secret || "",
  cluster: process.env.cluster || "",
  useTLS: true
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' });
    }

    const { message, contactEmail } = await request.json();
    const userEmail = session?.user?.email;
    let conversationResult;

    if (contactEmail?.includes('@')) {
      conversationResult = await sql`SELECT conversation_id FROM user_conversations WHERE email IN (${userEmail}, ${contactEmail}) 
      GROUP BY conversation_id HAVING COUNT(*) > 1`;
    } else {
      conversationResult = await sql`SELECT conversation_id FROM group_names WHERE group_name = ${contactEmail}`;
    }

    if (conversationResult.rows.length > 0) {
      const conversationId = conversationResult.rows[0].conversation_id;

      if (!contactEmail?.includes('@')) {
        const userCheckResult = await sql`SELECT * FROM user_conversations WHERE email = ${userEmail} AND conversation_id = ${conversationId}`;
        if (userCheckResult.rows.length === 0) {
          return NextResponse.json({ message: 'Unauthorized' });
        }
      }

      const response = await sql`INSERT INTO messages (email, conversation_id, message_text) VALUES (${userEmail}, ${conversationId}, ${message})`;

      pusher.trigger('my-channel', 'my-event', { message: 'Message added' });
    }

    return NextResponse.json({ message: 'Success' });
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

    const url = new URL(request.url);
    const contactEmail = url.searchParams.get('contactEmail');
    const userEmail = session?.user?.email;
    let conversationResult;

    if (contactEmail?.includes('@')) {
      conversationResult = await sql`SELECT conversation_id FROM user_conversations WHERE email IN (${userEmail}, ${contactEmail}) 
      GROUP BY conversation_id HAVING COUNT(*) > 1`;
    } else {
      conversationResult = await sql`SELECT conversation_id FROM group_names WHERE group_name = ${contactEmail}`;
    }

    if (conversationResult.rows.length > 0) {
      const conversationId = conversationResult.rows[0].conversation_id;

      if (!contactEmail?.includes('@')) {
        const userCheckResult = await sql`SELECT * FROM user_conversations WHERE email = ${userEmail} AND conversation_id = ${conversationId}`;
        if (userCheckResult.rows.length === 0) {
          return NextResponse.json({ message: 'Unauthorized' });
        }
      }

      const conversationDetailsResult = await sql`SELECT created_on FROM conversations WHERE conversation_id = ${conversationId}`;

      const conversationCreatedOn = conversationDetailsResult.rows[0].created_on;

      const response = await sql`SELECT * FROM messages WHERE conversation_id = ${conversationId} ORDER BY created_on ASC`;

      return NextResponse.json({ conversationCreatedOn, messages: response.rows });
    }
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

    const { message_id } = await request.json();
    const email = session?.user?.email;

    const response = await sql`DELETE FROM messages WHERE message_id = ${message_id} AND email = ${email}`;

    pusher.trigger('my-channel', 'my-event', { message: 'Message deleted' });
  } catch (e) {
    return NextResponse.json({ error: 'An error occurred' })
  }

  return NextResponse.json({ message: 'Success' });
}
