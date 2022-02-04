import './Today.css';

const Today = ({ min, max, type, city, date}) => {
  return (
    <div className="today-container">

      <section className="upper-panel">
        <div className="weather-icon">
          Icon
          {type}
        </div>
        <div className="city">
        {city}
      </div>
      </section>
      
      <section className="middle-panel">
        <div className="temperatute">
          min {min} / max {max} 
        </div>

        <div className="date">
          {date}
        </div>
           
      </section>
    </div>
    
  );
}

export default Today;