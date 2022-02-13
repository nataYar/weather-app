import React, { useState, useEffect } from 'react';
import './App.css';

import Forecast from './Forecast/Forecast';
import Today from './Today/Today';
import LocationSearch from './LocationSearch/LocationSearch';
import { apiKey, shutterstockToken } from './constants';

const sstk = require("shutterstock-api");

function App() {
  const [weatherData, setWeatherData] = useState([])
  const [locationKey, setLocationKey] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const [lat, setLat] = useState('')  //34.2911249
  const [long, setLong] = useState('') //108.9422168
  const [tempType, setTempType] = useState('F')
  // 34.2911249,108.9422168
  const [cityURL, setCityURL] = useState('')

  sstk.setAccessToken(shutterstockToken);
  const imagesApi = new sstk.ImagesApi();

  useEffect(() => {
    const queryParams = {
      query: `${city}` + ' AND ' + `${country}`,
      limit: 5,
      max_items: 5,
      view: 'full',
      image_type: 'photo',
      page: 1,
      per_page: 5,
      sort: 'popular',
      language: "en",
      license: 'editorial',// Default: [commercial] Valid values: commercial, editorial, enhanced
      orientation: 'horizontal',
      // region: 'nl', //Format: A two-character (ISO 3166 Alpha-2) country code
      // Example: US
      // Format: A valid IPv4 address
      // Example: 1.1.1.1
      // keywords: `${city}`,
    };
    const queryParamsForCountry = {
      query: `${country}` + ' AND capital',
      // query: `${city}`,
      limit: 2,
      max_items: 2,
      view: 'full',
      image_type: 'photo',
      page: 1,
      per_page: 5,
      sort: 'popular',
      language: "en",
      license: 'editorial',
      orientation: 'horizontal',
    }
    imagesApi.searchImages(queryParams)
      .then(({ data }) => {
        JSON.stringify(data, null, 5);
        if (data.length>0){ 
          data[0].image_type === 'vector' ? 
          setCityURL(data[1].assets.huge_thumb.url) : setCityURL(data[0].assets.huge_thumb.url) 
        } else if (data.length === 0) { 
          console.log('no pictures')
          imagesApi.searchImages(queryParamsForCountry)
          .then(({data}) => {
            JSON.stringify(data, null, 5);
            setCityURL(data[0].assets.huge_thumb.url) 
          })
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [locationKey])
    
  

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLong(position.coords.longitude);
        setLat(position.coords.latitude);
      });
    }
  }, []) //[] as doesn't need to re-run.
  
  useEffect(() => {
    fetch(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${lat}%2C${long}`
    )
    .then(res => res.json())
    .then(res => {
      setLocationKey(res.Key)
      setCity(res.ParentCity.EnglishName)
      setCountry(res.Country.EnglishName)
    })
  }, [lat, long])
  
   //convert 1 digit icon number into 2 digit number: 1 => 01
   const weatherIconNum = (num) => {
     const strNum = num + '';
    if(strNum.length === 1) {
      return '0' + num.toString();
    } else {
      return num.toString()
    }  
  }
  
  // we use API to get 5 day forecast
  useEffect(() => {
    fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`)
    .then(res => res.json())
    .then(res => {
      // console.log(res)
      setWeatherData(res.DailyForecasts
        .map(el => {
          return {
            date: el.Date,
            min: el.Temperature.Minimum.Value,
            max: el.Temperature.Maximum.Value,
            icon: weatherIconNum(el.Day.Icon),
            type: el.Day.IconPhrase,
          }
        })
      )
    })
  }, [locationKey])



  const handleCityChange = (city) => {
    setLocationKey(city.key)
    setCity(city.name)
    setCountry(city.country)
  }

  const formatDate = (date) => {
    //get rid of the second part with time after "T"
    const b = date.split(/\D/);
    // Tue Feb 08 2022 15:00:00 GMT+0800 (China Standard Time)
    const c = new Date(Date.UTC(b[0], --b[1], b[2], b[3]||0, b[4]||0, b[5]||0, b[6]||0));
    const strDate = c.toString();
    return strDate.slice(0, 10)
  }
 
  return (
    <div className="app-background">
      <div className="dashboard">
        
        <div className="upper-panel"
        style={ {backgroundImage: 'url('+`${cityURL}` +')',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
          }}
          >
          <div className="upper-right-section">
            <div id="curr-city">
              {city}<br/>
            </div>
            <div className="temp-type-section">
              <div className={ tempType === "F" ? "temp-type temp-type-on" : " temp-type temp-type-off"}
              onClick={() => setTempType('F')} >F</div>/ 
              <div className={ tempType === "C" ? "temp-type temp-type-on" : " temp-type temp-type-off" }
              onClick={() => setTempType('C')} >C</div>
            </div>
          </div>
        </div>

        <div className="forecast-container">
          {
            weatherData.length > 0 && weatherData.map((day, ind) => (
              <div key={ind}>
                <Forecast 
                  min = {day.min} 
                  max = {day.max} 
                  date = {formatDate(day.date)} 
                  icon = {day.icon}
                  tempType = {tempType}
                />
              </div>
            ))
          }
          <LocationSearch 
            //changing city state from a child 
            onFound={search => handleCityChange(search) } />
        </div>
      </div>
    </div>
  );
}

export default App;
