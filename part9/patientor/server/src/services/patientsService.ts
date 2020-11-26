import { v4 as uuid } from "uuid";

import patientsData from "../../data/patients";
import { NonSensitivePatientInfo, Patient, NewPatientEntry } from "../types";

const patients: NonSensitivePatientInfo[] = patientsData;

const getNonSensitivePatientInfo = (): NonSensitivePatientInfo[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => {
    return {
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
    };
  });
};

const addPatient = (entry: NewPatientEntry): Patient => {
  const newEntry = {
    id: uuid(),
    ...entry,
  };

  patientsData.push(newEntry);
  return newEntry;
};

export default { getNonSensitivePatientInfo, addPatient };
