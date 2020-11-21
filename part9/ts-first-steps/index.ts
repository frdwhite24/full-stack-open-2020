import express from "express";
import { calculateBmi } from "./bmiCalculator";
import calculateExercises from "./exerciseCalculator";

const app = express();

app.use(express.json());

const isValidNumberArray = (inputArray: number[]): boolean => {
  const isValid: boolean =
    inputArray.filter((element) => isNaN(element)).length === 0 ? true : false;
  return isValid;
};

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  isNaN(height) || isNaN(weight)
    ? res.json({ error: "malformatted parameters" })
    : res.json({ weight, height, bmi: calculateBmi(height, weight) });
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises: dailyExercises, target } = req.body;

  if (!dailyExercises || !target) {
    res.send({ error: "parameters missing" });
  }
  if (
    !Array.isArray(dailyExercises) ||
    !isValidNumberArray(dailyExercises) ||
    isNaN(target)
  ) {
    res.send({ error: "malformatted parameters" });
  }

  res.json(calculateExercises(target, dailyExercises));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
