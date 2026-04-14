const db = require('../db');

/**
 * GET /admin/stats
 */
function getAdminStats(user) {
  if (!user || user.role !== 'admin') {
    return { status: 403, data: { error: 'Unauthorized' } };
  }

  const userCounts = db.prepare('SELECT role, COUNT(*) as count FROM users GROUP BY role').all();
  const totalPatients = userCounts.find(r => r.role === 'patient')?.count || 0;
  
  // Use user counts for doctors as well, but filter by approved in doctors table
  const totalDoctors = db.prepare('SELECT COUNT(*) as count FROM doctors WHERE approved = 1').get().count;
  const pendingApprovals = db.prepare('SELECT COUNT(*) as count FROM doctors WHERE approved = 0').get().count;
  
  const totalAreas = db.prepare('SELECT COUNT(*) as count FROM areas').get().count;
  const totalAppointments = db.prepare('SELECT COUNT(*) as count FROM appointments').get().count;

  return {
    status: 200,
    data: {
      totalPatients,
      totalDoctors,
      pendingApprovals,
      totalAreas,
      totalAppointments,
      systemHealth: '99.9%'
    }
  };
}

module.exports = { getAdminStats };
