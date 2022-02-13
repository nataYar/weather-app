import { useState, useEffect } from 'react';
import { apiKey } from '../constants';
import './LocationSearch.css';

const LocationSearch = ({ onFound }) => {
    const [search, setSearch] = useState('')
    const [cityArray, setCityArray] = useState([])

    const triggerCitySearch = (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            getLocation(search);
            setSearch('');
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
                })
                )
                
            } else {
                setCityArray([])
                //pop up message that city was not found
                const notFound = document.createElement("div");
                const textnode = document.createTextNode("not found");
                notFound.appendChild(textnode);
                notFound.classList.add("not-found");
                document.querySelector('.search-container').appendChild(notFound);
                // message is deleted in a 2 sec
                setTimeout(function () {
                    document.querySelector('.search-container').removeChild(notFound);
                }, 2000)
            }
          }).catch(function(error) { 
            console.log('Request failed', error); 
          });
    }

    const handleSelect = (city) => {
        onFound(city);
        setCityArray([])
    }

    //sort alphabetically  by country  first, then  by region
    const sortCities = ( a , b ) => {
        if (a.country > b.country) return 1;
        if (a.country < b.country) return -1;
    
        if (a.region > b.region) return 1;
        if (a.region < b.region) return -1;
  }
    return (
        <div className="search-container">
            <input 
            placeholder="Search the city"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyUp={(e) => triggerCitySearch(e)}
            />
            {/* <button type="submit" 
            onClick={() => getLocation(search)} 
            > BTN </button> */}
          

            {/*  class is applied depending on an array of cities. initial state - zero cities */}
            <div id="dropdown-scrollbar" className={cityArray.length === 0 ? "hidden" : "dropdown-scrollbar"} >
                <div className="selection">
                {
                cityArray.sort(sortCities).map((city, ind) => (
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

