import React, { Component } from 'react';

const Stars = (props) => {
    const arrayOfStars = Array(props.numOfStars).fill(0)
        .map((x, i) => <i key={i} className="fa fa-star"></i>);
    return (
        <div className="col-5">
            {arrayOfStars}
        </div>
    );
}

const Button = (props) => {
    let button;
    switch(props.answerIsCorrect) {
        case true:
            button = (
                <button className="btn btn-success">
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
        <div className="col-2">
            {button}
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
Numbers.list = Array(10).fill(0);

class Game extends Component {
    state = {
        selectedNumbers: [],
        numOfStars: 1 + Math.floor(Math.random() * 9),
        answerIsCorrect: null
    };
    selectNumber = (clickedNumber) => {
        if(this.state.selectedNumbers.indexOf(clickedNumber) >= 0){ return; }
        this.setState(prevState => ({
            selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
        }));
    };
    unselectNumber = (clickedNumber) => {
        this.setState(prevState => ({
            selectedNumbers: prevState.selectedNumbers.filter(n => n !== clickedNumber)
        }));
    };
    checkAnswer = () => {
        console.log(this.state.numOfStars, this.state.selectedNumbers.reduce((n1, n2) => n1 + n2, 0))
        this.setState(prevState => ({
            answerIsCorrect:
                prevState.numOfStars === prevState.selectedNumbers.reduce((n1, n2) => n1 + n2, 0)
        }))
    }
    render() {
        const {selectedNumbers, numOfStars, answerIsCorrect} = this.state;
        return (
            <div className="container">
                <h3>Play Nine</h3>
                <hr />
                <div className="row">
                    <Stars numOfStars={numOfStars}/>
                    <Button selectedNumbers={selectedNumbers} 
                        checkAnswer={this.checkAnswer}
                        answerIsCorrect={answerIsCorrect}/>
                    <Answer selectedNumbers={selectedNumbers}
                        unselectNumber={this.unselectNumber} />
                </div>
                <Numbers selectedNumbers={selectedNumbers} 
                    selectNumber={this.selectNumber} />
            </div>
        );
    }
}

export default Game;
