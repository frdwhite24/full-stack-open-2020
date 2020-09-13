import React, { useState } from "react";
import ReactDOM from "react-dom";

const Title = ({ text }) => <h1>{text}</h1>;

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>;

const DisplayText = ({ value }) => <p>{value}</p>;

const DisplayAnecdote = ({ anecdote, numVotes }) => {
  return (
    <>
      <DisplayText value={anecdote} />
      <DisplayText value={`has ${numVotes} votes`} />
    </>
  );
};

const MaxVotesAnecdote = ({ anecdotes, points }) => (
  <DisplayAnecdote
    anecdote={anecdotes[points.indexOf(Math.max(...points))]}
    numVotes={Math.max.apply(null, points)}
  />
);

const App = (props) => {
  const anecdotes = props.anecdotes;
  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0));

  const generateRandomNum = () => Math.floor(Math.random() * anecdotes.length);

  const getRandomAnecdote = () => () => {
    let newSelection = generateRandomNum();
    while (selected === newSelection) {
      newSelection = generateRandomNum();
    }
    setSelected(newSelection);
  };

  const addVote = () => () => {
    const copy = [...points];
    copy[selected] += 1;
    setPoints(copy);
  };

  return (
    <>
      <div>
        <Title text="Anecdote of the day" />
        <Button text="vote" onClick={addVote()} />
        <Button text="next anecdote" onClick={getRandomAnecdote()} />
        <DisplayAnecdote
          anecdote={anecdotes[selected]}
          numVotes={points[selected]}
        />
      </div>
      <div>
        <Title text="Anecdote with the most votes" />
        <MaxVotesAnecdote anecdotes={anecdotes} points={points} />
      </div>
    </>
  );
};

const anecdotes = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById("root"));
