import React from "react";
import ReactDOM from "react-dom";

interface CoursePartBase {
  id: number;
  name: string;
  exerciseCount: number;
}

interface DescCoursePartBase extends CoursePartBase {
  description: string;
}

interface CoursePartOne extends DescCoursePartBase {
  name: "Fundamentals";
  description: string;
}

interface CoursePartTwo extends CoursePartBase {
  name: "Using props to pass data";
  groupProjectCount: number;
}

interface CoursePartThree extends DescCoursePartBase {
  name: "Deeper type usage";
  exerciseSubmissionLink: string;
}

interface CoursePartFour extends DescCoursePartBase {
  name: "More confusing code";
  numberOfSubmissions: number;
}

type CoursePart =
  | CoursePartOne
  | CoursePartTwo
  | CoursePartThree
  | CoursePartFour;

interface PartProps {
  part: CoursePart;
}

interface HeaderProps {
  name: string;
}

interface ContentProps {
  courseParts: CoursePart[];
}

interface TotalProps {
  courseParts: CoursePart[];
}

const Header: React.FC<HeaderProps> = ({ name }) => <h1>{name}</h1>;

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part: React.FC<PartProps> = ({ part }) => {
  switch (part.name) {
    case "Fundamentals":
      return (
        <p>{`"${part.name}" (${part.exerciseCount} exercises) - ${part.description}`}</p>
      );
    case "Using props to pass data":
      return (
        <p>{`"${part.name}" (${part.exerciseCount} exercises, ${part.groupProjectCount} group exercises)`}</p>
      );
    case "Deeper type usage":
      return (
        <p>{`"${part.name}" (${part.exerciseCount} exercises) - ${part.description}, submit here: ${part.exerciseSubmissionLink}`}</p>
      );
    case "More confusing code":
      return (
        <p>{`"${part.name}" (${part.exerciseCount} exercises) - ${part.description}, ${part.numberOfSubmissions} submitted`}</p>
      );
    default:
      return assertNever(part);
  }
};

const Content: React.FC<ContentProps> = ({ courseParts }) => {
  return (
    <div>
      {courseParts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  );
};

const Total: React.FC<TotalProps> = ({ courseParts }) => {
  const total: number = courseParts.reduce(
    (prev, part) => prev + part.exerciseCount,
    0
  );
  return <p>{`Number of exercises ${total}`}</p>;
};

const App: React.FC = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      id: 1,
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
    },
    {
      id: 2,
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
    },
    {
      id: 3,
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev",
    },
    {
      id: 4,
      name: "More confusing code",
      exerciseCount: 24,
      description: "Extra hard code",
      numberOfSubmissions: 1,
    },
  ];

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
