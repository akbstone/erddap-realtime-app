import React from 'react'
import {select} from 'd3-selection';
import {erddapTimeseriesChart} from 'erddap-timeseries-chart';

class Sensor extends React.Component {
  
  componentDidMount(){
    
      select(this.refs.chartWrap).select('*').empty();
      let width = this.props.width || this.refs.chartWrap.offsetWidth,
          height = this.props.height || 200,
          data = [
              {
                  time:new Date(2019,10,1),
                  value:10,
                  qc:1
              },
              {
                  time:new Date(2019,10,2),
                  value:11,
                  qc:3
              },
              {
                  time:new Date(2019,10,3),
                  value:4,
                  qc:3
              },
              {
                  time:new Date(2019,10,4),
                  value:5,
                  qc:4
              },
              {
                  time:new Date(2019,10,5),
                  value:2,
                  qc:1
              }

          ],
          svg = select(this.refs.chartWrap)
                .append('svg')
                    .attr('width',width)
                    .attr('height',height),

          chart = erddapTimeseriesChart()
                  .data(data)
                  .width(width)
                  .height(height)
                  .x(d=>d.time)
                  .y(d=>d.value)
                  .chartType('line');
        
        svg.call(chart);
  }

  render() {
        
    return <div>
        <h4>{this.props.label}</h4>
        <div className="chartWrap" ref="chartWrap">
        </div>
      </div>
  }
}
export default Sensor