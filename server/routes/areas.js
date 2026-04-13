const db = require('../db');

function sendError(res, status, message) {
  res.writeHead(status);
  res.end(JSON.stringify({ error: message }));
  return true;
}

module.exports = function areaRoutes(method, path, res) {
  // GET /areas
  if (method === 'GET' && path === '/areas') {
    try {
      const areas = db.prepare('SELECT * FROM areas').all();
      res.writeHead(200);
      res.end(JSON.stringify(areas));
      return true;
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }

  // GET /areas/:id/doctors
  const areaDocMatch = path.match(/^\/areas\/(\d+)\/doctors$/);
  if (method === 'GET' && areaDocMatch) {
    try {
      const doctors = db.prepare('SELECT doctors.*, areas.name as area_name FROM doctors JOIN areas ON doctors.area_id = areas.id WHERE area_id = ?').all(areaDocMatch[1]);
      res.writeHead(200);
      res.end(JSON.stringify(doctors));
      return true;
    } catch (err) {
      return sendError(res, 500, err.message);
    }
  }

  return false;
};
