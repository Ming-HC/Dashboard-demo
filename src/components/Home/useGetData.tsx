import { useState, useEffect } from 'react';
import axios from 'axios';

interface DataItem {
  statistic_yyy: string;
  district_code: string;
  site_id: string;
  village: string;
  household_ordinary_total: string;
  household_business_total: string;
  household_single_total: string;
  household_ordinary_m: string;
  household_business_m: string;
  household_single_m: string;
  household_ordinary_f: string;
  household_business_f: string;
  household_single_f: string;
}

function useGetData() {
  const [data, setData] = useState<DataItem[]>([]);
  useEffect(() => {
    const fetchData = async (year: number) => {
      const res = await axios.get(`https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP019/${year}`);
      if (res.data.responseMessage === '處理完成') {
        if (res.data.responseData[0].statistic_yyy) {
          setData((prevData) => [...prevData, res.data.responseData]);
        } else {
          res.data.responseData[0].statistic_yyy = res.data.responseData[0]['﻿statistic_yyy'];
          setData((prevData) => [...prevData, res.data.responseData]);
        }
      }
    };
    for (let year = 100; year <= 112; year += 1) {
      fetchData(year);
    }
  }, []);
  return data;
}

export default useGetData;
