import { useState } from "react";

const Display = ({ counter }) => <div>{counter}</div>;

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const History = (props) => {
  if (props.allClicks.length === 0) {
    return <div>the app is used by pressing the buttons</div>;
  }
  return <div>button press history: {props.allClicks.join(" ")}</div>;
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);

  const StatisticLine = ({ text, value }) => {
    return (
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    );
  };

  const Statistics = ({ good, neutral, bad }) => {
    const total = good + neutral + bad;
    if (total < 1) {
      return (
        <div>
          <h3>Statistics</h3>
          <p>Nothing to display</p>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Statistics</h3>
          <table>
            <tbody>
              <StatisticLine text="good" value={good} />
              <StatisticLine text="neutral" value={neutral} />
              <StatisticLine text="bad" value={bad} />
              <StatisticLine
                text="Average"
                value={average(good, neutral, bad)}
              />
              <StatisticLine text="Postive" value={positive(good, total)} />
            </tbody>
          </table>
        </div>
      );
    }
  };

  const goodFeedback = () => {
    const updatedGood = good + 1;
    const updatedTotal = total + 1;
    setGood(updatedGood);
    setTotal(updatedTotal);
  };

  const neutralFeedback = () => {
    const updatedNeutral = neutral + 1;
    const updatedTotal = total + 1;
    setNeutral(updatedNeutral);
    setTotal(updatedTotal);
  };

  const badFeedback = () => {
    const updatedBad = bad + 1;
    const updatedTotal = total + 1;
    setBad(updatedBad);
    setTotal(updatedTotal);
  };

  const average = (arg1, arg2, arg3) => {
    return (arg1 + arg2 + arg3) / 3;
  };

  const positive = (positiveCount, totalCount) => {
    if (totalCount === 0) return "0%";
    const percentage = (positiveCount / totalCount) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  return (
    <div>
      <h3>Give Feedback </h3>

      <Button onClick={goodFeedback} text="Good" />
      <Button onClick={neutralFeedback} text="Neutral" />
      <Button onClick={badFeedback} text="Bad" />

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;

// const [left, setLeft] = useState(0);
// const [right, setRight] = useState(0);
// const [allClicks, setAll] = useState([]);

// const [total, setTotal] = useState(0);

// const handleLeftClick = () => {
//   setAll(allClicks.concat("L"));
//   const updatedLeft = left + 1;
//   setLeft(updatedLeft);
//   setTotal(updatedLeft + right);
// };

// const handleRightClick = () => {
//   setAll(allClicks.concat("R"));
//   const updatedRight = right + 1;
//   setRight(updatedRight);

//   setTotal(left + updatedRight);
// };

// const Header = (props) => {
//   console.log(props);
//   return (
//     <div>
//       <h1>{props.course.name}</h1>
//     </div>
//   );
// };

// const Content = (props) => {
//   console.log(props)
//   return (
//     <div>
//       {props.course.parts[0].name} <br />
//       {props.course.parts[1].name} <br />
//       {props.course.parts[2].name}
//     </div>
//   );
// };

// const Total = (props) => {
//   console.log(props); // Debugging output

//   return (
//     <div>
//       <p>
//         Total:  {props.course.parts[0].exercises + props.course.parts[1].exercises + props.course.parts[2].exercises}
//       </p>
//     </div>
//   );
// };

// const App = () => {

//   const course = {
//     name: 'Half Stack application development',
//     parts: [
//       {
//         name: 'Fundamentals of React',
//         exercises: 10
//       },
//       {
//         name: 'Using props to pass data',
//         exercises: 7
//       },
//       {
//         name: 'State of a component',
//         exercises: 14
//       }
//     ]
//   }

//   return (
//     <div>
//       <Header course={course} />
//       <Content course={course} />
//       <Total course={course} />
//     </div>
//   );
// };

// export default App;
