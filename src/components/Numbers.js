import React from 'react';

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

export default Numbers;
