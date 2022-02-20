import './Forecast.css';
import { useEffect, useRef } from 'react';
import { gsap } from "gsap";


const Forecast = ({ min, max, icon, date, tempType}) => {
  const convertToC = (num) => {
    return Math.round((num-32) / 1.8)
  }
  const minC = convertToC(min);
  const maxC = convertToC(max);

  // store a reference to the box div
  const tempRef = useRef(null);
  const minTempRef = useRef(null);
  const maxTempRef = useRef(null);
  const sepRef = useRef(null);

  // gsap.to('.minTemp', {color:'purple', duration: 1}, '+=1' )
  // wait until DOM has been rendered
  useEffect(() => {
    let tl = gsap.timeline()
    tl
    .fromTo(minTempRef.current, {opacity: "0", y: "50%" , duration: 1}, {opacity: "1", y: "0%" , duration: 1, ease: "back.out(1.7)"})
    .fromTo(sepRef.current, {opacity: "0", duration: 1}, {opacity: "1", duration: 2, ease: "back.out(1.7)"}, "-=1")
    .fromTo(maxTempRef.current, {opacity: "0", y: "-50%" , duration: 1}, {opacity: "1", y: "0%" , duration: 1, ease: "back.out(1.7)"}, "-=2")

  }, [tempType]);




  return (
    <div className="day-container">
      {date}
      {/* <div className="temperature-container" > */}
        {
          <div className="temperature" ref={tempRef}> 
            <div className="minTemp" ref={minTempRef}>{tempType == 'C' ? minC : min} min </div> 
              <div className="sep" ref={sepRef}>|</div> 
            <div className="maxTemp" ref={maxTempRef}> {tempType == 'C' ? maxC : max} max </div> 
          </div>  
        }
      {/* </div> */}
      <div className="weather-type">
        <img alt="weather icon" src={`https://developer.accuweather.com/sites/default/files/${icon}-s.png`}/>
      </div>
    </div>
  );
}

export default Forecast;