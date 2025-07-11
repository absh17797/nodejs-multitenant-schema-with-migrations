const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.json({
    message: `Welcome ${req.user.userId} from tenant ${req.tenantId}`
  });
});

module.exports = router;
