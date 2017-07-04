import React, { Component } from 'react';
import Answer from './Answer';
import Button from './Button';
import DoneFrame from './DoneFrame';
import Numbers from './Numbers';
import Stars from './Stars';

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
