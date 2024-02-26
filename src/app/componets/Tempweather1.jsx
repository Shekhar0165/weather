import React from 'react'

export default function Tempweather1() {
  return (
    <div>
      <form className="search-form" >
          <input
            className="city-input"
            type="text"
            // value={city}
            // onChange={(e) => setCity(e.target.value)}
            placeholder="Enter City Name"
          />
          <button className="search-btn" type="submit">
            <i className="material-icons">search</i>
          </button>
        </form>
    </div>
  )
}
