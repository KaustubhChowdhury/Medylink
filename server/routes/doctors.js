const db = require('../db');

function sendError(res, status, message) {
  res.writeHead(status);
  res.end(JSON.stringify({ error: message }));
  return true;
}

module.exports = function doctorRoutes(method, path, urlObj, res) {
  // GET /doctors
  if (method === 'GET' && path === '/doctors') {
    let query = 'SELECT doctors.*, areas.name as area_name FROM doctors JOIN areas ON doctors.area_id = areas.id WHERE 1=1';
    const params = [];

    if (urlObj.query.area) {
      query += ' AND areas.name = ?';
      params.push(urlObj.query.area);
    }
    if (urlObj.query.specialty) {
      query += ' AND doctors.specialty = ?';
      params.push(urlObj.query.specialty);
    }
    if (urlObj.query.maxPrice) {
      query += ' AND doctors.price <= ?';
      params.push(parseInt(urlObj.query.maxPrice, 10));
    }
    if (urlObj.query.availableOnly === 'true') {
      query += ' AND doctors.available = 1';
    }

    try {
      const doctors = db.prepare(query).all(...params);
      res.writeHead(200);
      res.end(JSON.stringify(doctors));
      return true;
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }

  // GET /doctors/:id
  const docMatch = path.match(/^\/doctors\/(\d+)$/);
  if (method === 'GET' && docMatch) {
    try {
      const doctor = db.prepare('SELECT doctors.*, areas.name as area_name FROM doctors JOIN areas ON doctors.area_id = areas.id WHERE doctors.id = ?').get(docMatch[1]);
      if (!doctor) return sendError(res, 404, "Doctor not found");
      res.writeHead(200);
      res.end(JSON.stringify(doctor));
      return true;
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }
  
  // GET /compare?ids=1,2,3
  if (method === 'GET' && path === '/compare') {
    try {
      if (!urlObj.query.ids) {
        return sendError(res, 400, "Missing ids parameter");
      }
      const ids = urlObj.query.ids.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
      if (ids.length === 0) {
        return sendError(res, 400, "Invalid ids parameter");
      }
      const placeholders = ids.map(() => '?').join(',');
      const doctors = db.prepare(`SELECT doctors.*, areas.name as area_name FROM doctors JOIN areas ON doctors.area_id = areas.id WHERE doctors.id IN (${placeholders})`).all(...ids);
      res.writeHead(200);
      res.end(JSON.stringify(doctors));
      return true;
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }

  return false;
};
