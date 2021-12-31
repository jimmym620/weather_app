import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
    const [apiData, setApiData] = useState({});
    const [getLocation, setGetLocation] = useState("london");
    const [location, setLocation] = useState("london");

    const [lat, setLat] = useState([55.8438935]);
    const [long, setLong] = useState([-4.3922204]);
    const days = [0, 1, 2, 3, 4, 5, 6];

    const apiKey = process.env.REACT_APP_API_KEY;
    // const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${apiKey}`;
    useEffect(() => {
        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => setApiData(data));
    }, [apiUrl]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLat(position.coords.latitude);
            setLong(position.coords.longitude);
        });
    }, [lat, long]);

    const handleInput = (e) => {
        e.preventDefault();
        setGetLocation(e.target.value);
    };

    const handleSubmit = () => {
        setLocation(getLocation);
        console.log(lat);
        console.log(long);
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
