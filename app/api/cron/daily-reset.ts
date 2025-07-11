import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/cron-reset-trigger`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CRON_SECRET_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to trigger reset' });
  }
}