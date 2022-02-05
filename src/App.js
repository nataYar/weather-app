import React, { useState, useEffect, useLayoutEffect } from 'react';
import Forecast from './Forecast/Forecast';
import Today from './Today/Today';
import LocationSearch from './LocationSearch/LocationSearch';
import { apiKey } from './constants'
import './App.css';

function App() {
  const [locationKey, setLocationKey] = useState('337241');

  const [weatherData, setWeatherData] = useState([])
  const [currCity, setCurrCity] = useState('');
  const [lat, setLat] = useState('')  //34.2911249
  const [long, setLong] = useState('') //108.9422168
  // 34.2911249,108.9422168
  
   useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLong(position.coords.longitude);
        setLat(position.coords.latitude);
      });
    }
  }, [])
  //[] as doesn't need to re-run.
 
 
  useEffect(() => {
    fetch(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${lat}%2C${long}`
    )
    .then(res => res.json())
    .then(res => {
      // console.log(res)
      setLocationKey(res.Key)
      setCurrCity(res.ParentCity.EnglishName)
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
      setWeatherData(res.DailyForecasts
        .map(el => {
          return {
            date: el.Date,
            min: el.Temperature.Minimum.Value,
            max: el.Temperature.Maximum.Value,
            unitMin: el.Temperature.Minimum.Unit,
            icon: weatherIconNum(el.Day.Icon),
            type: el.Day.IconPhrase,
          }
        })
      )
    })
  }, [locationKey])

  useEffect(() => {
    console.log(weatherData)
  }, [weatherData])

  useEffect(() => {
    console.log(currCity)
  }, [currCity])

  const handleCityChange = (city) => {
    setLocationKey(city.key)
    setCurrCity(city.name)
    console.log(city)
  }

  const tempConverter = (num) => {
    return (num-32) / 1.8
  }
 
  return (
    <div className="app-background">
      <div className="dashboard city-picture">
        <div className="upper-panel">
          <LocationSearch 

          //changing currCity state from a child
          onFound={search => handleCityChange(search) }
          />
          <div id="curr-city">
            {currCity}<br/>
            F / C
          </div>
        </div>

        {
          weatherData.length > 0 && weatherData.map((day, ind) => (
            <div key={ind}>
              <Forecast 
                min = {day.min} 
                max = {day.max} 
                date = {day.date} 
                unit = {day.unitMin}  
                icon = {day.icon}
                type= {day.type} />
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
