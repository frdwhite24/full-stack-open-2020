import patientsData from "../../data/patients";
import { NonSensitivePatientInfo } from "../types";

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

export default { getNonSensitivePatientInfo };
