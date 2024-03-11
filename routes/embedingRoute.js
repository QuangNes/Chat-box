const { getInitMessages, reply } = require('../controllers/embedingController');
const { Router } = require('@awaitjs/express');
const router = Router();

router.get("/message", getInitMessages)
router.postAsync("/message", reply)

router.post('/feeback', () => {});

module.exports = router;