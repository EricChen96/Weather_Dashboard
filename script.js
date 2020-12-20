$(function () {
    var apiKey = "9533f3cb4c01176c409c57b70db75f3f";
    var todayDate = moment().format("MMM Do YYYY")
    var cityLatitude, cityLongitude;

    $(".cities-search-form").on("submit", function (event) {
        event.preventDefault();

        var searchRequest = $(".cities-search-input").val()
        if (searchRequest === "") {
            return null;
        }
        else {
            searchCityWeather(searchRequest);
        }

    });

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