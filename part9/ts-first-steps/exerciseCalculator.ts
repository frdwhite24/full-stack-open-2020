type RatingRange = 1 | 2 | 3;
interface CalculateExercise {
  periodLength: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  exerciseRating: RatingRange;
  ratingDescription: string;
}

interface RatingResult {
  exerciseRating: RatingRange;
  ratingDescription: string;
}

const assignRating = (percentage: number): RatingResult => {
  if (percentage >= 1.0) {
    return {
      exerciseRating: 3,
      ratingDescription: "Well done! You achieved your target",
    };
  } else if (percentage >= 0.8) {
    return {
      exerciseRating: 2,
      ratingDescription: "Not too bad, but could be better.",
    };
  } else {
    return { exerciseRating: 1, ratingDescription: "Try harder next time" };
  }
};

const isValidNumberArray = (inputArray: number[]): boolean => {
  const isValid: boolean =
    inputArray.filter((element) => isNaN(element)).length === 0 ? true : false;
  return isValid;
};

const calculateExercises = (
  target: number,
  exercise: Array<number>
): CalculateExercise => {
  if (!isValidNumberArray(exercise) || isNaN(target)) {
    throw new Error("Exercise entries and target must be numbers");
  }

  const periodLength: number = exercise.length;
  const trainingDays: number = exercise.reduce(
    (sum: number, day: number) => (day === 0 ? sum : sum + 1),
    0
  );
  const average: number =
    exercise.reduce((sum: number, day: number) => sum + day, 0) / periodLength;
  const success: boolean = average >= target ? true : false;

  const percentage: number = average / target;

  const { exerciseRating, ratingDescription } = assignRating(percentage);

  return {
    periodLength,
    trainingDays,
    target,
    average,
    success,
    exerciseRating,
    ratingDescription,
  };
};

if (require.main === module) {
  const inputArgs: number[] = process.argv
    .slice(2)
    .map((element: string): number => Number(element));
  const target = inputArgs[0];
  const exercise = inputArgs.slice(1);
  console.log(calculateExercises(target, exercise));
}

export default calculateExercises;
