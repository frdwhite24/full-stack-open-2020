type RatingRange = 1 | 2 | 3;
interface CalculateExercise {
  periodLength: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  exerciseRating: RatingRange;
  ratingDescription: String;
}

const calculateExercises = (
  target: number,
  exercise: Array<number>
): CalculateExercise => {
  const periodLength: number = exercise.length;
  const trainingDays: number = exercise.reduce(
    (sum: number, day: number) => (day === 0 ? sum : sum + 1),
    0
  );
  const average: number =
    exercise.reduce((sum: number, day: number) => sum + day, 0) / periodLength;
  const success: boolean = average >= target ? true : false;

  let exerciseRating: RatingRange;
  let ratingDescription: string;
  const percentage: number = average / target;
  if (percentage >= 1.0) {
    exerciseRating = 3;
    ratingDescription = "Well done! You achieved your target";
  } else if (percentage >= 0.8) {
    exerciseRating = 2;
    ratingDescription = "Not too bad, but could be better.";
  } else if (percentage < 0.8) {
    exerciseRating = 1;
    ratingDescription = "Try harder next time";
  }

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

const inputArgs: number[] = process.argv
  .slice(2)
  .map((element: String): number => Number(element));
const target = inputArgs[0];
const exercise = inputArgs.slice(1);
console.log(calculateExercises(target, exercise));
