var userFormEl = document.querySelector('#user-form');
var languageButtonsEl = document.querySelector('#language-buttons');
var nameInputEl = document.querySelector('#username');
var repoContainerEl = document.querySelector('#repos-container');
var repoSearchTerm = document.querySelector('#repo-search-term');

// TODO: This will be the city entered check function.
// var formSubmitHandler = function (event) {
//   event.preventDefault();

//   var username = nameInputEl.value.trim();

//   if (username) {
//     getUserRepos(username);

//     repoContainerEl.textContent = '';
//     nameInputEl.value = '';
//   } else {
//     alert('Please enter an actual City');
//   }
// };

// TODO: Need a function to load cities onto buttons to use with buttonClickHandler()
// START HERE!

// TODO: Use this for the reuse of cities.
// var buttonClickHandler = function (event) {
//   var language = event.target.getAttribute('data-language');

//   if (language) {
//     getFeaturedRepos(language);

//     repoContainerEl.textContent = '';
//   }
// };

// TODO: This will be the initial call for city searched. Needs to include save to localstorage and also button produced in button section
var getUserRepos = function () {
  var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=32.77&lon=-96.79&appid=03b889d282ee365bc5916525efd12b28';
//   https://api.openweathermap.org/data/2.5/onecall?lat=32.77&lon=-96.79&appid=03b889d282ee365bc5916525efd12b28

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
        //   displayRepos(data);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to OpenWeather');
    });
};

// TODO: This part may be uneeded. I need buttons to appear once searched for. This just finds what language from old example.
// var getFeaturedRepos = function (language) {
//   var apiUrl = 'https://api.github.com/search/repositories?q=' + language + '+is:featured&sort=help-wanted-issues';

//   fetch(apiUrl).then(function (response) {
//     if (response.ok) {
//       response.json().then(function (data) {
//         displayRepos(data.items, language);
//       });
//     } else {
//       alert('Error: ' + response.statusText);
//     }
//   });
// };

// TODO: This function will be the one to display the weather blocks. Start with just displaying whats in the response.
var displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    repoContainerEl.textContent = 'No repositories found.';
    return;
  }

  repoSearchTerm.textContent = searchTerm;

  for (var i = 0; i < repos.length; i++) {
    var repoName = repos[i].owner.login + '/' + repos[i].name;

    var repoEl = document.createElement('a');
    repoEl.classList = 'list-item flex-row justify-space-between align-center';
    repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);

    var titleEl = document.createElement('span');
    titleEl.textContent = repoName;

    repoEl.appendChild(titleEl);

    var statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';

    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    repoEl.appendChild(statusEl);

    repoContainerEl.appendChild(repoEl);
  }
};

// userFormEl.addEventListener('submit', formSubmitHandler);
// languageButtonsEl.addEventListener('click', buttonClickHandler);

// TODO: I need a get a function that finds a location of typed in by user.
// TODO: I need a function/API that gives me current location.

// It needs temp, wind, humidity for boxes per day. Current includes UV index as last line.
var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=32.77&lon=-96.79&exclude=minutely,hourly,alerts&units=imperial&appid=03b889d282ee365bc5916525efd12b28';
//   https://api.openweathermap.org/data/2.5/onecall?lat=32.77&lon=-96.79&appid=03b889d282ee365bc5916525efd12b28

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          var text = data.current.temp;
          console.log(text);
          repoContainerEl.textContent = 'The Current temp is ' + text;
        //   displayRepos(data);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to OpenWeather');
    });
    