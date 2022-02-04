import React, { useState, useEffect } from 'react';
import Forecast from './Forecast/Forecast';
import Today from './Today/Today';
import './App.css';

function App() {
  const apiKey = 'IeeGLFBHWnNmFPygAVw7u0RR1Z6HX2ou';
  const [locationKey, setLocationKey] = useState('152909_PC');

  const [search, setSearch] = useState('')
  const [weatherData, setWeatherData] = useState([])
  const [city, setCity] = useState('Atlanta');
  const [lat, setLat] = useState('')  //34.2911249
  const [long, setLong] = useState('') //108.9422168

  //  useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       setLong(position.coords.longitude);
  //       setLat(position.coords.latitude);
  //       console.log('i shoud be on load')
  //     });
  //   }
  // }, [])


  // useEffect(() => {
  //   fetch(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=jAFhaphXz5OapXiGn1egDhGh46NPGvN6&q=${lat}%2C${long}`
  //   )
  //   .then(res => res.json())
  //   .then(res => {
  //     setLocationKey(res.Key)
  //   })
  // }, [lat])
  
  useEffect(() => {
    console.log(locationKey)
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
    fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/locationKey=${locationKey}?apikey=${apiKey}`
    )
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
  }, [])
    
  // useEffect(() => {
  //   console.log(weatherData)
  // }, [weatherData])

  const handleSubmit = () => {

  }
  const handleChange = () => {

  }
  
// const today = weatherData[0];
  return (
    <div className="app-background">
      <div className="dashboard city-picture">
        
           
        <Today />

        <LocationSearch />
            
        <form onSubmit={handleSubmit}>
          <input
          type="text"
          onChange={handleChange}
          // required 
          />

          <button type="submit" > My location </button>
          <p id="demo"> P </p>
        </form>

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
