import './Forecast.css';

const Forecast = ({ min, max, type, icon, date}) => {
  
  return (
    <div className="day-container">
        <div className="weather-type">
          <img alt="weather icon" src={`https://developer.accuweather.com/sites/default/files/${icon}-s.png`}/>
            Type: {type}

        </div>
        <div className="temperature">
          {max} Max | {min} Min
        </div>
        {date}
    </div>
  );
}

export default Forecast;