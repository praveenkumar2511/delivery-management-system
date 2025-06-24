const express = require('express');
const router = express.Router();
const { createAgent, getAllAgents,getAgentById,
  updateAgent,
  deleteAgent,calculateWages,checkIn,checkOut,getWages } = require('../controllers/agentController');

router.post('/newAgent', createAgent);
router.get('/', getAllAgents);
router.get('/:id', getAgentById);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);
router.get("/:id/wages", calculateWages);

//Checkin
router.patch("/:id/checkin", checkIn);
router.patch("/:id/checkout", checkOut);

//Getwages
router.get("/:id/wages", getWages);

module.exports = router;
