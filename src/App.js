import React, { useState, useEffect } from 'react';
import './App.css';

import Forecast from './Forecast/Forecast';
import LocationSearch from './LocationSearch/LocationSearch';
import { apiKey, shutterstockToken } from './constants';

const sstk = require("shutterstock-api");

function App() {
  const [weatherData, setWeatherData] = useState([])
  const [locationKey, setLocationKey] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [lat, setLat] = useState('')  //34.2911249
  const [long, setLong] = useState('') //108.9422168
  const [tempType, setTempType] = useState('F')
  // 34.2911249,108.9422168
  const [cityURL, setCityURL] = useState('')

  sstk.setAccessToken(shutterstockToken);
  const imagesApi = new sstk.ImagesApi();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLong(position.coords.longitude);
        setLat(position.coords.latitude);
      });
    }
  }, []) //[] as doesn't need to re-run. on load
  
  useEffect(() => {
    if (lat && long) {
      fetch(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${lat}%2C${long}`
      )
      .then(res => res.json())
      .then(res => {
        setLocationKey(res.Key)
        setCity(res.ParentCity.EnglishName)
        setRegion(res.AdministrativeArea.EnglishName)
        setCountry(res.Country.EnglishName)
      })
    }
  }, [lat, long])
  
  useEffect(() => {
    if (locationKey) {
      const queryParams = {
        query: `${city}` + ' AND ' + `${region}` + ' AND ' + `${country}`,
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
      };
      const queryParamsForCountry = {
        query: `${country}` + 'landmark',
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
    }
  }, [locationKey])

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
    if (locationKey) {
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
      }
  }, [locationKey])



  const handleCityChange = (city) => {
    setLocationKey(city.key)
    setCity(city.name)
    setRegion(city.region)
    setCountry(city.country)
  }

  const formatDate = (date) => {
    const a = new Date(date)
    const strDate = a.toString() 
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
