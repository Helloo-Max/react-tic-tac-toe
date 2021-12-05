import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// Component
// class Square extends React.Component {
//   render() {
//     return (
//       // onClick event listener => onClick() contains the handleClick() function
//       <button className="square" onClick={() => this.props.onClick()}>
//         {/*show the current value of state*/}
//         {this.props.value}
//       </button>
//     );
//   }
// }

// Re-written as function component
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// Another component
class Board extends React.Component {
  // 1. Give index information to the renderSquare method via this.renderSquare(i)
  // 2. Pass the information via props to the function component "Square"
  // 3. Define Logic in the "Game" class component
  // 4. Call the renderSquare method inside the "Board" render method (which renders the "Square" function component)

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        // onClick contains the jumpTo function
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {/*indices of the squares*/}
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  // 1. Initialize the state (all React component classes that have a constructor should start with a super(props))
  // 2. Store the current value of the square in this.state, and change it when the square is clicked
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true, // first player move to be “X” by default
    };
  }

  handleClick(i) {
    // Call slice() to create a copy of the squares array => allow us to store every past version of the squares array, and navigate in history)
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // [{…}, {…}, {…}] => {squares: Array(9)}, {...}, {...} ...
    const current = history[history.length - 1]; // access array with last game version via index => {squares: Array(9)}
    const squares = current.squares.slice(); // access the squares array => ["X", null, null, null, "O", null, null, "X", null]

    // Ignore a click if someone has won the game or if a square is already filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // Item access via index => set the item of the array to "X" or "O"
    squares[i] = this.state.xIsNext ? "X" : "O";
    // Update the state to represent the current game
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  // Recover previous game/ step state
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// Helper function to calculate the winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      console.log(squares[a]);
      return squares[a]; // return "X" or "O"
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
