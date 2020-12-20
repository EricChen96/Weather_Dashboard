$(function () {
    var apiKey = "9533f3cb4c01176c409c57b70db75f3f";

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
            // log the data from the api to the console
            console.log(data);
        });
});