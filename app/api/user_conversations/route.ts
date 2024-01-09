import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' });
    }

    const email = session?.user?.email;
    
    const response = await sql`
    SELECT conversation_id FROM user_conversations WHERE email = ${email}`;

    const conversation_ids = response.rows.map((row) => row.conversation_id);

    const emails = [];
    for (const id of conversation_ids) {
      const res = await sql`SELECT email, conversation_id FROM user_conversations WHERE conversation_id = ${id} AND email != ${email}`;
      
      if (res.rows.length > 1) {
        const groupRes = await sql`SELECT group_name FROM group_names WHERE conversation_id = ${id}`;
        emails.push({ email: groupRes.rows[0].group_name });
      } else {
        emails.push(...res.rows.map((row) => ({ email: row.email})));
      }
    }

    return NextResponse.json({ emails });
  } catch (e) {
    return NextResponse.json({ error: 'An error occurred' })
  }
}
