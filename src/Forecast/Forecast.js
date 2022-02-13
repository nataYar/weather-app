import './Forecast.css';

const Forecast = ({ min, max, icon, date, tempType}) => {
  const convertToC = (num) => {
    return Math.round((num-32) / 1.8)
  }
  const minC = convertToC(min);
  const maxC = convertToC(max);

  return (
    <div className="day-container">
      {date}
      <div className="temperature">
        {
          tempType == 'C' ? 
          <div> {minC} min | {maxC} max </div> :  
          <div> {min} min | {max} max </div> 
          }
      </div>
      <div className="weather-type">
        <img alt="weather icon" src={`https://developer.accuweather.com/sites/default/files/${icon}-s.png`}/>
      </div>
    </div>
  );
}

export default Forecast;