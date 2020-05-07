import React from 'react'
import {select} from 'd3-selection';
import {erddapTimeseriesChart} from 'erddap-timeseries-chart';
import {erddapParser} from 'erddap-parser';
import SensorHighlight from './sensorHighlight';



class Sensor extends React.Component {
   
   constructor(props){
       super(props)
       this.state = {highlight:null};

       this.onMouseMove = this.onMouseMove.bind(this);
       this.onMouseOut = this.onMouseOut.bind(this)
   }
  
  async componentDidMount(){
    
    try {

        select(this.refs.chartWrap).select('*').empty();

        let now = new Date(),
            day = 24*60*60*1000,
            start = new Date(+now - 10*day),
            end = now,
            variable_names = {time:'time'},
            width = this.props.width || this.refs.chartWrap.offsetWidth,
            height = this.props.height || 200,
            svg = select(this.refs.chartWrap)
                    .append('svg')
                        .attr('width',width)
                        .attr('height',height);

        variable_names[this.props.parameter.variable_name] = 'value';

        let data = await erddapParser.getTabledapData({
                server: process.env.REACT_APP_ERDDAP_URL || 'https://erddap.sensors.axds.co/erddap',
                dataset_id:this.props.parameter.dataset_id,
                variables:[
                    'time',
                    this.props.parameter.variable_name
                ],
                constraints:{
                    'time>=':start,
                    'time<=':end
                },
                variable_names:variable_names
            }),
            highlightLast = ()=>{
                chart.highlightAtX(width)
            },
            chart = erddapTimeseriesChart()
                    .data(data)
                    .width(width)
                    .height(height)
                    .x(d=>d[process.env.REACT_APP_TIME_VAR || 'time'])
                    .y(d=>d.value)
                    .chartType('line')
                    .on('mousemove',this.onMouseMove)
                    .on('mouseout',highlightLast);
            
            svg.call(chart);
            
            highlightLast();
        }catch(e){
            throw(e)
        }
  }

  onMouseMove(e) {
    this.setState({highlight: e});
  }
  onMouseOut() {
      //this.setState({highlight:null})
  }

  render() {

        
    return <div style={{clear:"both"}}>
        <h4>{this.props.parameter.long_name} ({this.props.parameter.units})</h4>
        <div style={{float:"right",width:"120px"}}><SensorHighlight highlight={this.state.highlight} parameter={this.props.parameter} /></div>
        <div className="chartWrap" ref="chartWrap" style={{marginRight:"120px"}}>
        </div>
      </div>
  }
}
export default Sensor
