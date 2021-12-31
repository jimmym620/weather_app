import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
    const [apiData, setApiData] = useState({});
    const [getLocation, setGetLocation] = useState("london");
    const [location, setLocation] = useState("london");

    const [lat, setLat] = useState([51.50853]);
    const [long, setLong] = useState([-0.12574]);
    const days = [0, 1, 2, 3, 4, 5, 6];

    //geocode
    const [geoApiData, setGeoApiData] = useState({});

    const apiKey = process.env.REACT_APP_API_KEY;
    // const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${apiKey}`;
    const apiUrlGeocode = `http://api.openweathermap.org/geo/1.0/direct?q=${getLocation}&limit=1&appid=${apiKey}`;
    useEffect(() => {
        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => setApiData(data));
    }, [apiUrl]);

    useEffect(() => {
        fetch(apiUrlGeocode)
            .then((res) => res.json())
            .then((data) => setGeoApiData(data));
    }, [apiUrlGeocode]);

    // useEffect(() => {
    //     navigator.geolocation.getCurrentPosition((position) => {
    //         setLat(position.coords.latitude);
    //         setLong(position.coords.longitude);
    //     });

    // }, [location]);

    const handleInput = (e) => {
        e.preventDefault();
        setGetLocation(e.target.value);
    };

    const handleSubmit = () => {
        setLocation(getLocation);
        getLongLat();
    };

    const getLongLat = () => {
        setLat(geoApiData[0].lat);
        setLong(geoApiData[0].lon);
    };

    const kelvinToCelcius = (k) => {
        return (k - 273.15).toFixed(1);
    };

    const UnixToDay = (value) => {
        const date = new Date(value * 1000);
        const dayOfTheWeek = date.toLocaleDateString("en-US", {
            weekday: "long",
        });
        return dayOfTheWeek;
    };

    return (
        <div className="App">
            <header>
                <h1>Simple Weather App</h1>
            </header>
            <main>
                <div className="links"></div>
                <div className="form">
                    <label htmlFor="location-name">Enter Location</label>
                    <input
                        type="text"
                        id="location-name"
                        onChange={handleInput}
                        value={getLocation}
                    />
                    <button onClick={handleSubmit}>Search</button>
                </div>
                <div className="current-weather-view">
                    {apiData.current ? (
                        <div className="main-info">
                            <h1>Current Weather</h1>
                            <h3 className="location">{location}</h3>
                            <h4>{apiData.current.weather[0].main}</h4>
                            <img
                                src={`http://openweathermap.org/img/wn/${apiData.current.weather[0].icon}.png`}
                                alt="weather status icon"
                                className="weather-icon"
                            />
                            <div className="info-container">
                                <div className="m1">
                                    <p>
                                        {`Temp: ${kelvinToCelcius(
                                            apiData.current.temp
                                        )} °C`}
                                    </p>
                                    <p>
                                        {`Feels like: ${kelvinToCelcius(
                                            apiData.current.feels_like
                                        )} °C`}
                                    </p>
                                </div>
                                {/* <div className="m2">
                                    <p>
                                        {`Min: ${kelvinToCelcius(
                                            apiData.current.temp_min
                                        )} °C`}
                                    </p>
                                    <p>
                                        {`Max: ${kelvinToCelcius(
                                            apiData.current.temp_max
                                        )} °C`}
                                    </p>
                                </div> */}
                                <div className="m3">
                                    <p>{`Pressure: ${apiData.current.pressure} hPa`}</p>
                                    <p>{`Humidity: ${apiData.current.humidity}%`}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>Loading</p>
                    )}
                </div>
                <div className="weekly-weather-view">
                    <h2>Next week</h2>
                    {apiData.current ? (
                        <div className="week-container">
                            {days.map((day, index) => {
                                return (
                                    <article key={index}>
                                        <h5>
                                            {UnixToDay(apiData.daily[day].dt)}
                                        </h5>
                                        <img
                                            src={`http://openweathermap.org/img/wn/${apiData.daily[day].weather[0].icon}.png`}
                                            alt="weather status icon"
                                            className="weather-icon"
                                        />
                                        <p>
                                            {apiData.daily[day].weather[0].main}{" "}
                                        </p>
                                        <p>{`Temp: ${kelvinToCelcius(
                                            apiData.daily[0].temp.day
                                        )} °C`}</p>
                                        <p>{`Humidity: ${apiData.daily[day].humidity} %`}</p>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <p>loading</p>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
