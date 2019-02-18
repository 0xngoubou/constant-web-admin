const express = require('express');
const auth = require('./auth');

const router = express.Router();

router.get('/me', auth.me);
router.post('/login', auth.login);
router.post('/logout', auth.logout);

module.exports = router