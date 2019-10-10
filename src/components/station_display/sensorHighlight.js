import React from 'react'


function SensorHighlight(props){
    const [highlight, parameter] = React.useState(null);
    React.useEffect(() => {

    },[highlight])

    React.useEffect(() => {

    },[parameter])

    let output = (<p>...</p>)
    if(highlight){
        output = (
            <p>{highlight.value}</p>
        )
    }
    return output;
}

export default SensorHighlight;