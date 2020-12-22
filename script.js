$(function () {
    //openweather API key
    var apiKey = "9533f3cb4c01176c409c57b70db75f3f";
    var cityLatitude, cityLongitude;
    var citiesButtons = [];
    var lastSearched;

    init();

    //submit button actionlistener. Searches up the city and displays forcast. Resets search value back to ""
    $(".cities-search-form").on("submit", function (event) {
        event.preventDefault();

        var searchRequest = $(".cities-search-input").val().trim();
        if (searchRequest === "") {
            return null;
        }
        else {
            searchCityWeather(searchRequest);
            searchFiveDayForcast(searchRequest);
            $(".cities-search-input").val("");
        }
    })

    //city button actionlistener. Calls the main forcast and the 5 day forcast
    $(".cities-buttons-holder").on("click", ".cities-button", function () {
        searchCityWeather($(this).attr("cityName"));
        searchFiveDayForcast($(this).attr("cityName"));
    })

    //Goes to openweather API and accesses data
    function searchFiveDayForcast(city) {
        var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;
        $.ajax({
            url: queryUrl,
            method: "GET",
        }).then(function (data) {
            for (var dateCount = 0; dateCount < 5; dateCount++) {
                $(".date-forcast-" + dateCount).text(data.list[dateCount * 8].dt_txt.substring(0, 10));
                var iconUrl = "http://openweathermap.org/img/wn/" + data.list[dateCount * 8].weather[0].icon + ".png";
                $(".icon-forcast-" + dateCount).attr("src", iconUrl);
                $(".temperature-forcast-" + dateCount).text("Temp: "+data.list[dateCount * 8].main.temp + "°");
                $(".humidity-forcast-" + dateCount).text("Humidity: "+data.list[dateCount * 8].main.humidity + "%");
            }

        })
    }

    //creates the buttons with saved cities
    function createButtons() {
        $(".cities-buttons-holder").empty();
        for (var citiesCount = 0; citiesCount < citiesButtons.length; citiesCount++) {
            var cityButton = $("<button>").attr("class", "btn btn-primary col-12 mx-auto mt-2 cities-button").text(citiesButtons[citiesCount]);
            $(".cities-buttons-holder").append(cityButton);
            cityButton.attr("cityName", citiesButtons[citiesCount]);
        }
    }

    //Searches up the city for its climate data. Changes main elements and also performs the UV Index search request
    function searchCityWeather(city) {
        var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid="
            + apiKey;
        $.ajax({
            url: queryUrl,
            method: "GET",
        }).then(function (data) {
            var todayDate = new Date(data.dt * 1000).toLocaleDateString("en-US");
            $(".main-city-name-date").text(data.name + " (" + todayDate + ") ");
            var iconUrl = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
            $(".main-icon").attr("src", iconUrl)
            $(".main-temperature").text(data.main.temp + "°");
            $(".main-humidity").text(data.main.humidity + "%");
            $(".main-windspeed").text(data.wind.speed + " MPH");
            cityLongitude = data.coord.lon;
            cityLatitude = data.coord.lat;
            searchCityUVIndex(cityLongitude, cityLatitude);
            if (!citiesButtons.includes(data.name)) {
                citiesButtons.unshift(data.name);
                createButtons();
                localStorage.setItem("cities", JSON.stringify(citiesButtons));
            }
            lastSearched = data.name;
            localStorage.setItem("lastSearched", lastSearched);
        })
    }

    //Init on start. Retreives searched cities and last city searched from local storage
    function init() {
        var storedCitiesButtons = JSON.parse(localStorage.getItem("cities"));
        if (storedCitiesButtons !== null) {
            citiesButtons = storedCitiesButtons;
        }
        createButtons();
        lastSearched = localStorage.getItem("lastSearched");
        searchCityWeather(lastSearched);
        searchFiveDayForcast(lastSearched);

    }

    //Finds UV index and assigns color based on severity
    function searchCityUVIndex(cityLongitude, cityLatitude) {
        var IVIndexQueryUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + cityLatitude + "&lon=" + cityLongitude + "&units=imperial&appid=" + apiKey;
        $.ajax({
            url: IVIndexQueryUrl,
            method: "GET",
        }).then(function (dataTwo) {
            var UVIndex = parseInt(dataTwo.value);
            $(".main-UV-Index").text(UVIndex);
            if(UVIndex>= 11) {
                $(".main-UV-Index").css("background-color","purple");
            }
            else if (UVIndex >= 8) {
                $(".main-UV-Index").css("background-color","red");
            }
            else if (UVIndex >= 6) {
                $(".main-UV-Index").css("background-color","orange");
            }
            else if (UVIndex >= 3) {
                $(".main-UV-Index").css("background-color","yellow");
            }
            else if (UVIndex >= 0) {
                $(".main-UV-Index").css("background-color","green");
            }
        })
    }
});