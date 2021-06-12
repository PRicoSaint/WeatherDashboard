
// Variables in use
var userFormEl = document.querySelector('#user-form');
var nameInputEl = document.querySelector('#cityname');
var displayedCity = document.querySelector('#displayed-city');
var currentTemp = document.querySelector('#current-temp');
var currentWind = document.querySelector('#current-wind');
var currentHumidity= document.querySelector('#current-humidity');
var currentUV = document.querySelector('#current-UV');
var listOfCities = document.querySelector('#listofcities');
var fiveDayForecast = document.querySelector('#forecast');

// Unused Variables
var languageButtonsEl = document.querySelector('#language-buttons');
var repoContainerEl = document.querySelector('#repos-container');
var repoSearchTerm = document.querySelector('#repo-search-term');



var savedCities = [];
// TODO: This will be the city entered check function.
var formSubmitHandler = function (event) {
  event.preventDefault();

  var cityname = nameInputEl.value.trim();
  console.log(cityname);

  if (cityname) {
    getCityWeather(cityname);

  } else {
    alert('Please enter an actual City');
  }
};

// // TODO: Need a function to load cities onto buttons to use with buttonClickHandler()
// // START HERE!

// // TODO: Use this for the reuse of cities.
var buttonClickHandler = function (event) {
  var nextCity = event.target.getAttribute('data-name');

  if (nextCity) {
    getSavedCityWeather(nextCity);

  }
};

// TODO: This will be the initial call for city searched. Needs to include save to localstorage and also button produced in button section
var getCityWeather = function (cityname) {
  fiveDayForecast.innerHTML = '';
  console.log(cityname);
  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityname +'&units=imperial&appid=03b889d282ee365bc5916525efd12b28';
  var apiUrl2 = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityname + '&units=imperial&appid=03b889d282ee365bc5916525efd12b28';
  // ONE CALL   https://api.openweathermap.org/data/2.5/onecall?lat=32.77&lon=-96.79&appid=03b889d282ee365bc5916525efd12b28
  // CALL BY CITY NAME  https://api.openweathermap.org/data/2.5/weather?q=' + cityname +'&appid=03b889d282ee365bc5916525efd12b28
  fetch(apiUrl)
    .then(function (response) { 
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          var sCity = data.name;
          console.log(savedCities.includes(sCity));
          if (savedCities.includes(sCity)){
          // DO nothing
          } else{
          savedCities.push(sCity);
          localStorage.setItem("Cities", JSON.stringify(savedCities));
          var button = document.createElement("button");
          button.textContent = sCity;
          button.setAttribute("class","btn btn-primary");
          button.setAttribute("data-name", sCity);

          listOfCities.appendChild(button);
          };
          displayCurrent(data);
          });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to OpenWeather');
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
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to OpenWeather');
    });
};


// // TODO: This function will be the one to display the weather blocks. Start with just displaying whats in the response.
var displayCurrent = function (data) {
  if (data.length === 0) {
    alert('No city found');
    return;
  }
    var cName = data.name;
    var cTemp = data.main.temp;
    var cWind = data.wind.gust;
    var cHumidity = data.main.humidity;
    console.log(cName, cTemp, cWind, cHumidity);

    displayedCity.textContent = cName;
    currentTemp.textContent = 'Temp: ' + cTemp;
    currentWind.textContent = 'Wind: ' + cWind;
    currentHumidity.textContent = 'Humidity: ' + cHumidity;
}
var displayForecast = function (data) {
  if (data.length === 0) {
    alert('No city found');
    return;
  }
  for (var i=0; i<5; i++){
    var currentDate = new Date();
    var day = currentDate.getDate() +1 + i;
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var fTemp = data.list[i].main.temp;
    var fWind = data.list[i].wind.speed;
    var fHumidity = data.list[i].main.humidity;
    var fSky = data.list[i].weather[0].description;
    console.log( fTemp, fWind, fHumidity, fSky);

    var card = document.createElement("div");
      card.setAttribute("class", "card text-white bg-dark mb-3");
      card.setAttribute("style","max-width: 18rem;");
      fiveDayForecast.appendChild(card);
    var cardHeader = document.createElement("div");
      cardHeader.setAttribute("class", "card-header");
      cardHeader.textContent = month + "/" + day + "/" + year;
      card.appendChild(cardHeader);
    var cardBody = document.createElement("div");
      cardBody.setAttribute("class", "card-body");
      cardBody.textContent = 'Weather: ' + fSky;
      card.appendChild(cardBody);
    var ul = document.createElement("ul");
      ul.setAttribute("class", "list-group list-group-flush");
      card.appendChild(ul);
    var li1 = document.createElement("li");
      li1.setAttribute("class", "list-group-item");
      li1.textContent =  fTemp;
      ul.appendChild(li1);
    var li2 = document.createElement("li");
      li2.setAttribute("class", "list-group-item");
      li2.textContent =  fWind;
      ul.appendChild(li2);
    var li3 = document.createElement("li");
      li3.setAttribute("class", "list-group-item");
      li3.textContent =  fHumidity;
      ul.appendChild(li3);
  }
}

userFormEl.addEventListener('submit', formSubmitHandler);
listOfCities.addEventListener('click', buttonClickHandler);




var getSavedCityWeather = function (nextCity) {
  fiveDayForecast.innerHTML = '';
  console.log(nextCity);
  var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + nextCity +'&units=imperial&appid=03b889d282ee365bc5916525efd12b28';
  var apiUrl2 = 'https://api.openweathermap.org/data/2.5/forecast?q=' + nextCity + '&units=imperial&appid=03b889d282ee365bc5916525efd12b28';
  // ONE CALL   https://api.openweathermap.org/data/2.5/onecall?lat=32.77&lon=-96.79&appid=03b889d282ee365bc5916525efd12b28
  // CALL BY CITY NAME  https://api.openweathermap.org/data/2.5/weather?q=' + cityname +'&appid=03b889d282ee365bc5916525efd12b28
  fetch(apiUrl)
    .then(function (response) { 
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayCurrent(data);

        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to OpenWeather');
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
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to OpenWeather');
    });
};


function init() {
  var localSavedCities = JSON.parse(localStorage.getItem("Cities"));

  if (localSavedCities !== null){
    savedCities = localSavedCities;
  }
  for (var i = 0; i < savedCities.length; i++){
    var button = document.createElement("button");
          button.textContent = savedCities[i];
          button.setAttribute("class","btn btn-primary");
          button.setAttribute("data-name", savedCities[i]);
          listOfCities.appendChild(button);
  }

}
init();