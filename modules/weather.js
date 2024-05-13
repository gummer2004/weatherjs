
const currentWeatherDiv = document.getElementById("weather")
const dailyWeatherDiv = document.getElementById("daily")

import { getWeatherData } from "./api.js";
import { config } from "./config.js";

const IMAGE_BASE_URL = config.image_base_url;

export async function renderWeather() {
    const weather = await getWeatherData();
    console.log(weather);

    currentWeatherDiv.innerHTML = renderCurrentConditions(weather.current);
    dailyWeatherDiv.innerHTML = weather.forcast?.map(forcast => renderDailyForcast(forcast)).join("")
}

function renderCurrentConditions(current) {
    return (
        `
        <section class="container">
        <div class="row">
        <div class="col-sm p-1">
            <p><img src="${IMAGE_BASE_URL + current.weather[0].icon}.png">  ${Math.round(current.main.temp)} &#8451;</p>
            
            <p>Feels Like: ${current.main.feels_like} &#8451;</p>
            

        </div>
        <div class="col-sm p-1">
              <p>Condition: ${current.weather[0].description}</p>
        </div>
        <div class="col-sm p-1">
        <p>Dew Point: ${getDewPoint(current.main.temp,current.main.humidity)} &#8451;</p>
        </div>
        <div class="col-sm p-1">
            <p>Wind: ${current.wind.speed} m/s ${ getWindDirection(current.wind.deg)}</p>
        </div>
        </div>
        </section>
        `
    )
}
function renderDailyForcast(daily) {
    return (
        `
        <div class="col-4 col-lg-3 col-xl-2 p-1">
        <h3>${daily.day}</h3>
        <p>High ${daily.max} &#8451; </p>
        <p>Low ${daily.min} &#8451;</p>
        <p><img src="${IMAGE_BASE_URL + daily.weatherForDay[1]}.png"></p>
        <p>${daily.weatherForDay[0]}</p>
        </div>
        `
    )
}
function getDewPoint(temp,humidity){
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
    const dewPoint = (b * alpha) / (a - alpha);
    return dewPoint.toFixed(1);
}

function getWindDirection(deg){
    const increment = 22.5;
    if (deg < increment){
        return "N";
    }else if (deg < increment + 45){
        return "NE";
    }else if (deg < increment + 45 * 2){
        return "E";
    }else if (deg < increment + 45 * 3){
        return "SE";
    }else if (deg < increment + 45 * 4){
        return "S";
    }else if (deg < increment + 45 * 5){
        return "SW";
    }else if (deg < increment + 45 * 6){
        return "W";
    }else if (deg < increment + 45 * 7){
        return "NW";
    }else{
        return "N";
    }
}