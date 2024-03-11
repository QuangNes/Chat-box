const { getInitMessages, reply, saveFeedback } = require('../controllers/finetuningController');
const { Router } = require('@awaitjs/express');
const router = Router();

router.get("/message", getInitMessages)
router.postAsync("/message", reply)

router.post('/feedback', saveFeedback);

module.exports = router;