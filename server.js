import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Stub API endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', provider: 'mock', model: 'mock' });
});

app.get('/v1/models', (req, res) => {
  res.json({ models: [], failed_providers: [] });
});

app.get('/muse-code/models', (req, res) => {
  res.json({ models: [], failed_providers: [] });
});

// Admin API Stubs
app.get('/admin/api/config', (req, res) => {
  res.json({});
});

app.get('/admin/api/status', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/admin/api/config/apply', (req, res) => {
  res.json({ status: 'applied' });
});

app.get('/admin/api/providers/local-status', (req, res) => {
  res.json({ providers: [] });
});

app.post('/admin/api/providers/:provider_id/test', (req, res) => {
  res.json({ status: 'tested' });
});

app.get('/admin/api/integrations/:id', (req, res) => {
  res.json({ status: 'not_connected' });
});

// Fallback for any other API route
app.all('/v1/*', (req, res) => {
  res.status(501).json({ error: 'Not yet migrated' });
});

app.all('/admin/api/*', (req, res) => {
  res.status(501).json({ error: 'Not yet migrated' });
});

// Serve static assets
// Assets are mounted at /admin/assets/:version/:filename
app.use('/admin/assets', (req, res, next) => {
  // Extract filename after the version
  const parts = req.path.split('/');
  // path is like /__FCC_VERSION__/admin.css
  if (parts.length >= 3) {
    const filename = parts.slice(2).join('/');
    req.url = '/' + filename;
  }
  next();
}, express.static(path.join(__dirname, 'public')));

app.get('/admin', (req, res) => {
  const htmlPath = path.join(__dirname, 'public', 'index.html');
  fs.readFile(htmlPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error loading page');
    }
    const html = data.replaceAll('__FCC_VERSION__', '1.0.0');
    res.send(html);
  });
});

// Catch-all
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
