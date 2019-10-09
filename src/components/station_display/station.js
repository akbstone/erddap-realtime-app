import React from 'react'
import Sensor from './sensor';
import {erddapParser} from 'erddap-parser';

class Station extends React.Component {
  async componentDidMount(){
      this.setState({station:null})
      let stationMetadata = await erddapParser.getDatasetMetadata({
        server:'https://erddap.sensors.axds.co/erddap',
        dataset_id:this.props.match.params.id
      })
      if(Array.isArray(stationMetadata)){
          stationMetadata = {
              parameters:stationMetadata.slice().map(p=>{
                  return Object.assign(
                    p,
                    {
                      dataset_id:this.props.match.params.id,
                      variable_name:p['Variable Name']
                    }
                  )
              }),
              label:this.props.match.params.id
          }
      }
      this.setState({station:stationMetadata})

  }
  render() {
    let output = 'Loading..',
        state = this.state;
    if(state && state.station){
        let parameters = this.state.station.parameters.slice().map((d,i)=>{
            return Object.assign(
                d,
                {
                    index:i
                }
            )
        })
      output = <div className="station-wrap" style={{marginBottom: "64px"}}>
        <h1>Station name ({this.props.match.params.id})</h1>
        {parameters.map(parameter => (
            <Sensor key={parameter.index} parameter={parameter} height={100} />
        ))}
      </div>
    }
    return output;
  }
}
export default Station
