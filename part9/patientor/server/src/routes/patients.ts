import express from "express";

import patientsService from "../services/patientsService";
import toNewPatientEntry from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientsService.getNonSensitivePatientInfo());
});

router.post("/", (_req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);

    const addedEntry = patientsService.addPatient(newPatientEntry);
    res.json(addedEntry);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
