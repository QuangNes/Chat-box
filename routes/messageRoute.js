const { getInitMessages, reply } = require('../controllers/messageController');
const { Router } = require('@awaitjs/express');
const router = Router();

router.get("/", getInitMessages)
router.postAsync("/", reply)

module.exports = router;