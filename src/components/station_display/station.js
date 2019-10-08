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
      this.setState({station:stationMetadata})

  }
  render() {
    let sensors = [
        {
            label:'Air temperature',
            index:1,
            id:'air_temperature'
        },
        {
            label:'Water temperature',
            index:2,
            id:'water_temperature'
        },
        {
            label:'Salinity',
            index:3,
            id:'salinity'
        }

    ]
    return <div>
        <h1>Station name ({this.props.match.params.id})</h1>
        {sensors.map(sensor => (
            <Sensor key={sensor.index} label={sensor.label} height={100} />
        ))}
      </div>
  }
}
export default Station