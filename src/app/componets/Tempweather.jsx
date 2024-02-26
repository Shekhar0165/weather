"use client";
import React, { useEffect, useState } from "react";
import 'weather-icons/css/weather-icons.min.css';


export default function TempWeather() {
  const [apiData, setApiData] = useState(null);
  const [city, setCity] = useState("Delhi");
  const [newCity, setNewCity] = useState("Delhi");
  const [api, setApi] = useState(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=26f018bbe82aebe1c957ccee303dd538`
  );

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch(api);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newData = await response.json();
      setApiData(newData);
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Set some state or show an error message to the user
    }
  };

  // Call the fetch function when the component mounts or city changes
  useEffect(() => {
    fetchData();
  }, [api]);
  const handleSearch = () => {
    setNewCity(city.charAt(0).toUpperCase() + city.slice(1));
    setApi(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=26f018bbe82aebe1c957ccee303dd538`
    );
  };

  // Format sunrise and sunset timings
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date with abbreviated month name
  const formatDate = () => {
    const date = new Date();
    const monthAbbreviation = date.toLocaleString("default", {
      month: "short",
    });
    return `${date.getDate()} ${monthAbbreviation} ${date.getFullYear()}`;
  };
  // console.log(apiData);
  const groupDataByDay = (data) => {
    const groupedData = {};
    data.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
  
      if (!groupedData[day]) {
        groupedData[day] = [];
      }
  
      groupedData[day].push(item);
    });
  
    return groupedData;
  };

  const calculateAverageTemperature = (items) => {
    const totalTemperature = items.reduce((acc, item) => acc + (item.main.temp - 273.15), 0);
    return totalTemperature / items.length;
  };

  const groupedData = groupDataByDay(apiData?.list || []);
  const todayData = apiData?.list?.[0];
  return (
    <div>
      <div className="weather-app  bg-opacity-100">
        <form
          className="search-form w-1/2 mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className="city-input"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter City Name"
          />
          <button className="search-btn" onClick={handleSearch} type="submit">
            <i className="material-icons">search</i>
          </button>
        </form>
        <div className="city-date-section">
          <div className="flex justify-evenly">
            <div className="my-6">
              <div className="flex-col">
                <h2 className="city">
                  {newCity},
                  <span className="text-5xl mx-2">
                    {apiData?.city?.country}
                  </span>
                </h2>
                {/* <div className="country mx-12">{apiData?.sys?.country}</div> */}
              </div>
              <p className="date flex justify-evenly font-semibold">{formatDate()}</p>
            </div>

            <div className="temperature-info"></div>
            <div className="temp my-10 text-7xl flex">
              <div className="weather_icon ">
              {todayData?.weather?.[0]?.icon ? (
        <img
          className="w-16"
          src={`http://openweathermap.org/img/w/${todayData.weather[0].icon}.png`}
          alt="Weather Icon"
        />
      ) : (
        "Weather"
      )}
              </div>
              {(todayData?.main?.temp - 273.15).toFixed(1)}°C
            </div>
          </div>
        </div>
        <div className="flex justify-end mx-36 relative -top-12 font-semibold">
          <div>
          Feels Like: {todayData?.main?.feels_like ? `${(todayData.main.feels_like - 273.15).toFixed(1)}°C` : "N/A"}
            <br />
            <h3 className="wind-speed">
            Wind Speed: {(todayData?.wind?.speed * 3.6).toFixed(2) || "N/A"}
              KM/H
            </h3>
            <div className="flex">
            Humidity: <div>{todayData?.main?.humidity || "N/A"}%</div>
            </div>
            <div className="flex">
              Visibility:
              <div className="visibility-distance">
              {todayData?.visibility || "N/A"} M
              </div>
            </div>
          </div>
        </div>
        <div className="mx-10 flex justify-between">
            <div className="flex mx-2">
              <img className="mx-2 w-10 h-10" src="sunrise.png" alt="" />
            <p className="sun text-white">
              Sunrise: {formatTime(apiData?.city?.sunrise)}
            </p>
            </div>
            <div className="flex mx-2">
              <img className="w-10 mx-2" src="sunset.png" alt="" />
            <p className="sun text-white">
              Sunset: {formatTime(apiData?.city?.sunset)}
            </p>
            </div>
          </div>
        <div className="flex justify-between mx-6">
          <div className="bg-gray-100 h-52 m-2 rounded-xl box-img">
            <ul className="flex ">
              {apiData?.list?.slice(0, 5).map((item, index) => (
                <li
                  key={index}
                  className="mx-2 my-10 font-semibold text-white"
                >
                  {(item.main.temp - 273.15).toFixed(1)}°C <br />
                  <img
                    src={`http://openweathermap.org/img/w/${item.weather[0].icon}.png`}
                    alt="Weather Icon"
                  />
                  <br />
                  {formatTime(item.dt)}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-100 h-52 m-2 rounded-xl box-img ">
            <ul className="flex ">
            {Object.entries(groupedData).map(([day, items]) => (
        <li key={day} className="mx-4 my-12 font-semibold text-white">
          {calculateAverageTemperature(items).toFixed(1)}°C <br />
          {items[0].weather[0].icon ? (
            <img
              src={`http://openweathermap.org/img/w/${items[0].weather[0].icon}.png`}
              alt="Weather Icon"
            />
          ) : (
            "Weather"
          )}
          <br />
          {day}
        </li>
      ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
