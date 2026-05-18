import jwt from 'jsonwebtoken';

export async function generateStreamToken(req, res) {
  try {
    const { userId, name, image } = req.body || {};

    if (!process.env.STREAM_SECRET || !process.env.STREAM_API_KEY) {
      return res.status(500).json({ error: 'Stream API key/secret not configured on server' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Stream expects a token signed with your STREAM_SECRET. We include the user id as `user_id`.
    const payload = {
      user_id: String(userId)
    };

    // Short lived token for safety
    const token = jwt.sign(payload, process.env.STREAM_SECRET, { expiresIn: '1h' });

    console.log(`[stream] issued token for userId=${userId}`);
    return res.json({ token });
  } catch (err) {
    console.error('Failed to generate stream token', err);
    return res.status(500).json({ error: 'Failed to generate stream token' });
  }
}
