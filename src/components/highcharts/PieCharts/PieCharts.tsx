import React, { useState, useEffect, useRef } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function PieCharts(props: HighchartsReact.Props & {
  data: { responseData:{ statistic_yyy: string, site_id: string, household_ordinary_m: string,
    household_ordinary_f: string, household_single_m: string, household_single_f: string,
    household_ordinary_total: string, household_single_total: string }[] }[],
  rules: { year: string, county: string, district: string }
}) {
  const { data, rules } = props;
  const [ChartsData, setChartsData] = useState({
    household_ordinary_total: 0,
    household_single_total: 0,
  });
  useEffect(() => {
    const newChartsData = { ...ChartsData };
    for (let u = 0; u < data.length; u += 1) {
      if (data[u].responseData[0].statistic_yyy === rules.year) {
        for (let o = 0; o < data[u].responseData.length; o += 1) {
          if (data[u].responseData[o].site_id.slice(0, 3) === rules.county
          && data[u].responseData[o].site_id.slice(3, 6) === rules.district) {
            newChartsData.household_ordinary_total
            += parseInt(data[u].responseData[o].household_ordinary_total, 10);
            newChartsData.household_single_total
            += parseInt(data[u].responseData[o].household_single_total, 10);
          }
        }
        break;
      }
    }
    setChartsData(newChartsData);
  }, [data, rules]);
  const options: Highcharts.Options = {
    chart: {
      // plotBackgroundColor: null,
      // plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    navigation: {
      buttonOptions: {
        enabled: false,
      },
    },
    credits: {
      enabled: false,
    },
    title: {
      text: '戶數統計',
      align: 'center',
      margin: 32,
      style: {
        fontSize: '24px',
      },
    },
    tooltip: {
      pointFormat: '<b>{point.percentage:.1f}%</b>',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.percentage:.2f} %</b>',
          style: {
            fontSize: '16px',
          },
        },
        showInLegend: true,
      },
    },
    series: [{
      type: 'pie',
      data: [{
        name: '共同生活',
        y: ChartsData.household_ordinary_total
        / (ChartsData.household_ordinary_total + ChartsData.household_single_total),
        color: '#626eb2',
      }, {
        name: '獨立生活',
        y: ChartsData.household_single_total
        / (ChartsData.household_ordinary_total + ChartsData.household_single_total),
        color: '#a3b1ff',
      }],
    }],
    legend: {
      itemStyle: {
        fontWeight: 'bolder',
      },
    },
  };
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}
      {...props}
    />
  );
}

export default PieCharts;
