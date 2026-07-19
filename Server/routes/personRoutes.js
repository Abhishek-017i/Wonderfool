const express = require("express");
const router = express.Router();

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
router.post("/", createPerson);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);

module.exports = router;