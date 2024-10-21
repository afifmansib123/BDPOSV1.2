const Bill = require("../models/Bill.js");
const express = require("express");
const router = express.Router();

router.get("/get-all", async (req, res) => {
  try {
    const bills = await Bill.find();
    res.status(200).send(bills);
  } catch (error) {
    res.status(404).json(error)
  }
});

router.post("/add-bill", async (req, res) => {
  try {
    const newBill = new Bill(req.body);
    await newBill.save();
    res.status(200).send("Item added succesfully");
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put("/update-bill", async(req, res) => {
  try{
    const updatedBill = await Bill.findOneAndUpdate({ _id: req.body._id }, req.body);
    res.send(updatedBill || "Order Checked Successfully!");
  }catch(error){
    res.status(400).json(error)
  }
})

module.exports = router;
