const Field = require("../models/field.model");

// Create a new field
const createField = async (req, res) => {
  try {
    const newField = new Field(req.body);
    await newField.save();
    res.status(201).json(newField);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all fields
const getAllFields = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from query params, default to 1
    const perPage = parseInt(req.query.perPage) || 10; // Get the number of items per page from query params, default to 10

    const totalFields = await Field.countDocuments();
    const totalPages = Math.ceil(totalFields / perPage);

    const fields = await Field.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    res.status(200).json({
      fields,
      currentPage: page,
      totalPages
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
// Get a field by ID
const getFieldById = async (req, res) => {
  try {
    const field = await Field.findById(req.params.fieldId);
    if (!field) {
      return res.status(404).json({ error: "Field not found" });
    }
    res.status(200).json(field);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a field by ID
const updateFieldById = async (req, res) => {
  try {
    const updatedField = await Field.findByIdAndUpdate(
      req.params.fieldId,
      req.body,
      { new: true }
    );
    if (!updatedField) {
      return res.status(404).json({ error: "Field not found" });
    }
    res.status(200).json(updatedField);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a field by ID
const deleteFieldById = async (req, res) => {
  try {
    const deletedField = await Field.findByIdAndRemove(req.params.fieldId);
    if (!deletedField) {
      return res.status(404).json({ error: "Field not found" });
    }
    res.status(200).json({ message: "Field deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createField,
  getAllFields,
  getFieldById,
  updateFieldById,
  deleteFieldById
};
