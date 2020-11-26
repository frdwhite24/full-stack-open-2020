import { NewPatientEntry, Gender } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */

const isString = (value: any): value is string => {
  return typeof value === "string" || value instanceof String;
};

const isDate = (value: string): boolean => {
  return Boolean(Date.parse(value));
};

const isGender = (value: any): value is Gender => {
  return Object.values(Gender).includes(value);
};

const parseDate = (date: any): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + String(date));
  }
  return date;
};

const parseString = (value: any): string => {
  if (!value || !isString(value)) {
    throw new Error("Incorrect or missing value: " + String(value));
  }
  return value;
};

const parseGender = (gender: any): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + String(gender));
  }
  return gender;
};

const toNewPatientEntry = (object: any): NewPatientEntry => {
  return {
    name: parseString(object.name),
    dateOfBirth: parseDate(object.dateOfBirth),
    ssn: parseString(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseString(object.occupation),
  };
};

export default toNewPatientEntry;
