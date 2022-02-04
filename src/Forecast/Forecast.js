import './Forecast.css';

const Forecast = ({ min, max, type, icon}) => {
  return (
    <div className="day-container">
        <div className="weather-type">
          <img src={`https://developer.accuweather.com/sites/default/files/${icon}-s.png`}/>
            Type: {type}

        </div>
        <div className="temperature">
            Temp in F/C: {min} | {max}
        </div>
        
    </div>
  );
}

export default Forecast;