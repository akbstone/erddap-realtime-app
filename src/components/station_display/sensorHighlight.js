import React from 'react'


function SensorHighlight({ highlight }){
    
    if (highlight){
        return (
            <p>
                <span>
                    {highlight.time.toISOString()}
                </span>
                &nbsp;
                :
                &nbsp;
                <span style={{backgroundColor: '#FFFF00'}}>
                    <b>{highlight.value.toFixed(2)}</b>
                </span>
            </p>
        )
    }

    return null;

}

export default SensorHighlight;