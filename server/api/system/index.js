const express = require("express");
const profiles = require("./profiles");

const router = express.Router();

router.get("/profiles", profiles.list);
router.post("/profiles/:id/submit", profiles.submit);
router.post("/profiles/:id/discard", profiles.discard);
router.post("/profiles/:id/ban", profiles.ban);

module.exports = router;
