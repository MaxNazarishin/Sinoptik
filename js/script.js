const apiKey = '855273cafc8aba763951dd5ed10dbed1';
const input_city = document.getElementById('input_city');
const button = document.querySelector('.button');

const curent_time = document.getElementById('curent_time');

const weather_icon_elem1 = document.getElementById('weather_icon_elem1');
const weather_icon_elem2 = document.getElementById('weather_icon_elem2');

const real_temp = document.getElementById('real_temp');
const feel_temp = document.getElementById('feel_temp');

const speed = document.getElementById('speed');
const gust = document.getElementById('gust');

const main_block = document.querySelector('.main_block');

const not_found_input = document.getElementById('not_found_input');
const main_elem_eror = document.getElementById('main_elem_eror');

window.addEventListener('DOMContentLoaded', () => {
    fetchWeather("Kyiv");
    forecast_day5();
    window.location.hash = "#today";

    button.addEventListener('click', () => search());

    const PressEnter = e => e.key === 'Enter' && search();
    input_city.addEventListener('keypress', PressEnter);
});

function search() {
    const cityName = input_city.value.trim();
    if (cityName !== '') {
        fetchWeather(cityName);
        forecast_day5();
    } else {
        alert('Введите название города!');
        input_city.focus();
    }
}

function fetchWeather(INPUT_CITY) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${INPUT_CITY}&appid=${apiKey}&units=metric`;

    fetch(url).then((response) => response.json()).then((data) => {
        if (data.message == "city not found") {
            input_city.value = "";
            input_city.focus();
            main_block.style.display = 'none';
            main_elem_eror.style.display = 'block';
            not_found_input.textContent = INPUT_CITY;
            return;
        }
        else {
            main_block.style.display = 'block';
            main_elem_eror.style.display = 'none';
        }

        let today = new Date();

        let day = today.getDate();
        let month = today.getMonth() + 1;
        let year = today.getFullYear();

        let currentDate = `${day}.${month}.${year}`;

        curent_time.textContent = currentDate;

        for (let i = 2; i <= 42; i++) {
            const gridItem = document.getElementById(`grid_item_${i}`);
            if (i >= 2 && i <= 7) {
                gridItem.textContent = `${data.list[i - 2].dt_txt.slice(11, 16)} h`;
            } else if (i >= 9 && i <= 14) {
                gridItem.src = `https://openweathermap.org/img/wn/${data.list[i - 9].weather[0].icon}.png`;
            } else if (i >= 16 && i <= 21) {
                gridItem.textContent = `${data.list[i - 16].weather[0].main}`;
            } else if (i >= 23 && i <= 28) {
                gridItem.textContent = `${data.list[i - 23].main.temp}°`;
            } else if (i >= 30 && i <= 35) {
                gridItem.textContent = `${data.list[i - 30].main.feels_like}°`;
            } else if (i >= 37 && i <= 42) {
                gridItem.textContent = data.list[i - 37].wind.speed;
            }
        }

        weather_icon_elem1.src = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`;
        weather_icon_elem2.textContent = data.list[0].weather[0].main;

        document.getElementById("day_selected").textContent = convertDayFullWord(data.list[0].dt_txt);

        let Real_temp = 0;
        let Feel_temp = 0;
        let Gust = 0;
        let Speed = 0;

        for (i = 0; i < 8; i++) {
            if (new Date(data.list[i].dt_txt).getHours() !== 3) {
                Real_temp += data.list[i].main.temp;
                Feel_temp += data.list[i].main.feels_like;
                Gust += data.list[i].wind.gust;
                Speed += data.list[i].wind.speed;
            }
            else {
                if (Real_temp == 0) {
                    Real_temp += data.list[0].main.temp;
                    Feel_temp += data.list[0].main.feels_like;
                    Gust += data.list[0].wind.gust;
                    Speed += data.list[0].wind.speed;
                    return;
                }
                else {
                    Real_temp /= i;
                    Feel_temp /= i;
                    Gust /= i;
                    Speed /= i;
                    real_temp.textContent = `${Real_temp.toFixed(1)}℃`;
                    feel_temp.textContent = `Real Feel ${Feel_temp.toFixed(1)}°`;
                    gust.textContent = `Gust: ${Gust.toFixed(2)} m`;
                    speed.textContent = `Speed: ${Speed.toFixed(2)} m`;
                    return;
                }
            }
        }
    })

        .catch((error) => {
            console.error('Произошла ошибка:', error);
        });
}

function fetchWeathercity(input_city, iconElement, tempElement) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${input_city}&appid=${apiKey}&units=metric`;

    fetch(url).then((response) => response.json()).then((data) => {
        iconElement.src = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`;
        tempElement.textContent = `${data.list[0].main.temp}℃`;
    })
        .catch((error) => {
            console.log("Error fetching weather data: ", error);
        });
}

fetchWeathercity('Odesa', weather_Odesa_icon, weather_Odesa_temp);
fetchWeathercity('Cherkasy', weather_Cherkasy_icon, weather_Cherkasy_temp);
fetchWeathercity('Lviv', weather_Lviv_icon, weather_Lviv_temp);
fetchWeathercity('Mykolaiv', weather_Mykolaiv_icon, weather_Mykolaiv_temp);

function convertDay(dateString) {
    const dayOfWeek = new Date(dateString).getDay();
    const daysOfWeekNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    return daysOfWeekNames[dayOfWeek];
}

function convertDayFullWord(dateString) {
    const dayOfWeek = new Date(dateString).getDay();
    const daysOfWeekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeekNames[dayOfWeek];
}

function convertMonth(dateString) {
    const month = new Date(dateString).getMonth();
    const MonthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return MonthNames[month];
}

function forecast_day5() {
    let city;
    if (input_city.value.trim() == "") {
        city = "Kyiv";
    }
    else {
        city = input_city.value.trim();
    }
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url).then((response) => response.json()).then((data) => {
        let template = '';

        for (i = 0, j = 0; i < 5; i++, j += 8) {
            template += `
            <div class="days5_item" id="days5__item${i + 1}" onclick="display_selected_day(${i + 1})">
                <div class="weekday">${convertDay(data.list[j].dt_txt)}</div>
                <div class="month_day">${convertMonth(data.list[j].dt_txt)} ${new Date(data.list[j].dt_txt).getDate()}</div>
                <div><img class="icon_day" src="https://openweathermap.org/img/wn/${data.list[j].weather[0].icon}.png"></div>
                <div class="temp_day">${data.list[j].main.temp}℃</div>
                <div class="weather_day">${data.list[j].weather[0].main}</div>
            </div>
            `;
        }
        const days5_block = document.querySelector('.days5_block');
        days5_block.innerHTML = template;

        for (let i = 2; i <= 42; i++) {
            const gridItem = document.getElementById(`grid2_item_${i}`);
            if (i >= 2 && i <= 7) {
                gridItem.textContent = `${data.list[i - 2].dt_txt.slice(11, 16)} h`;
            } else if (i >= 9 && i <= 14) {
                gridItem.src = `https://openweathermap.org/img/wn/${data.list[i - 9].weather[0].icon}.png`;
            } else if (i >= 16 && i <= 21) {
                gridItem.textContent = `${data.list[i - 16].weather[0].main}`;
            } else if (i >= 23 && i <= 28) {
                gridItem.textContent = `${data.list[i - 23].main.temp}°`;
            } else if (i >= 30 && i <= 35) {
                gridItem.textContent = `${data.list[i - 30].main.feels_like}°`;
            } else if (i >= 37 && i <= 42) {
                gridItem.textContent = data.list[i - 37].wind.speed;
            }
        }


    })
        .catch((error) => {
            console.log("Error fetching weather data: ", error);
        });
}

function display_selected_day(selected_day) {
    let city;
    if (input_city.value.trim() == "") {
        city = "Kyiv";
    }
    else {
        city = input_city.value.trim();
    }
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url).then((response) => response.json()).then((data) => {

        switch (selected_day) {
            case 1:
                for (let i = 2; i <= 42; i++) {
                    const gridItem = document.getElementById(`grid2_item_${i}`);
                    if (i >= 2 && i <= 7) {
                        gridItem.textContent = `${data.list[i - 2].dt_txt.slice(11, 16)} h`;
                    } else if (i >= 9 && i <= 14) {
                        gridItem.src = `https://openweathermap.org/img/wn/${data.list[i - 9].weather[0].icon}.png`;
                    } else if (i >= 16 && i <= 21) {
                        gridItem.textContent = `${data.list[i - 16].weather[0].main}`;
                    } else if (i >= 23 && i <= 28) {
                        gridItem.textContent = `${data.list[i - 23].main.temp}°`;
                    } else if (i >= 30 && i <= 35) {
                        gridItem.textContent = `${data.list[i - 30].main.feels_like}°`;
                    } else if (i >= 37 && i <= 42) {
                        gridItem.textContent = data.list[i - 37].wind.speed;
                    }
                }
                document.getElementById("days5__item1").style.background = "rgb(155, 155, 155)";
                document.getElementById("days5__item2").style.background = "rgb(186, 186, 186)";
                document.getElementById("days5__item3").style.background = "rgb(186, 186, 186)";
                document.getElementById("days5__item4").style.background = "rgb(186, 186, 186)";
                document.getElementById("days5__item5").style.background = "rgb(186, 186, 186)";

                document.getElementById("day_selected").textContent = convertDayFullWord(data.list[0].dt_txt);
                break;
            case 2:
                for (let i = 2; i <= 42; i++) {
                    const gridItem = document.getElementById(`grid2_item_${i}`);
                    if (i >= 2 && i <= 7) {
                        gridItem.textContent = `${data.list[i - (-6)].dt_txt.slice(11, 16)} h`;
                    } else if (i >= 9 && i <= 14) {
                        gridItem.src = `https://openweathermap.org/img/wn/${data.list[i - 2].weather[0].icon}.png`;
                    } else if (i >= 16 && i <= 21) {
                        gridItem.textContent = `${data.list[i - 10].weather[0].main}`;
                    } else if (i >= 23 && i <= 28) {
                        gridItem.textContent = `${data.list[i - 18].main.temp}°`;
                    } else if (i >= 30 && i <= 35) {
                        gridItem.textContent = `${data.list[i - 26].main.feels_like}°`;
                    } else if (i >= 37 && i <= 42) {
                        gridItem.textContent = data.list[i - 34].wind.speed;
                    }
                }
                document.getElementById("days5__item1").style.background = "rgb(186, 186, 186)";
                document.getElementById("days5__item2").style.background = "rgb(155, 155, 155)";
                document.getElementById("days5__item3").style.background = "rgb(186, 186, 186)";
                document.getElementById("days5__item4").style.background = "rgb(186, 186, 186)";
                document.getElementById("days5__item5").style.background = "rgb(186, 186, 186)";

                document.getElementById("day_selected").textContent = convertDayFullWord(data.list[8].dt_txt);
                break;
            case 3:
                for (let i = 2; i <= 42; i++) {
                    const gridItem = document.getElementById(`grid2_item_${i}`);
                    if (i >= 2 && i <= 7) {
                        gridItem.textContent = `${data.list[i - (-14)].dt_txt.slice(11, 16)} h`;
                    } else if (i >= 9 && i <= 14) {
                        gridItem.src = `https://openweathermap.org/img/wn/${data.list[i - (-6)].weather[0].icon}.png`;
                    } else if (i >= 16 && i <= 21) {
                        gridItem.textContent = `${data.list[i - 2].weather[0].main}`;
                    } else if (i >= 23 && i <= 28) {
                        gridItem.textContent = `${data.list[i - 10].main.temp}°`;
                    } else if (i >= 30 && i <= 35) {
                        gridItem.textContent = `${data.list[i - 18].main.feels_like}°`;
                    } else if (i >= 37 && i <= 42) {
                        gridItem.textContent = data.list[i - 26].wind.speed;
                    }
                }
                document.getElementById("days5__item1").style.background = "rgb(186, 186, 186)";
                document.getElementById("days5__item2").style.background = "rgb(186, 186, 186)";
                document.getElementById("days5__item3").style.background = "rgb(155, 155, 155)";
                document.getElementById("days5__item4").style.background = "rgb(186, 186, 186)";
                document.getElementById("days5__item5").style.background = "rgb(186, 186, 186)";

                document.getElementById("day_selected").textContent = convertDayFullWord(data.list[16].dt_txt);
                break;
            case 4:
                for (let i = 2; i <= 42; i++) {
                    const gridItem = document.getElementById(`grid2_item_${i}`);
                    if (i >= 2 && i <= 7) {
                        gridItem.textContent = `${data.list[i - (-22)].dt_txt.slice(11, 16)} h`;
                    } else if (i >= 9 && i <= 14) {
                        gridItem.src = `https://openweathermap.org/img/wn/${data.list[i - (-14)].weather[0].icon}.png`;
                    } else if (i >= 16 && i <= 21) {
                        gridItem.textContent = `${data.list[i - (-6)].weather[0].main}`;
                    } else if (i >= 23 && i <= 28) {
                        gridItem.textContent = `${data.list[i - 2].main.temp}°`;
                    } else if (i >= 30 && i <= 35) {
                        gridItem.textContent = `${data.list[i - 10].main.feels_like}°`;
                    } else if (i >= 37 && i <= 42) {
                        gridItem.textContent = data.list[i - 18].wind.speed;
                    }
                }
                document.getElementById("days5__item1").style.background = "rgb(186, 186, 186)";
                document.getElementById("days5__item2").style.background = "rgb(186, 186, 186)";
                document.getElementById("days5__item3").style.background = "rgb(186, 186, 186)";
                document.getElementById("days5__item4").style.background = "rgb(155, 155, 155)";
                document.getElementById("days5__item5").style.background = "rgb(186, 186, 186)";

                document.getElementById("day_selected").textContent = convertDayFullWord(data.list[24].dt_txt);
                break;
            case 5:
                for (let i = 2; i <= 42; i++) {
                    const gridItem = document.getElementById(`grid2_item_${i}`);
                    if (i >= 2 && i <= 7) {
                        gridItem.textContent = `${data.list[i - (-30)].dt_txt.slice(11, 16)} h`;
                    } else if (i >= 9 && i <= 14) {
                        gridItem.src = `https://openweathermap.org/img/wn/${data.list[i - (-22)].weather[0].icon}.png`;
                    } else if (i >= 16 && i <= 21) {
                        gridItem.textContent = `${data.list[i - (-14)].weather[0].main}`;
                    } else if (i >= 23 && i <= 28) {
                        gridItem.textContent = `${data.list[i - (-6)].main.temp}°`;
                    } else if (i >= 30 && i <= 35) {
                        gridItem.textContent = `${data.list[i - 2].main.feels_like}°`;
                    } else if (i >= 37 && i <= 42) {
                        gridItem.textContent = data.list[i - 10].wind.speed;
                    }
                }
                document.getElementById("days5__item1").style.background = "rgb(186, 186, 186)";
                document.getElementById("days5__item2").style.background = "rgb(186, 186, 186)";
                document.getElementById("days5__item3").style.background = "rgb(186, 186, 186)";
                document.getElementById("days5__item4").style.background = "rgb(186, 186, 186)";
                document.getElementById("days5__item5").style.background = "rgb(155, 155, 155)";

                document.getElementById("day_selected").textContent = convertDayFullWord(data.list[32].dt_txt);
                break;
        }
    })
        .catch((error) => {
            console.log("Error fetching weather data: ", error);
        });
}

let count = 0;

function blackAndWhite() {
    if (count == 0) {
        document.querySelector("body").style.background = "rgb(100, 100, 100)";
        document.querySelectorAll(".main_elem").forEach(elem => {
            elem.style.background = "rgb(140, 140, 140)";
        });
        document.querySelectorAll(".grid-item_1").forEach(elem => {
            elem.style.background = "rgb(165, 165, 165)";
        });
        document.querySelectorAll(".days5_item").forEach(elem => {
            elem.style.background = "rgb(140, 140, 140)";
        });
        document.querySelectorAll(".grid-item").forEach(elem => {
            elem.style.color = "white";
        });
        document.querySelector(".text_weather").style.color = "white";
        document.querySelector("#curent_time").style.color = "white";
        document.querySelectorAll(".block_color").forEach(elem => {
            elem.style.color = "white";
        });
        document.querySelectorAll(".name_city").forEach(elem => {
            elem.style.color = "white";
        });
        document.querySelector("#weather_Odesa_temp").style.color = "white";
        document.querySelector("#weather_Cherkasy_temp").style.color = "white";
        document.querySelector("#weather_Lviv_temp").style.color = "white";
        document.querySelector("#weather_Mykolaiv_temp").style.color = "white";
        document.querySelector("#weather_icon_elem2").style.color = "white";
        document.querySelector("#real_temp").style.color = "white";
        document.querySelector("#feel_temp").style.color = "white";
        document.querySelector("#speed").style.color = "white";
        document.querySelector("#gust").style.color = "white";
        document.querySelectorAll(".weather_day").forEach(elem => {
            elem.style.color = "white";
        });
        document.querySelectorAll(".temp_day").forEach(elem => {
            elem.style.color = "white";
        });
        document.querySelectorAll(".month_day").forEach(elem => {
            elem.style.color = "white";
        });
        document.querySelectorAll(".weekday").forEach(elem => {
            elem.style.color = "white";
        });

        document.querySelector("#black_white_style").textContent = "color black";
        count = 1;
    }
    else if (count == 1) {
        document.querySelector("body").style.background = "rgb(209, 209, 209)";
        document.querySelectorAll(".main_elem").forEach(elem => {
            elem.style.background = "rgb(186, 186, 186)";
        });
        document.querySelectorAll(".grid-item_1").forEach(elem => {
            elem.style.background = "rgb(209, 209, 209)";
        });
        document.querySelectorAll(".days5_item").forEach(elem => {
            elem.style.background = "rgb(186, 186, 186)";
        });
        document.querySelectorAll(".grid-item").forEach(elem => {
            elem.style.color = "black";
        });
        document.querySelector(".text_weather").style.color = "rgb(0, 149, 149)";
        document.querySelector("#curent_time").style.color = "rgb(0, 116, 116)";
        document.querySelectorAll(".block_color").forEach(elem => {
            elem.style.color = "rgb(0, 116, 116)";
        });
        document.querySelectorAll(".name_city").forEach(elem => {
            elem.style.color = "black";
        });
        document.querySelector("#weather_Odesa_temp").style.color = "black";
        document.querySelector("#weather_Cherkasy_temp").style.color = "black";
        document.querySelector("#weather_Lviv_temp").style.color = "black";
        document.querySelector("#weather_Mykolaiv_temp").style.color = "black";
        document.querySelector("#weather_icon_elem2").style.color = "black";
        document.querySelector("#real_temp").style.color = "black";
        document.querySelector("#feel_temp").style.color = "black";
        document.querySelector("#speed").style.color = "black";
        document.querySelector("#gust").style.color = "black";
        document.querySelectorAll(".weather_day").forEach(elem => {
            elem.style.color = "rgb(66, 66, 66)";
        });
        document.querySelectorAll(".temp_day").forEach(elem => {
            elem.style.color = "black";
        });
        document.querySelectorAll(".month_day").forEach(elem => {
            elem.style.color = "rgb(66, 66, 66)";
        });
        document.querySelectorAll(".weekday").forEach(elem => {
            elem.style.color = "rgb(0, 116, 116)";
        });

        document.querySelector("#black_white_style").textContent = "color white";
        count = 0;
    }
}