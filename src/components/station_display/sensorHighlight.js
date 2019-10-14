import React from 'react'


function SensorHighlight({ highlight }){
    
    if (highlight){
        return (
            <React.Fragment>
                <h3>
                    <b>{highlight.value.toFixed(2)}</b>
                </h3>
                <span style={{fontSize:"10px"}}>
                    {highlight.time.toISOString()}
                </span>
                
                
            </React.Fragment>
        )
    }

    return null;

}

export default SensorHighlight;