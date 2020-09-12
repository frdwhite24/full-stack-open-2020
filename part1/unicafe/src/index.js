import React, { useState } from "react";
import ReactDOM from "react-dom";

const Title = ({ text }) => <h1>{text}</h1>;

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>;

const Statistic = ({ text, value, unit }) => (
  <tr>
    <td>{text}</td>
    <td>
      {value} {unit}
    </td>
  </tr>
);

const Statistics = ({ stats }) => {
  if (stats.numFeedbackGiven === 0) {
    return <p>No feedback given</p>;
  }
  return (
    <table>
      <tbody>
        <Statistic text="good" value={stats.good} />
        <Statistic text="neutral" value={stats.neutral} />
        <Statistic text="bad" value={stats.bad} />
        <Statistic text="No. feedback given" value={stats.numFeedbackGiven} />
        <Statistic text="Average" value={stats.averageScore} />
        <Statistic
          text="Percentage positive"
          value={stats.percPositive}
          unit="%"
        />
      </tbody>
    </table>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const incrementVal = (handleState, value) => () => handleState(value + 1);
  const numFeedbackGiven = good + neutral + bad;

  const stats = {
    good,
    neutral,
    bad,
    numFeedbackGiven,
    averageScore: (good * 1 + neutral * 0 + bad * -1) / numFeedbackGiven,
    percPositive: (good / numFeedbackGiven) * 100,
  };

  return (
    <div>
      <div>
        <Title text="give feedback" />
        <Button text="good" onClick={incrementVal(setGood, good)} />
        <Button text="neutral" onClick={incrementVal(setNeutral, neutral)} />
        <Button text="bad" onClick={incrementVal(setBad, bad)} />
      </div>
      <div>
        <Title text="statistics" />
        <Statistics stats={stats} />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
