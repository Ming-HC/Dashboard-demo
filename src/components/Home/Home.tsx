import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import ColumnCharts from '../highcharts/ColumnCharts/ColumnCharts';
import PieCharts from '../highcharts/PieCharts/PieCharts';
import styles from './Home.module.css';

function Home(props: RouteComponentProps<
{ year: string, county: string, district: string }>): JSX.Element {
  const { match } = props;
  const [data, setData] = useState([{
    responseData: [{
      statistic_yyy: '106', site_id: '新北市', household_ordinary_m: '0', household_ordinary_f: '0', household_single_m: '0', household_single_f: '0', household_ordinary_total: '0', household_single_total: '0',
    }],
    responseMessage: 'default',
  }]);
  let yearsList: number[] = [];
  const [SelectValue, setSelectValue] = useState({ year: '106', county: '', district: '' });
  const [SubmitSelect, setSubmitSelect] = useState({ year: '', county: '', district: '' });
  const [countiesList, setCountiesList] = useState(['新北市', '臺北市', '桃園市', '臺中市']);
  const [districtsList, setDistrictsList] = useState(['萬里區']);
  const yearsSelect = document.querySelector('#years') as HTMLSelectElement | null;
  const countiesSelect = document.querySelector('#counties') as HTMLSelectElement | null;
  const districtsSelect = document.querySelector('#districts') as HTMLSelectElement | null;
  const submitbtn = document.querySelector('.submit') as HTMLSelectElement | null;
  const yearsSelectLabel = document.querySelector('label[for="years"]') as HTMLLabelElement | null;
  const countiesSelectLabel = document.querySelector('label[for="counties"]') as HTMLLabelElement | null;
  const districtsSelectLabel = document.querySelector('label[for="districts"]') as HTMLLabelElement | null;

  const getCountiesList = (e: { year: string, county: string, district: string }) => {
    if (e) {
      data.forEach((value, index) => {
        if (value.responseData[0].statistic_yyy === e.year) {
          const newCountiesList = [];
          for (let u = 0; u < data[index].responseData.length; u += 1) {
            newCountiesList.push(data[index].responseData[u].site_id.slice(0, 3));
          }
          const set = new Set(newCountiesList);
          const uniqueArr = Array.from(set);
          setCountiesList(uniqueArr);
        }
      });
    }
  };
  const selectCounty = () => {
    if (districtsSelect && countiesSelect) {
      districtsSelect.disabled = false;
      countiesSelect.style.color = 'black';
      const cancelselect = document.querySelector('#counties+button') as HTMLSelectElement | null;
      if (districtsSelectLabel && cancelselect) {
        const distspan = districtsSelectLabel.querySelector('span') as HTMLSpanElement | null;
        if (distspan) {
          distspan.style.color = 'black';
        }
        cancelselect.style.display = 'block';
      }
    }
    if (yearsSelect && countiesSelect) {
      const newSelectValue = { ...SelectValue };
      newSelectValue.county = countiesSelect.value;
      setSelectValue(newSelectValue);
      data.forEach((value, index) => {
        if (value.responseData[0].statistic_yyy === newSelectValue.year) {
          const newSitesList = [];
          for (let u = 0; u < data[index].responseData.length; u += 1) {
            if (countiesSelect.value === data[index].responseData[u].site_id.slice(0, 3)) {
              newSitesList.push(data[index].responseData[u].site_id.slice(3, 6));
            }
          }
          const set = new Set(newSitesList);
          const uniqueArr = Array.from(set);
          setDistrictsList(uniqueArr);
        }
      });
    } else {
      const newSelectValue = { ...SelectValue };
      newSelectValue.county = match.params.county;
      setSelectValue(newSelectValue);
      data.forEach((value, index) => {
        if (value.responseData[0].statistic_yyy === newSelectValue.year) {
          const newSitesList = [];
          for (let u = 0; u < data[index].responseData.length; u += 1) {
            if (match.params.county === data[index].responseData[u].site_id.slice(0, 3)) {
              newSitesList.push(data[index].responseData[u].site_id.slice(3, 6));
            }
          }
          const set = new Set(newSitesList);
          const uniqueArr = Array.from(set);
          setDistrictsList(uniqueArr);
        }
      });
    }
  };

  useEffect(() => {
    const fetchData = async (year: number) => {
      const res = await axios.get(`https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP019/${year}`);
      if (res.data.responseMessage === '處理完成') {
        if (res.data.responseData[0].statistic_yyy) {
          setData((prevData) => [...prevData, res.data]);
        } else {
          res.data.responseData[0].statistic_yyy = res.data.responseData[0]['﻿statistic_yyy'];
          setData((prevData) => [...prevData, res.data]);
        }
      }
    };
    for (let year = 100; year <= 112; year += 1) {
      fetchData(year);
    }
    data.shift();
    districtsList.shift();
    if (match.params.district) {
      const newSelectValue = { ...SelectValue };
      const newSubmitSelect = { ...SubmitSelect };
      newSelectValue.year = match.params.year;
      newSelectValue.county = match.params.county;
      newSelectValue.district = match.params.district;
      newSubmitSelect.year = match.params.year;
      newSubmitSelect.county = match.params.county;
      newSubmitSelect.district = match.params.district;
      setSelectValue(newSelectValue);
      setSubmitSelect(newSubmitSelect);
      getCountiesList(newSelectValue);
      selectCounty();
    }
  }, []);

  if (data.length === 6) {
    yearsList = data.map((value) => parseInt(value.responseData[0].statistic_yyy, 10));
    yearsList.sort();
  }

  const yearsSelectChange = () => {
    if (yearsSelect) {
      const newSelectValue = { ...SelectValue };
      newSelectValue.year = yearsSelect.value;
      setSelectValue(newSelectValue);
      getCountiesList(newSelectValue);
    }
  };

  const FocusYearSelect = () => {
    if (yearsSelectLabel) {
      yearsSelectLabel.style.borderColor = '#651FFF';
      yearsSelectLabel.style.color = '#651FFF';
    }
  };
  const FocusoutYearSelect = () => {
    if (yearsSelectLabel && yearsSelect) {
      if (yearsSelect.value === '') {
        yearsSelectLabel.style.borderColor = '#B6B6B6';
      } else {
        yearsSelectLabel.style.borderColor = 'black';
      }
      yearsSelectLabel.style.color = 'black';
    }
  };
  const FocusCountySelect = () => {
    if (yearsSelectLabel && countiesSelectLabel && districtsSelectLabel) {
      countiesSelectLabel.style.borderColor = '#651FFF';
      countiesSelectLabel.style.color = '#651FFF';
    }
  };
  const FocusoutCountySelect = () => {
    if (countiesSelectLabel && countiesSelect) {
      if (countiesSelect.value === '') {
        countiesSelectLabel.style.borderColor = '#B6B6B6';
      } else {
        countiesSelectLabel.style.borderColor = 'black';
      }
      countiesSelectLabel.style.color = 'black';
    }
  };
  const FocusDistrictSelect = () => {
    if (districtsSelectLabel) {
      districtsSelectLabel.style.borderColor = '#651FFF';
      const distspan = districtsSelectLabel.querySelector('span') as HTMLSpanElement | null;
      if (distspan) {
        distspan.style.color = '#651FFF';
      }
    }
  };
  const FocusoutDistrictSelect = () => {
    if (districtsSelectLabel && districtsSelect) {
      if (districtsSelect.value === '') {
        districtsSelectLabel.style.borderColor = '#B6B6B6';
        const distspan = districtsSelectLabel.querySelector('span') as HTMLSpanElement | null;
        if (distspan) {
          distspan.style.color = '#B6B6B6';
        }
      } else {
        districtsSelectLabel.style.borderColor = 'black';
        const distspan = districtsSelectLabel.querySelector('span') as HTMLSpanElement | null;
        if (distspan) {
          distspan.style.color = 'black';
        }
      }
    }
  };
  const selectDistrict = () => {
    const cancelselect = document.querySelector('#districts+button') as HTMLSelectElement | null;
    if (submitbtn && districtsSelect && cancelselect) {
      const newSelectValue = { ...SelectValue };
      newSelectValue.district = districtsSelect.value;
      setSelectValue(newSelectValue);
      submitbtn.style.backgroundColor = '#651FFF';
      submitbtn.style.color = '#FFFFFF';
      districtsSelect.style.color = 'black';
      cancelselect.style.display = 'block';
    }
  };
  const cancelSelectCounty = () => {
    const cancelSelectCountybtn = document.querySelector('#counties+button') as HTMLButtonElement || null;
    const cancelSelectDistrictbtn = document.querySelector('#districts+button') as HTMLButtonElement || null;
    if (countiesSelect && districtsSelect && countiesSelectLabel && districtsSelectLabel
      && districtsSelect && submitbtn && cancelSelectCountybtn && cancelSelectDistrictbtn) {
      districtsSelect.disabled = true;
      countiesSelect.value = '';
      districtsSelect.value = '';
      countiesSelect.style.color = '#B6B6B6';
      countiesSelectLabel.style.borderColor = '#B6B6B6';
      districtsSelectLabel.style.borderColor = '#B6B6B6';
      districtsSelect.style.color = '#B6B6B6';
      submitbtn.style.backgroundColor = 'hsl(0, 0%, 0%, 0.12)';
      submitbtn.style.color = 'hsl(0, 0%, 0%, 0.26)';
      const distspan = districtsSelectLabel.querySelector('span') as HTMLSpanElement | null;
      if (distspan) {
        distspan.style.color = '#B6B6B6';
      }
      cancelSelectCountybtn.style.display = 'none';
      cancelSelectDistrictbtn.style.display = 'none';
    }
  };
  const cancelSelectDistrict = () => {
    const cancelSelectDistrictbtn = document.querySelector('#districts+button') as HTMLButtonElement || null;
    if (districtsSelect && districtsSelectLabel && submitbtn && cancelSelectDistrictbtn) {
      districtsSelect.value = '';
      districtsSelectLabel.style.borderColor = '#B6B6B6';
      districtsSelect.style.color = '#B6B6B6';
      submitbtn.style.backgroundColor = 'hsl(0, 0%, 0%, 0.12)';
      submitbtn.style.color = 'hsl(0, 0%, 0%, 0.26)';
      cancelSelectDistrictbtn.style.display = 'none';
    }
  };
  const submit = () => {
    if (yearsSelect && countiesSelect && districtsSelect) {
      if (yearsSelect.value !== '' && countiesSelect.value !== '' && districtsSelect.value !== '') {
        const newSubmitSelect = { ...SelectValue };
        setSubmitSelect(newSubmitSelect);
        // BrowserRouter
        /* window.location.href =
        `/Dashboard-demo/${yearsSelect.value}/${countiesSelect.value}/${districtsSelect.value}`; */
        // HashRouter
        window.open(`#/Dashboard-demo/${yearsSelect.value}/${countiesSelect.value}/${districtsSelect.value}`);
      }
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.sidebarleft}>
        <span>TAIWAN</span>
      </div>
      <div className={styles.content}>
        <div className={styles.content1}>
          <h1>人口數、戶數按戶別及性別統計</h1>
          <div className={styles.form_group}>
            <label htmlFor="years" className={styles.years}>
              <span>年份</span>
              <select id="years" aria-label="years" value={SelectValue.year} onFocus={FocusYearSelect} onBlur={FocusoutYearSelect} onChange={yearsSelectChange}>
                {yearsList.map((year) => (
                  <option value={year} key={year}>{year}</option>))}
              </select>
            </label>
            <label htmlFor="counties" className={styles.counties}>
              <span>縣/市</span>
              <select id="counties" aria-label="counties" onFocus={FocusCountySelect} onBlur={FocusoutCountySelect} onChange={selectCounty}>
                <option hidden value="">請選擇 縣/市</option>
                {countiesList.map((county) => (
                  <option value={county} key={county}>{county}</option>))}
              </select>
              <button type="button" className={styles.cancelselect} onClick={cancelSelectCounty}> </button>
            </label>
            <label htmlFor="districts" className={styles.districts}>
              <span>區</span>
              <select id="districts" aria-label="districts" disabled={!match.params.district} onFocus={FocusDistrictSelect} onBlur={FocusoutDistrictSelect} onChange={selectDistrict} value={SelectValue.district}>
                <option hidden value="">請先選擇 縣/市</option>
                {districtsList.map((district) => (
                  <option value={district} key={district}>{district}</option>))}
              </select>
              <button type="button" className={styles.cancelselect} onClick={cancelSelectDistrict}> </button>
            </label>
            <button type="button" className="submit" onClick={submit}>SUBMIT</button>
          </div>
          {match.params.district
            ? (
              <section>
                <div className={styles.search_res_hr}>
                  <div className={styles.search_res_hr_div}>
                    <span className={styles.search_res_hr_div_txt}>搜尋結果</span>
                  </div>
                </div>
                <h1>{`${match.params.year}年 ${match.params.county} ${match.params.district}`}</h1>
                <ColumnCharts data={data} rules={SubmitSelect} />
                <PieCharts data={data} rules={SubmitSelect} />
              </section>
            ) : null}
        </div>
      </div>
    </div>
  );
}

export default Home;
