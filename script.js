$(function () {
    var apiKey = "9533f3cb4c01176c409c57b70db75f3f";
    var todayDate = moment().format("MMM Do YYYY")
    var cityLatitude, cityLongitude;
    var citiesButtons = ["Toronto"];

    createButtons();

    $(".cities-search-form").on("submit", function (event) {
        event.preventDefault();

        var searchRequest = $(".cities-search-input").val().trim();
        if (searchRequest === "") {
            return null;
        }
        else {
            // citiesButtons.push(data.name);
            searchCityWeather(searchRequest);
            $(".cities-search-input").val("");
        }

    });

    $(".cities-buttons-holder").on("click", ".cities-button", function () {
        searchCityWeather($(this).attr("cityName"));
    });

    function createButtons() {
        $(".cities-buttons-holder").empty();
        for (var citiesCount = 0; citiesCount < citiesButtons.length; citiesCount++) {
            var cityButton = $("<button>").attr("class", "btn btn-primary col-12 mx-auto mt-2 cities-button").text(citiesButtons[citiesCount]);
            $(".cities-buttons-holder").append(cityButton);
            cityButton.attr("cityName", citiesButtons[citiesCount]);
        }
    }

    function searchCityWeather(city) {
        var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid="
            + apiKey;
        $.ajax({
            url: queryUrl,
            method: "GET",
        }).then(function (data) {
            $(".cities-name-date").text(data.name + " (" + todayDate + ") ");
            $(".main-temperature").text(data.main.temp + "°");
            $(".main-humidity").text(data.main.humidity + "%");
            $(".main-windspeed").text(data.wind.speed + " MPH");
            cityLongitude = data.coord.lon;
            cityLatitude = data.coord.lat;
            searchCityIVIndex(cityLongitude, cityLatitude);
            if (!citiesButtons.includes(data.name)) {
                citiesButtons.push(data.name);
                createButtons();
            }
        });
    };

    function searchCityIVIndex(cityLongitude, cityLatitude) {
        var IVIndexQueryUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + cityLatitude + "&lon=" + cityLongitude + "&appid=" + apiKey;
        $.ajax({
            url: IVIndexQueryUrl,
            method: "GET",
        }).then(function (dataTwo) {
            $(".main-UV-Index").text(dataTwo.value);
        });
    }
});