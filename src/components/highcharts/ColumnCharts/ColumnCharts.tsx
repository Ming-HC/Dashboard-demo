import React, { useState, useEffect, useRef } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function ColumnCharts(
  props: HighchartsReact.Props & {
    data: { responseData:{ statistic_yyy: string, site_id: string, household_ordinary_m: string,
      household_ordinary_f: string, household_single_m: string, household_single_f: string,
      household_ordinary_total: string, household_single_total: string }[] }[],
    rules: { year: string, county: string, district: string }
  },
) {
  const { data, rules } = props;
  const [ChartsData, setChartsData] = useState({
    household_ordinary_m: 0,
    household_ordinary_f: 0,
    household_single_m: 0,
    household_single_f: 0,
  });
  useEffect(() => {
    const newChartsData = { ...ChartsData };
    for (let u = 0; u < data.length; u += 1) {
      if (data[u].responseData[0].statistic_yyy === rules.year) {
        for (let o = 0; o < data[u].responseData.length; o += 1) {
          if (data[u].responseData[o].site_id.slice(0, 3) === rules.county
          && data[u].responseData[o].site_id.slice(3, 6) === rules.district) {
            newChartsData.household_ordinary_m
            += parseInt(data[u].responseData[o].household_ordinary_m, 10);
            newChartsData.household_ordinary_f
            += parseInt(data[u].responseData[o].household_ordinary_f, 10);
            newChartsData.household_single_m
            += parseInt(data[u].responseData[o].household_single_m, 10);
            newChartsData.household_single_f
            += parseInt(data[u].responseData[o].household_single_f, 10);
          }
        }
        break;
      }
    }
    setChartsData(newChartsData);
  }, [data, rules]);

  const options: Highcharts.Options = {
    chart: {
      type: 'column',
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
      text: '人口數統計',
      margin: 32,
      style: {
        fontSize: '24px',
      },
    },
    xAxis: {
      categories: ['共同生活', '獨立生活'],
      crosshair: true,
      title: {
        text: '型態',
        style: {
          color: 'black',
          fontSize: '16px',
          fontWeight: 'bolder',
        },
      },
    },
    yAxis: {
      min: 0,
      lineWidth: 1,
      tickWidth: 1,
      title: {
        align: 'high',
        offset: 0,
        text: '數量',
        rotation: 0,
        y: -20,
        style: {
          color: 'black',
          fontSize: '16px',
          fontWeight: 'bolder',
        },
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'
        + '<td style="padding:0"><b>{point.y} 人</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          style: {
            // fontSize: '16px',
          },
        },
      },
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: '男性',
        type: 'column',
        data: [ChartsData.household_ordinary_m, ChartsData.household_single_m],
        color: '#7d5fb2',
      },
      {
        name: '女性',
        type: 'column',
        data: [ChartsData.household_ordinary_f, ChartsData.household_single_m],
        color: '#c29fff',
      },
    ],
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

export default ColumnCharts;
