const fs = require("fs");
const path = require("path");
const FieldModel = require("../models/field.model");
require("dotenv").config(); 
const mongoose = require('mongoose'); 
const filePaths = [
  "./nabeul.json",
  "./sfax.json",
  "./sousse.json",
  "./tunis.json"
];

const seedFields = async () => {
    
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    for (const filePath of filePaths) {
      const absolutePath = path.resolve(__dirname, filePath);

      if (!fs.existsSync(absolutePath)) {
        console.error(`File not found: ${absolutePath}`);
        continue;
      }

      const rawData = fs.readFileSync(absolutePath);
      const jsonData = JSON.parse(rawData);

      for (const data of jsonData) {
        const newField = new FieldModel({
          fieldName: data.nom || "Default Field Name",
          owner: "64ed1c67565f07de3790221e",
          contactPhone: "+21620831241",
          maxPlayers: 22,
          mapLocation: {
            latitude: parseFloat(data.adresse.lat),
            longitude: parseFloat(data.adresse.long)
          },
          address: data.adresse.state || "Default Address"
        });

        await newField.save();
      }
    }

    console.log("Seed data inserted successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedFields(); // Call the seed function to insert data from JSON files into the database
