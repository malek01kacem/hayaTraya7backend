const express = require("express");
const router = express.Router();
const {
  createField,
  getFieldById,
  deleteFieldById,
  updateFieldById,
  getAllFields
} = require("../controllers/field.controller");

router.get("/", getAllFields);
router.post("/create", createField);
router.delete("/delete/:fieldId", deleteFieldById);
router.put("/update/:fieldId", updateFieldById);
router.get("/one/:fieldId", getFieldById);

module.exports = router;
