import { useState, useEffect } from 'react';
import { apiKey } from '../constants';
import './LocationSearch.css';

const LocationSearch = ({ onFound }) => {
    const [search, setSearch] = useState('')
    const [cityArray, setCityArray] = useState([])

    const  triggerCitySearch = (event) => {
        if (event.keyCode === 13) {
        event.preventDefault();
        getLocation(search)
        }
        return
    }

    const getLocation = (search) => {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${search}`
        fetch(url)
        .then(response => response.json() )
        .then(function(data) {  
            if(data.length > 0){
                setCityArray(data.map(city => {
                    return { 
                        name: city.EnglishName,
                        key: city.Key,
                        region: city.AdministrativeArea.EnglishName,
                        country: city.Country.EnglishName
                    } 
                }))
                
            } else {
                setCityArray([])
                //pop up message that city was not found
                const notFound = document.createElement("div");
                const textnode = document.createTextNode("not found");
                notFound.appendChild(textnode);
                notFound.classList.add("not-found");
                document.querySelector('.input-section').appendChild(notFound);
                //message is deleted in a 1.5 sec
                setTimeout(function () {
                    document.querySelector('.input-section').removeChild(notFound);
                }, 1500)
            }
          }).catch(function(error) { 
            console.log('Request failed', error); 
          });
    }

    const handleSelect = (city) => {
        onFound(city);
        setCityArray([])
    }
    return (
        <div className="search-container">
            <div className="input-section">
                <input id="search-area"
                placeholder="Type the city and hit Enter"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyUp={(e) => triggerCitySearch(e)}
                />
                {/* <button type="submit" 
                onClick={() => getLocation(search)} 
                > BTN </button> */}
            </div>

            {/*  class is applied depending on an array of cities. initial state - zero cities */}
            <div id="dropdown-scrollbar" className={cityArray.length === 0 ? "hidden" : "dropdown-scrollbar"}>
                <div className="selection">
                {
                cityArray.map((city, ind) => (
                    <div key={ind} className="city-dropdown" onClick={() => handleSelect(city) } >
                        <div> {city.country}, {city.region}, {city.name} </div>
                    </div>
                ))
                }
                </div>
            </div>
        </div>
    )
    
}

export default LocationSearch;

