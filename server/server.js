const http = require('http');
const url = require('url');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const areaRoutes = require('./routes/areas');
const appointmentRoutes = require('./routes/appointments');
const historyRoutes = require('./routes/history');

const SECRET = "medlink_secret_2024";

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Parse body
  let body = {};
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    try {
      const data = await new Promise(resolve => {
        let chunkData = '';
        req.on('data', chunk => chunkData += chunk);
        req.on('end', () => resolve(chunkData));
      });
      if (data) body = JSON.parse(data);
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: "Invalid JSON body" }));
    }
  }

  // Parse URL
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  // Set default response headers
  res.setHeader('Content-Type', 'application/json');

  // Auth Middleware
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, SECRET);
    } catch (e) {
      // Invalid token, do not set req.user
    }
  }

  try {
    let routed = false;
    if (authRoutes(req.method, path, body, req, res)) routed = true;
    else if (doctorRoutes(req.method, path, parsedUrl, res)) routed = true;
    else if (areaRoutes(req.method, path, res)) routed = true;
    else if (appointmentRoutes(req.method, path, body, req, res)) routed = true;
    else if (historyRoutes(req.method, path, body, req, res)) routed = true;

    if (!routed) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Route not found" }));
    }
  } catch (err) {
    if (!res.headersSent) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  }
});

const PORT = 3001;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
