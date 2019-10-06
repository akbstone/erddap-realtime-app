import React from 'react'
import {select} from 'd3-selection';
import {erddapTimeseriesChart} from 'erddap-timeseries-chart';

class Station extends React.Component {
  
  componentDidMount(){

      let width = 500,
          height = 200,
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
          svg = select(this.refs.chart)
                .append('svg')
                    .attr('width',width)
                    .attr('height',height),

          chart = erddapTimeseriesChart()
                  .data(data)
                  .width(width)
                  .height(height)
                  .x(d=>d.time)
                  .y(d=>d.value)
                  .chartType('line'),

          chartSvg = select(this.refs.chart)
                .append('svg')
                .attr('width',width)
                .attr('height',height)
                .call(chart);
  }

  render() {
    return <div>
        <h1>Station name ({this.props.match.params.id})</h1>
        <div className="chartWrap" ref="chartWrap">
          <svg width="760" height="200" className="chart" ref="chart"></svg>
        </div>
      </div>
  }
}
export default Station