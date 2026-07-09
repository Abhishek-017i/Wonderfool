const Person = require("../models/Person");
require("../models/Series");

const getAllPersons = async (req, res) => {
  try {
    const persons = await Person.find()
      .populate("knownWorks.seriesId");

    res.status(200).json(persons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPersonById = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id)
      .populate("knownWorks.seriesId");

    if (!person) {
      return res.status(404).json({
        message: "Person not found",
      });
    }

    res.status(200).json(person);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPerson = async (req, res) => {
  try {
    const person = new Person(req.body);

    const savedPerson = await person.save();

    res.status(201).json(savedPerson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePerson = async (req, res) => {
  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPerson) {
      return res.status(404).json({
        message: "Person not found",
      });
    }

    res.status(200).json(updatedPerson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePerson = async (req, res) => {
  try {
    const deletedPerson = await Person.findByIdAndDelete(req.params.id);

    if (!deletedPerson) {
      return res.status(404).json({
        message: "Person not found",
      });
    }

    res.status(200).json({
      message: "Person deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPersons,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
};