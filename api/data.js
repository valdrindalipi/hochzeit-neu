export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return res.status(200).json({ error: 'No KV configured' });
  }

  const KEY = 'hochzeit_state';

  if (req.method === 'GET') {
    try {
      const r = await fetch(`${url}/get/${KEY}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const raw = await r.json();
      if (!raw.result) return res.status(200).json(null);
      // Unwrap: Upstash returns result as string, parse it
      let data = raw.result;
      if (typeof data === 'string') data = JSON.parse(data);
      // If still double-wrapped, parse again
      if (typeof data === 'string') data = JSON.parse(data);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    try {
      // Always store as plain object string (not double-stringified)
      const body = req.body;
      const toStore = typeof body === 'string' ? body : JSON.stringify(body);
      const r = await fetch(`${url}/set/${KEY}`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([KEY, toStore])
      });
      const result = await r.json();
      return res.status(200).json({ ok: true, result });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).end();
}
