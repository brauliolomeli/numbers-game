import React, { Component } from 'react';

var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

const Stars = (props) => {
    const arrayOfStars = Array(props.numOfStars).fill(0)
        .map((x, i) => <i key={i} className="fa fa-star"></i>);
    return (
        <div className="col-5">
            {arrayOfStars}
        </div>
    );
}

const DoneFrame = (props) => {
    return (
        <div className="text-center">
            <h2>{props.doneStatus}</h2>
            <button className="btn btn-secondary" onClick={props.resetGame}>Play Again</button>
        </div>
    );
}

const Button = (props) => {
    let button;
    switch(props.answerIsCorrect) {
        case true:
            button = (
                <button className="btn btn-success" onClick={props.acceptAnswer}>
                    <i className="fa fa-check"></i>
                </button>
            );
            break;
        case false:
            button = (
                <button className="btn btn-danger">
                    <i className="fa fa-times"></i>
                </button>
            );
            break;
        default:
            button = (
                <button className="btn" 
                    onClick={props.checkAnswer}
                    disabled={props.selectedNumbers.length === 0}>
                    <i className="fa fa-check"></i>
                </button>
            );
            break;
    }
    return (
        <div className="col-2 text-center">
            {button}
            <br /><br />
            <button className="btn btn-warning btn-sm" onClick={props.redraw}
                disabled={props.redraws===0}>
                <i className="fa fa-refresh"></i> {props.redraws}
            </button>
        </div>
    );
}

const Answer = (props) => {
    return (
        <div className="col-5">
            {props.selectedNumbers.map((number, i) => (
                <span onClick={()=>props.unselectNumber(number)} key={i}>{number}</span>
            ))}
        </div>
    );
}

const Numbers = (props) => {
    const numberClassName = (number) => {
        if (props.selectedNumbers.indexOf(number) >= 0) {
            return 'selected';
        }
        if (props.usedNumbers.indexOf(number) >= 0) {
            return 'used';
        }
    }
    return (
        <div className="card text-center">
            <div>
                {Numbers.list.map((x, index) => 
                    <span key={index} className={numberClassName(index+1)}
                    onClick={() => props.selectNumber(index+1)}>{index+1}</span>
                )}
            </div>
        </div>
    );
}
Numbers.list = Array(9).fill(0);

class Game extends Component {
    static randomNumber = () => 1 + Math.floor(Math.random() * 9)
    static initialState = () => ({
        selectedNumbers: [],
        numOfStars: Game.randomNumber(),
        answerIsCorrect: null,
        usedNumbers: [],
        redraws: 10,
        doneStatus: null
    });
    state = Game.initialState();
    selectNumber = (clickedNumber) => {
        if(this.state.selectedNumbers.indexOf(clickedNumber) >= 0){ return; }
        this.setState(prevState => ({
            answerIsCorrect: null,
            selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
        }));
    };
    unselectNumber = (clickedNumber) => {
        this.setState(prevState => ({
            selectedNumbers: prevState.selectedNumbers.filter(n => n !== clickedNumber)
        }));
    };
    checkAnswer = () => {
        this.setState(prevState => ({
            answerIsCorrect:
                prevState.numOfStars === prevState.selectedNumbers.reduce((n1, n2) => n1 + n2, 0)
        }))
    }
    acceptAnswer = () => {
        this.setState(prevState => ({
            usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
            selectedNumbers: [],
            answerIsCorrect: null,
            numOfStars: Game.randomNumber()
        }), this.updateDoneStatus);
    }
    redraw = () => {
        if (this.state.redraws === 0) { return; }
        this.setState(prevState => ({
            numOfStars: Game.randomNumber(),
            answerIsCorrect: null,
            selectedNumbers: [],
            redraws: prevState.redraws - 1
        }), this.updateDoneStatus);
    }
    updateDoneStatus = () => {
        this.setState(prevState => {
            if (prevState.usedNumbers.length === Numbers.list.length) {
                return { doneStatus: 'Done. Nice!' };
            }
            if (prevState.redraws === 0 && !this.possibleSolutions(this.state.numOfStars, this.state.usedNumbers)) {
                return { doneStatus: 'Game Over!' }
            }
        });
    }
    possibleSolutions = (numberOfStars, usedNumbers) => {
        const possibleNumbers = Numbers.list.map((n,i) => i+1)
            .filter(n => usedNumbers.indexOf(n) === -1);
        return possibleCombinationSum(possibleNumbers, numberOfStars);
    }
    resetGame = () => this.setState(Game.initialState());
    render() {
        const {selectedNumbers, numOfStars, answerIsCorrect, usedNumbers, redraws, doneStatus} = this.state;
        return (
            <div className="container">
                <h3>Play Nine</h3>
                <hr />
                <div className="row">
                    <Stars numOfStars={numOfStars}/>
                    <Button selectedNumbers={selectedNumbers} 
                        checkAnswer={this.checkAnswer}
                        answerIsCorrect={answerIsCorrect}
                        acceptAnswer={this.acceptAnswer}
                        redraw={this.redraw}
                        redraws={redraws}/>
                    <Answer selectedNumbers={selectedNumbers}
                        unselectNumber={this.unselectNumber} />
                </div>
                {doneStatus ?
                    <DoneFrame doneStatus={doneStatus} resetGame={this.resetGame}/>
                :
                    <Numbers selectedNumbers={selectedNumbers} 
                        selectNumber={this.selectNumber}
                        usedNumbers={usedNumbers} />
                }
            </div>
        );
    }
}

export default Game;
