const express = require('express');
const router = express.Router();
const { createAgent, getAllAgents,getAgentById,
  updateAgent,
  deleteAgent } = require('../controllers/agentController');

router.post('/newAgent', createAgent);
router.get('/', getAllAgents);
router.get('/:id', getAgentById);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);

module.exports = router;
