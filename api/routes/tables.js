const Tables = require('../models/Tables.js')
const express = require("express");
const router = express.Router();

router.get("/get-all", async (req, res) => {
    try {
        const tables = await Tables.find();
        res.status(200).send(tables);
    } catch (error) {
        res.status(404).json(error)
    }
});
router.post("/add-tables", async (req, res) => {
    try {
        const newTable = new Tables(req.body);
        await newTable.save();
        res.status(200).send("Table added succesfully");
    } catch (error) {
        res.status(400).json(error);
    }
});
router.delete("/del-table/:id", async (req, res) => {
    try {
        await Tables.findByIdAndDelete(req.params.id);
        res.status(200).send("Table deleted successfully");
    } catch (error) {
        res.status(400).json(error);
    }
});
module.exports = router;