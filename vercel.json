// Vercel Serverless Function — uses Upstash Redis for persistence

const DEFAULT_STATE = {
  items: [
    { name: "Restaurant White Garden (300 × 55)", kosten: 16500, bezahlt: 4950, cur: "CHF" },
    { name: "Fotograf",                            kosten: 2100,  bezahlt: 0,    cur: "CHF" },
    { name: "Fotobox",                             kosten: 400,   bezahlt: 100,  cur: "CHF" },
    { name: "Valltaret (Musik Zeremonie)",         kosten: 1000,  bezahlt: 300,  cur: "CHF" },
    { name: "DJ",                                  kosten: 250,   bezahlt: 0,    cur: "CHF" },
    { name: "Remzie & Nexhat (Catering/Service)",  kosten: 7500,  bezahlt: 500,  cur: "CHF" },
    { name: "Deko (Blumen, Zeremonie, Fotowand)",  kosten: 8500,  bezahlt: 0,    cur: "CHF" },
    { name: "Hochzeitstorte",                      kosten: 600,   bezahlt: 0,    cur: "CHF" },
    { name: "Weddingplanner",                      kosten: 1000,  bezahlt: 0,    cur: "CHF" },
    { name: "SOS-Budget (Reserve)",                kosten: 1500,  bezahlt: 0,    cur: "CHF" },
    { name: "AliExpress Dekorationen",             kosten: 500,   bezahlt: 500,  cur: "CHF" },
    { name: "Anzüge (Bräutigam)",                  kosten: 1400,  bezahlt: 500,  cur: "CHF" },
    { name: "Makeup",                              kosten: 530,   bezahlt: 50,   cur: "CHF" },
    { name: "Kleid Standesamt",                    kosten: 300,   bezahlt: 300,  cur: "CHF" },
    { name: "Gemeindegebühren",                    kosten: 400,   bezahlt: 400,  cur: "CHF" },
    { name: "Essen Standesamt",                    kosten: 1500,  bezahlt: 0,    cur: "CHF" },
  ],
  savings: [
    { name: "Sparkonto Valdrin",               betrag: 5000,  cur: "CHF" },
    { name: "Sparkonto Katia",                 betrag: 20000, cur: "CHF" },
    { name: "Cash Valdrin (10'230 + 1'920)",   betrag: 12150, cur: "CHF" },
    { name: "Cash Katia",                      betrag: 8000,  cur: "CHF" },
    { name: "Cash Verlobung",                  betrag: 6000,  cur: "CHF" },
    { name: "Cash Katia Vater Familie",        betrag: 4200,  cur: "EUR" },
  ],
  finance: { vater: 10000, vaterCur: "CHF", elternKatia: 0, elternKatiaCur: "CHF" },
  history: [],
  todos: [
    { id:1,  text:"Standesamt Termin bestätigen", done:false, category:"Behörden" },
    { id:2,  text:"Einladungen verschicken",      done:false, category:"Gäste"    },
    { id:3,  text:"Blumendekor finalisieren",     done:false, category:"Deko"     },
    { id:4,  text:"Musik-Playlist für DJ",        done:false, category:"Musik"    },
    { id:5,  text:"Menü bestätigen mit Restaurant",done:false,category:"Essen"    },
    { id:6,  text:"Ringe abholen",                done:false, category:"Ringe"    },
    { id:7,  text:"Brautkleid letzte Anprobe",    done:false, category:"Outfit"   },
    { id:8,  text:"Hotelzimmer für Hochzeitsnacht",done:false,category:"Logistik" },
    { id:9,  text:"Sitzordnung erstellen",        done:false, category:"Gäste"    },
    { id:10, text:"Fotograf Briefing",            done:false, category:"Fotos"    },
  ]
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Use Upstash REST API directly via env vars set by Vercel integration
  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    // No DB configured — return default so app still works
    return res.status(200).json(DEFAULT_STATE);
  }

  const KEY = 'hochzeit_state';

  if (req.method === 'GET') {
    try {
      const r = await fetch(`${url}/get/${KEY}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await r.json();
      if (data.result) {
        return res.status(200).json(JSON.parse(data.result));
      }
      return res.status(200).json(DEFAULT_STATE);
    } catch (e) {
      return res.status(200).json(DEFAULT_STATE);
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      await fetch(`${url}/set/${KEY}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).end();
}
