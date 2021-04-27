let cityHistory = []
const queryURL = 'https://api.openweathermap.org/data/2.5/weather?q='
const units = '&units=imperial'
const key = '&appid=c1fb2f68c5ac444dddfd6a3191710284'

// Getting current date
const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yyyy = today.getFullYear();

// Function to render previous localStorage history to search div
function renderSearchHistory() {
    const localCities = JSON.parse(localStorage.getItem('City'));
    if (localCities != null) {
        for (let i = 0; i < localCities.length; i++) {
            $('#searchHistory').append(`<li class="list-group-item" onClick="callAjaxCity('${localCities[i].city}')">${localCities[i].city}</li>`)        
        }
    }   
}

renderSearchHistory()


// function for five day forecast
function fiveDay(cityName) {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}` + units + key,
        method: "GET"
    }).then(function(response) {
        $(".fiveDay").html(`
        <div class="col-xs-2 container-small" id="p1">

            <h3>${response.list[1].dt_txt.substr(0, 11)}</h3>

            <img class="weatherImg" src='http://openweathermap.org/img/w/${response.list[0].weather[0].icon}.png'>

            <h3>Temp: ${response.list[1].main.temp}</h3>

            <h3>Humidity: ${response.list[1].main.humidity}%</h3>
        </div>

        <div class="col-xs-2 col-half-offset container-small" id="p2">

            <h3>${response.list[9].dt_txt.substr(0, 11)}</h3>

            <img class="weatherImg" src='http://openweathermap.org/img/w/${response.list[1].weather[0].icon}.png'>

            <h3>Temp: ${response.list[9].main.temp}</h3>

            <h3>Humidity: ${response.list[9].main.humidity}%</h3>
        
        </div>

        <div class="col-xs-2 col-half-offset container-small" id="p3">
        
            <h3>${response.list[18].dt_txt.substr(0, 11)}</h3>

            <img class="weatherImg" src='http://openweathermap.org/img/w/${response.list[2].weather[0].icon}.png'>

            <h3>Temp: ${response.list[18].main.temp}</h3>

            <h3>Humidity: ${response.list[18].main.humidity}%</h3>
        
        </div>

        <div class="col-xs-2 col-half-offset container-small" id="p4">
        
            <h3>${response.list[27].dt_txt.substr(0, 11)}</h3>

            <img class="weatherImg" src='http://openweathermap.org/img/w/${response.list[3].weather[0].icon}.png'>

            <h3>Temp: ${response.list[27].main.temp}</h3>

            <h3>Humidity: ${response.list[27].main.humidity}%</h3>
        
        </div>

        <div class="col-xs-2 col-half-offset container-small" id="p5">
        
            <h3>${response.list[35].dt_txt.substr(0, 11)}</h3>

            <img class="weatherImg" src='http://openweathermap.org/img/w/${response.list[4].weather[0].icon}.png'>

            <h3>Temp: ${response.list[35].main.temp}</h3>

            <h3>Humidity: ${response.list[35].main.humidity}%</h3>
        
        </div>        
        `)
    })
}

// function to get UV index
function callAjaxUV(lat, lon) {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}` + key,
        method: "GET"
    }).then(function(response) {
        if (response.current.uvi < 3) {
            $('.container').append(`
            <h2>UV: ${response.current.uvi} <i class="bi bi-circle-fill green"></i></h2>
            `)
        } else if (response.current.uvi < 6) {
            $('.container').append(`
            <h2>UV: ${response.current.uvi} <i class="bi bi-circle-fill
            yellow"></i></h2>
            `)
        } else if (response.current.uvi < 8) {
            $('.container').append(`
            <h2>UV: ${response.current.uvi} <i class="bi bi-circle-fill orange"></i></h2>
            `)
        } else if (response.current.uvi < 11) {
            $('.container').append(`
            <h2>UV: ${response.current.uvi} <i class="bi bi-circle-fill red"></i></h2>
            `)
        } else if (response.current.uvi > 11){
            $('.container').append(`
            <h2>UV: ${response.current.uvi} <i class="bi bi-circle-fill violet"></i></h2>
            `)
        }
    })
}

// Function to get main temp and calls five day forecast and UV index
function callAjaxCity(cityName) {
    $.ajax({
        url: queryURL + cityName + units + key,
        method: "GET"
    }).then(function(response) {
        $('.currentWeather').html(`
        <div class="container">

        <h1>${response.name} (${mm}/${dd}/${yyyy}) <img class="weatherImg" src='http://openweathermap.org/img/w/${response.weather[0].icon}.png'></h1>

        <h2>Temperature: ${response.main.temp} F</h2>

        <h2>Humidity: ${response.main.humidity}%</h2>

        <h2>Wind Speed: ${response.wind.speed}</h2>
        
        </div>
        `)
        callAjaxUV(response.coord.lat, response.coord.lon)
        fiveDay(response.name)
    });
}

// When clicked, will check if input is not null and if it is not null will render the weather, if null will alert the user
$('button').on('click', function(e) {
    e.preventDefault();
    city = document.getElementById('citySearch').value
    if(city === '') {
        alert('Error, no city inputed')
    } else {
        addCity(city)
        callAjaxCity(city)
        savedHistory(city)
    }
})

// Saved city name to array to update localStorage 
function addCity(newCity) {
    if (JSON.parse(localStorage.getItem('City')) != null) {
        cityHistory = JSON.parse(localStorage.getItem('City'))
        const cityObj = {}
        cityObj['city'] = newCity
        cityHistory.push(cityObj)
        localStorage.setItem('City', JSON.stringify(cityHistory))
    } else {
        const cityObj = {}
        cityObj['city'] = newCity
        cityHistory.push(cityObj)
        localStorage.setItem('City', JSON.stringify(cityHistory));
    }
}

// Function to add city to the saved history
function savedHistory(cityName) {
    const historyLi = $(`<li class="list-group-item" onClick="callAjaxCity('${cityName}')">${cityName}</li>`).text(cityName);
    $('#searchHistory').append(historyLi)
}
