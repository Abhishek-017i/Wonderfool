const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

const {
  getAllPersons,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
  searchPersons,
} = require("../controllers/personController");

router.get("/", getAllPersons);
router.get("/search", searchPersons);
router.get("/:id", getPersonById);
router.post("/", verifyToken, createPerson);
router.put("/:id", verifyToken, updatePerson);
router.delete("/:id", verifyToken, deletePerson);

module.exports = router;