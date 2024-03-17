const { getInitMessages, reply, addDocuments, saveFeedback } = require('../controllers/embedingController');
const { Router } = require('@awaitjs/express');
const router = Router();

router.get("/message", getInitMessages)
router.postAsync("/message", reply)

router.post('/feeback', saveFeedback);
router.post('/document', addDocuments);

module.exports = router;