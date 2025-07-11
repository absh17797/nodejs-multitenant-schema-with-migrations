const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const tenantHeader = req.headers['x-tenant-id'];
  // console.log(tenantHeader,token)
  if (!token || !tenantHeader) {
    return res.status(401).json({ message: 'Missing token or tenant header' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (tenantHeader !== decoded.tenantId) {
      return res.status(403).json({ message: 'Tenant ID mismatch' });
    }
    req.user = decoded;
    req.tenantId = decoded.tenantId;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
