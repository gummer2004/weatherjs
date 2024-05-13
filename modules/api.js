
import { config } from "./config.js"

const BASE_URL = config.api_base_url
const CURRENT_WEATHER_URL = config.api_base_current_weather_url
const FORECAST_URL = config.api_base_forecast_url
const API_KEY = config.api_key
const LAT = config.lat
const LON = config.lon
const UNITS = config.units

export async function getWeatherData(page = 1) {
    let data = []
    try {
        const response = await fetch(`${CURRENT_WEATHER_URL}?lat=${LAT}&lon=${LON}&units=${UNITS}&appid=${API_KEY}&page=${page}`);
        const responseData = await response.json()
        // console.log(responseData);
        data.current = responseData;
        const response2 = await fetch(`${FORECAST_URL}?lat=${LAT}&lon=${LON}&units=${UNITS}&appid=${API_KEY}&page=${page}`);
        const responseData2 = await response2.json()
        console.log(responseData2);
        data.forcast = await filterdata(responseData2)
    } catch (error) {
        
    }
    return data
}

async function filterdata(data){
    // getting my individual days
    let daily = [];
    let daySet = new Set();
    for (let i = 0; i < data.list.length; i++) {
        // console.log(i);
        // console.log(data.list[i].dt_txt);
        let theday = ((data.list[i].dt_txt).split(" ")[0]);
        if (daySet.has(theday)) {
            continue;
        }
        daySet.add(theday);
        daily.push(theday);


    }
console.log(daily);
    let maximum = [];
    // getting the max for each day
    for (let i = 0; i < daily.length; i++) {
        let max = -1000;
        for (let j = 0; j < data.list.length; j++) {
            let theday = ((data.list[j].dt_txt).split(" ")[0]);
            if (daily[i] == theday) {
                if (data.list[j].main.temp_max > max) {
                    max = data.list[j].main.temp_max;

                }
            }
        }
        maximum.push(max);
        // console.log("max for day " + daily[i] + " is " + max);
    }

    //detting the min for each day
    let minimum = [];
    // getting the max for each day
    for (let i = 0; i < daily.length; i++) {
        let min = 1000;
        for (let j = 0; j < data.list.length; j++) {
            let theday = ((data.list[j].dt_txt).split(" ")[0]);
            if (daily[i] == theday) {
                if (data.list[j].main.temp_min < min) {
                    min = data.list[j].main.temp_min;

                }
            }
        }
        minimum.push(min);
        // console.log("min for day " + daily[i] + " is " + min);
    }

    //getting the weather for each day
    let weather = [];
    for (let i = 0; i < daily.length; i++) {
        let weatherForDay = [];
        for (let j = 0; j < data.list.length; j++) {
        
            if ((daily[i] + " 12:00:00") == data.list[j].dt_txt){
                weatherForDay.push(data.list[j].weather[0].description);
                weatherForDay.push(data.list[j].weather[0].icon);
            }
        }
        weather.push(weatherForDay);
    }

    // prep for sending data back to the main function
    let dailyData = [];
    for (let i = 0; i < daily.length; i++) {
        let day = daily[i];
        let max = maximum[i];
        let min = minimum[i];
        let weatherForDay = weather[i];
        dailyData.push({ day, max, min, weatherForDay });
    }
    // since we always get 5 days of data
    // day 0 is today and we ignore it
    // we only need 3 days of data
    dailyData.shift(); // remove today
    dailyData.pop(); // remove day 5
    dailyData.pop(); // remove day 4
    return dailyData;
}