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
        name: 'Points',
        data: values,
      }],
      options: {
        chart: {
          type: 'radar',
          toolbar: {
            show: false
          },
          background: '#f8f8f8',
          dropShadow: {
            enabled: true,
            blur: 1,
            left: 1,
            top: 1,
            opacity: 0.1
          }
        },
        colors: ['#0084ff'],
        stroke: {
          width: 3,
          curve: 'smooth'
        },
        fill: {
          opacity: 0.1
        },
        markers: {
          size: 5,
          colors: ['#0084ff'],
          strokeWidth: 0,
          hover: {
            size: 7
          }
        },
        xaxis: {
          categories: labels,
          labels: {
            style: {
              colors: '#333',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Arial, sans-serif'
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: '#333',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Arial, sans-serif'
            }
          }
        }
      }
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
