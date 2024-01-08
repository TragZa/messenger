import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' })
    }
    
    const { contactEmail } = await request.json();
    const userEmail = session?.user?.email;
    
    const existingConversation = await sql`SELECT * FROM user_conversations WHERE email = ${userEmail} AND conversation_id IN (
      SELECT conversation_id FROM user_conversations 
      WHERE email = ${contactEmail}
      )`;
        
        if (existingConversation.rows.length > 0) {
        return NextResponse.json({ message: 'Chat already exists' });
      }
      
      await sql`INSERT INTO conversations DEFAULT VALUES`;
      
      const conversationResponse = await sql`SELECT * FROM conversations ORDER BY created_on DESC LIMIT 1`;
      const conversation_id = conversationResponse.rows[0].conversation_id;
      
      await sql`INSERT INTO user_conversations (email, conversation_id) VALUES (${userEmail}, ${conversation_id})`;
      await sql`INSERT INTO user_conversations (email, conversation_id) VALUES (${contactEmail}, ${conversation_id})`;
      
      return NextResponse.json({ message: 'Success' });
    } catch (e) {
      return NextResponse.json({ error: 'An error occurred' })
    }
  }
