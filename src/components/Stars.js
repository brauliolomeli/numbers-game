import React from 'react';

const Stars = (props) => {
    const arrayOfStars = Array(props.numOfStars).fill(0)
        .map((x, i) => <i key={i} className="fa fa-star"></i>);
    return (
        <div className="col-5">
            {arrayOfStars}
        </div>
    );
}

export default Stars;
