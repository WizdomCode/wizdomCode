import React from 'react';
import Chart from 'react-apexcharts';

class SpiderChart extends React.Component {
  constructor(props) {
    super(props);

    // Convert the skills map into labels and values
    const labels = Object.keys(this.props.skills);
    const values = Object.values(this.props.skills);

    this.state = {
      series: [{
        name: 'Skills',
        data: values,
      }],
      options: {
        chart: {
          type: 'radar',
          dropShadow: {
            enabled: true,
            blur: 5,
            left: 2,
            top: 2,
            opacity: 0.1
          }
        },
        stroke: {
          width: 2
        },
        fill: {
          opacity: 0.1
        },
        markers: {
          size: 0
        },
        xaxis: {
          categories: labels
        }
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <Chart options={this.state.options} series={this.state.series} type="radar" height={350} />
      </div>
    );
  }
}

export default SpiderChart;
