export const calculateBmi = (height: number, weight: number): string => {
  // To account for input of cm
  if (height > 5) {
    height = height / 100;
  }

  const bmi: number = weight / (height * height);

  if (bmi < 18.5) {
    return "Low (underweight)";
  } else if (bmi >= 18.5 && bmi < 25) {
    return "Normal (healthy weight)";
  } else if (bmi >= 25 && bmi < 30) {
    return "High (overweight)";
  } else if (bmi >= 30) {
    return "Very High (obese)";
  } else {
    throw new Error("Unable to calculate BMI");
  }
};

if (require.main === module) {
  const height = Number(process.argv[2]);
  const weight = Number(process.argv[3]);
  console.log(calculateBmi(height, weight));
}
