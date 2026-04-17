const router = require('express').Router();
const Setting = require('../models/Setting');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Get public settings (for frontend)
router.get('/public', async (req, res) => {
  try {
    let fontFamily = await Setting.findOne({ key: 'font_family' });
    if (!fontFamily) {
      fontFamily = { value: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif" };
    }
    res.json({ fontFamily: fontFamily.value });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update settings (admin only)
router.put('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { fontFamily } = req.body;
    await Setting.findOneAndUpdate(
      { key: 'font_family' },
      { key: 'font_family', value: fontFamily },
      { upsert: true, new: true }
    );
    res.json({ message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
