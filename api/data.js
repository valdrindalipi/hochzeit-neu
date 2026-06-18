export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return res.status(200).json(null);
  }

  const KEY = 'hochzeit_state';

  if (req.method === 'GET') {
    try {
      const r = await fetch(`${url}/get/${KEY}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const raw = await r.json();
      if (!raw.result) return res.status(200).json(null);

      // Unwrap string
      let data = raw.result;
      if (typeof data === 'string') { try { data = JSON.parse(data); } catch {} }
      if (typeof data === 'string') { try { data = JSON.parse(data); } catch {} }

      // If it's an array ["key", "{...}"], extract the second element
      if (Array.isArray(data)) {
        const val = data[1] ?? data[0];
        data = typeof val === 'string' ? JSON.parse(val) : val;
      }

      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      const toStore = typeof body === 'string' ? body : JSON.stringify(body);
      // Use SET command correctly: /set/KEY with value in body
      const r = await fetch(`${url}/set/${KEY}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(toStore)
      });
      const result = await r.json();
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).end();
}
