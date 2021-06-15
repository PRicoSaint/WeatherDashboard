// Variables used for Queryselectors on the HTML file.
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#cityname");
var displayedCity = document.querySelector("#displayed-city");
var currentTemp = document.querySelector("#current-temp");
var currentWind = document.querySelector("#current-wind");
var currentHumidity = document.querySelector("#current-humidity");
var currentUV = document.querySelector("#current-UV");
var listOfCities = document.querySelector("#listofcities");
var fiveDayForecast = document.querySelector("#forecast");
var forecastTitle = document.querySelector("#forecast-title");
var currentCityCard = document.querySelector("#current-city-card");

// Set up variable to place cities that have been searched and global variables for coordinates.
var savedCities = [];
var cityLat = [];
var cityLon = [];

// Function that checks whether the city name exists. If it does, it will load it into the get weather function. This is from the seach bar only.
var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityname = nameInputEl.value.trim();
  console.log(cityname);

  if (cityname) {
    getCityWeather(cityname);
    currentCityCard.setAttribute("class", "col-sm vis");
    userFormEl.reset();
  } else {
    alert("Please enter an actual City");
  }
};

// Use this for the reuse of cities. When a button is clicked, the data-name is taking from the button that was clicked and run through the weather app.
// This does not produce an additional button.
var buttonClickHandler = function (event) {
  var nextCity = event.target.getAttribute("data-name");

  if (nextCity) {
    getSavedCityWeather(nextCity);
    currentCityCard.setAttribute("class", "col-sm vis");
  }
};

// This will be the initial call for city searched. City is saved to local storage and new button created, if it did not exist previously.
var getCityWeather = function (cityname) {
  fiveDayForecast.innerHTML = "";
  console.log(cityname);
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityname +
    "&units=imperial&appid=03b889d282ee365bc5916525efd12b28";
  var apiUrl2 =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityname +
    "&units=imperial&appid=03b889d282ee365bc5916525efd12b28";
  // ONE CALL   https://api.openweathermap.org/data/2.5/onecall?lat=32.77&lon=-96.79&appid=03b889d282ee365bc5916525efd12b28
  // CALL BY CITY NAME  https://api.openweathermap.org/data/2.5/weather?q=' + cityname +'&appid=03b889d282ee365bc5916525efd12b28
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          loadCoords(data);
          var sCity = data.name;
          console.log(savedCities.includes(sCity));
          if (savedCities.includes(sCity)) {
            // DO nothing
          } else {
            savedCities.push(sCity);
            localStorage.setItem("Cities", JSON.stringify(savedCities));
            var button = document.createElement("button");
            button.textContent = sCity;
            button.setAttribute("class", "btn btn-primary");
            button.setAttribute("data-name", sCity);

            listOfCities.appendChild(button);
          }
          displayCurrent(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
  fetch(apiUrl2)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayForecast(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};

// This function will be the one to display the current weather for City search or clicked.
//  Start with just displaying whats in the response.
var displayCurrent = function (data) {
  if (data.length === 0) {
    alert("No city found");
    return;
  }
  var cName = data.name;
  var cTemp = data.main.temp;
  var cWind = data.wind.speed;
  var cHumidity = data.main.humidity;
  var cIcon = data.weather[0].icon;
  var cIconURL = "http://openweathermap.org/img/w/" + cIcon + ".png";
  console.log(cName, cTemp, cWind, cHumidity, cIcon);

  displayedCity.textContent = cName;
  var iconLoc = document.createElement("img");
  iconLoc.setAttribute("src", cIconURL);
  displayedCity.appendChild(iconLoc);
  currentTemp.textContent = "Temp: " + cTemp;
  currentWind.textContent = "Wind: " + cWind + " mph";
  currentHumidity.textContent = "Humidity: " + cHumidity;
};
// This function obtains data from fetch forecast API call.
// It will load it into variables and display on it on screen, creating the necessary cards in the process.
var displayForecast = function (data) {
  if (data.length === 0) {
    alert("No city found");
    return;
  }
  for (var i = 0; i < 5; i++) {
    var currentDate = new Date();
    var day = currentDate.getDate() + 1 + i;
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var fTemp = data.list[i].main.temp;
    var fWind = data.list[i].wind.speed;
    var fHumidity = data.list[i].main.humidity;
    var fIcon = data.list[i].weather[0].icon;
    var fIconURL = "http://openweathermap.org/img/w/" + fIcon + ".png";
    var fSky = data.list[i].weather[0].description;
    console.log(fTemp, fWind, fHumidity, fSky);

    forecastTitle.textContent = "5-Day Forecast: ";
    var card = document.createElement("div");
    card.setAttribute("class", "card text-white bg-dark mb-3");
    card.setAttribute("style", "max-width: 18rem;");
    fiveDayForecast.appendChild(card);
    var cardHeader = document.createElement("div");
    cardHeader.setAttribute("class", "card-header");
    cardHeader.textContent = month + "/" + day + "/" + year;
    card.appendChild(cardHeader);
    var cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    var fIconLoc = document.createElement("img");
    fIconLoc.setAttribute("src", fIconURL);
    fIconLoc.setAttribute("alt", fSky);
    cardBody.appendChild(fIconLoc);
    card.appendChild(cardBody);
    var ul = document.createElement("ul");
    ul.setAttribute("class", "list-group list-group-flush");
    card.appendChild(ul);
    var li1 = document.createElement("li");
    li1.setAttribute("class", "list-group-item");
    li1.textContent = "Temp: " + fTemp;
    ul.appendChild(li1);
    var li2 = document.createElement("li");
    li2.setAttribute("class", "list-group-item");
    li2.textContent = "Wind: " + fWind;
    ul.appendChild(li2);
    var li3 = document.createElement("li");
    li3.setAttribute("class", "list-group-item");
    li3.textContent = "Humidity: " + fHumidity;
    ul.appendChild(li3);
  }
};

// Both event listeners, one that looks for the search input and another from the buttons that are populated after previous searches are finished.
userFormEl.addEventListener("submit", formSubmitHandler);
listOfCities.addEventListener("click", buttonClickHandler);

// When button containing previous city is clicked, it will run this function. Obtaining current weather and forecast along with UV Index.
var getSavedCityWeather = function (nextCity) {
  fiveDayForecast.innerHTML = "";
  console.log(nextCity);
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    nextCity +
    "&units=imperial&appid=03b889d282ee365bc5916525efd12b28";
  var apiUrl2 =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    nextCity +
    "&units=imperial&appid=03b889d282ee365bc5916525efd12b28";
  // ONE CALL   https://api.openweathermap.org/data/2.5/onecall?lat=32.77&lon=-96.79&appid=03b889d282ee365bc5916525efd12b28
  // CALL BY CITY NAME  https://api.openweathermap.org/data/2.5/weather?q=' + cityname +'&appid=03b889d282ee365bc5916525efd12b28
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          loadCoords(data);
          displayCurrent(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
  fetch(apiUrl2)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayForecast(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};

// Looks in local storage and sees if any values exists under cities key. If so, it will load them into the script and populate buttons below search bar.
function init() {
  var localSavedCities = JSON.parse(localStorage.getItem("Cities"));

  if (localSavedCities !== null) {
    savedCities = localSavedCities;
  }
  for (var i = 0; i < savedCities.length; i++) {
    var button = document.createElement("button");
    button.textContent = savedCities[i];
    button.setAttribute("class", "btn btn-primary");
    button.setAttribute("data-name", savedCities[i]);
    listOfCities.appendChild(button);
  }
}
// Takes coordinates from previous call, runs one specific call to obtain UV index data and loads it onto the page.
var loadCoords = function (data) {
  cityLat = data.coord.lat;
  cityLon = data.coord.lon;
  console.log(cityLat);
  console.log(cityLon);
  var apiUrl3 =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    cityLat +
    "&lon=" +
    cityLon +
    "&exclude=minutely,hourly,alerts&units=imperial&appid=03b889d282ee365bc5916525efd12b28";
  fetch(apiUrl3)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          var cUV = data.current.uvi;
          console.log(cUV);
          currentUV.textContent = "UV Index: " + cUV;
          if (cUV < 2) {
            currentUV.setAttribute("class", "list-group-item green");
          } else if (cUV >= 2 && cUV < 6) {
            currentUV.setAttribute("class", "list-group-item yellow");
          } else if (cUV >= 6 && cUV < 8) {
            currentUV.setAttribute("class", "list-group-item orange");
          } else if (cUV >= 8 && cUV < 11) {
            currentUV.setAttribute("class", "list-group-item red");
          } else if (cUV >= 11) {
            currentUV.setAttribute("class", "list-group-item lightblue");
          }
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};
init();
