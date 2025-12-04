var form = document.getElementById('form');
const latInput = document.getElementById('lat');
const lonInput = document.getElementById('lon');
const search_button = document.getElementById('search_button');
const favourite_button = document.getElementById('favourite_button')
const delete_top_button = document.getElementById('delete_top_button')
const delete_bottom_button = document.getElementById('delete_bottom_button')
const delete_all_button = document.getElementById('delete_all_button')

//Export buttons
const export_24hours_button = document.getElementById('export_24hours_button')
const export_7days_button = document.getElementById('export_7days_button')

//Current temperature data items
const image = document.getElementById('icon');
const description = document.getElementById('description');
const temperature = document.getElementById('temperature');
const max_temperature = document.getElementById('max_temperature');
const min_temperature = document.getElementById('min_temperature');
const wind_speed = document.getElementById('wind_speed')
const address = document.getElementById('location')
const UV_index = document.getElementById('UV_index')

//Convert buttons
const convertCelsiusButton = document.getElementById('toCelsius');
const convertFahrenheitButton = document.getElementById('toFahrenheit');
const convertKelvinButton = document.getElementById('toKelvin');

const QR_button = document.getElementById('QR_button');

//URLs
let dataURL_current = 'https://weather.googleapis.com/v1/currentConditions:lookup?key=[INSERT_OWN_API_KEY]&location.latitude={lat}&location.longitude={lon}'
let dataURL_7days = 'https://api.met.no/weatherapi/subseasonal/1.0/complete?lat={lat}&lon={lon}'
let dataURL_24hours = 'https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=temperature_2m'
let geodataURL = 'https://maps.googleapis.com/maps/api/geocode/json?address={address}&key=[INSERT_OWN_API_KEY]'
let r_geodataURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lon}&key=[INSERT_OWN_API_KEY]'
let sundataURL = 'https://api.sunrise-sunset.org/json?lat={lat}&lng={lon}&tzid=Europe/Helsinki'
let dataURL_24hours_google = 'https://weather.googleapis.com/v1/forecast/hours:lookup?key=[INSERT_OWN_API_KEY]&location.latitude={lat}&location.longitude={lon}'

//Current time
let currentTime = new Date();
let hours = currentTime.getHours();
let minutes = currentTime.getMinutes();
let seconds = currentTime.getSeconds();

const changeBackground_dark = async() => {
    let newdataURL_sun = sundataURL.replace('{lat}', 61.05497219999999).replace('{lon}', 28.1896039);

    const response_sun = await fetch(newdataURL_sun);
    const data_sun = await response_sun.json();

    const sunrise = parseInt(data_sun.results.sunrise.slice(0,1)) + parseInt(data_sun.results.sunrise.slice(2,4))/60 + parseInt(data_sun.results.sunrise.slice(5,7))/3600
    const sunset = 12 + parseInt(data_sun.results.sunset.slice(0,1)) + parseInt(data_sun.results.sunset.slice(2,4))/60 + parseInt(data_sun.results.sunset.slice(5,7))/3600

    const currentTime_dec = hours + minutes/60 + seconds/3600

    if ((sunset >= currentTime_dec) && (currentTime_dec >= sunrise)) {
        localStorage.setItem('dark', 0)
    }else{
        document.body.classList.toggle('dark-mode')
        localStorage.setItem('dark', 1)
    }
}

const getData = async () => {
    let newdataURL_current = dataURL_current.replace('{lat}', latInput.value).replace('{lon}',lonInput.value)
    let newdataURL_7days = dataURL_7days.replace('{lat}', latInput.value).replace('{lon}', lonInput.value);
    let newdataURL_24hours = dataURL_24hours.replace('{lat}', latInput.value).replace('{lon}', lonInput.value);
    let newdataURL_24hours_google = dataURL_24hours_google.replace('{lat}', latInput.value).replace('{lon}', lonInput.value);

    this.temperature_type = 'Celsius';

    localStorage.setItem('lat', latInput.value);
    localStorage.setItem('lon', lonInput.value);

    convertCelsiusButton.className = 'btn btn-primary';
    convertFahrenheitButton.className = 'btn btn-outline-primary';
    convertKelvinButton.className = 'btn btn-outline-primary';

    const response_current = await fetch(newdataURL_current);
    const data_current = await response_current.json();

    if (localStorage.getItem('dark') == 0){
        image.src = data_current.weatherCondition.iconBaseUri + '.svg'
    }else{
        image.src = data_current.weatherCondition.iconBaseUri + '_dark.svg'
    }
    description.innerText = data_current.weatherCondition.description['text']
    temperature.innerText = 'Temperature: ' + data_current.temperature.degrees + ' Celsius'
    max_temperature.innerText = 'Highest temperature: ' + data_current.currentConditionsHistory.maxTemperature.degrees + ' Celsius'
    min_temperature.innerText = 'Lowest temperature: ' + data_current.currentConditionsHistory.minTemperature.degrees + ' Celsius'
    wind_speed.innerText = 'Wind speed: ' + data_current.wind.speed.value + ' km/h'
    UV_index.innerText = 'UV-index: ' + data_current.uvIndex

    localStorage.setItem('precipitation', data_current.precipitation.qpf.quantity)
    localStorage.setItem('precipitation_type', data_current.precipitation.probability.type)

    if (data_current.temperature.degrees >= 40){
        localStorage.setItem('temp', '#fe0000')
    }else if (data_current.temperature.degrees >= 35){
        localStorage.setItem('temp', '#ff6501')
    }else if (data_current.temperature.degrees >= 30){
        localStorage.setItem('temp', '#ffcf00')
    }else if (data_current.temperature.degrees >= 25) {
        localStorage.setItem('temp', '#9bcf00')
    }else if (data_current.temperature.degrees >= 20){
        localStorage.setItem('temp', '#008100')
    }else if (data_current.temperature.degrees >= 15){
        localStorage.setItem('temp', '#31cfce')
    }else if (data_current.temperature.degrees >= 10){
        localStorage.setItem('temp', '#9cceff')
    }else if (data_current.temperature.degrees >= 5){
        localStorage.setItem('temp', '#3065ff')
    }else if (data_current.temperature.degrees >= 0) {
        localStorage.setItem('temp', '#0000fe')
    }else if (data_current.temperature.degrees >= -5){
        localStorage.setItem('temp', '#000084')
    }else if (data_current.temperature.degrees >= -10){
        localStorage.setItem('temp', '#32309d')
    }else if (data_current.temperature.degrees >= -15){
        localStorage.setItem('temp', '#303030')
    }else {
        localStorage.setItem('temp', '#646464')
    }
    if (localStorage.getItem('dark') == 0){
        document.body.style.background = localStorage.getItem('temp')
    }

    const response_24hours = await fetch(newdataURL_24hours);
    const data_24hours = await response_24hours.json();

    const response_24hours_google = await fetch(newdataURL_24hours_google);
    const data_24hours_google = await response_24hours_google.json();

    let newpage_newdataURL_24hours_google = newdataURL_24hours_google + '&pageToken=' + data_24hours_google.nextPageToken

    const newpage_response_24hours_google = await fetch(newpage_newdataURL_24hours_google);
    const newpage_data_24hours_google = await newpage_response_24hours_google.json();

    let labels_24hours = [];
    let temperature_24hours = [];
    let temperature_24hours_google = []

    let hours_i = 1
    for (let i = 0; i < 25; i++){
        if (hours + hours_i >= 24){
            labels_24hours[i] = (hours+hours_i-24).toString() + ':00'
        }else{
            labels_24hours[i] = (hours+hours_i).toString() + ':00'
        }
        temperature_24hours[i] = data_24hours.hourly.temperature_2m[hours+hours_i]
        hours_i = hours_i + 1
    }

    for (let i = 1; i < data_24hours_google.forecastHours.length; i++) {
        temperature_24hours_google[i-1] = data_24hours_google.forecastHours[i].temperature.degrees;
    }
    temperature_24hours_google[temperature_24hours_google.length-1] = newpage_data_24hours_google.forecastHours[0].temperature.degrees

    const chartData_24hours = {
        labels: labels_24hours,
        datasets: [
            {
                name: "Temperature by Open-Meteo",
                values: temperature_24hours
            },
            {
                name: 'Temperature by Google',
                values: temperature_24hours_google
            }
        ]
    };

    this.chart_24hours = new frappe.Chart("#chart_24hours", {
        title: "Temperature in the next 24 hours",
        data: chartData_24hours,
        type: 'line',
        height: 450,
        colors: ['#ff0000', '#0000ff'],
    });

    try {
        const response_7days = await fetch(newdataURL_7days);
        const data_7days = await response_7days.json();

        let mean_temp_7days = [];
        let max_temp_7days = [];
        let min_temp_7days = [];

        for (let i = 0; i < 7; i++) {
            mean_temp_7days[i] = data_7days.properties.timeseries[i].data.next_24_hours.details.air_temperature_mean;
            max_temp_7days[i] = data_7days.properties.timeseries[i].data.next_24_hours.details.air_temperature_max;
            min_temp_7days[i] = data_7days.properties.timeseries[i].data.next_24_hours.details.air_temperature_min;
        }

        let labels_7days = [];
        for (let i = 0; i < 7; i++) {
            labels_7days[i] = data_7days.properties.timeseries[i].time.slice(0, 10);
        }
        const chartData_7days = {
            labels: labels_7days,
            datasets: [
                {
                    name: "Max temperature",
                    values: max_temp_7days
                },{
                    name: "Mean temperature",
                    values: mean_temp_7days
                },
                {
                    name: "Min temperature",
                    values: min_temp_7days
                }
            ]
        };
        this.chart_7days = new frappe.Chart("#chart_7days", {
            title: "Temperature in the next 7 days",
            data: chartData_7days,
            type: 'line',
            height: 450,
            colors: ['#ff0000', '#008000', '#0000ff'],
        });
    }catch{
    }
};

convertCelsiusButton.addEventListener('click', () => {
    if (this.temperature_type == 'Celsius') {
        return;
    }
    let str = temperature.innerText
    let numbers = str.match(/-?\d+.\d+/);

    let max_str = max_temperature.innerText
    let max_numbers = max_str.match(/-?\d+.\d+/);

    let min_str = min_temperature.innerText
    let min_numbers = min_str.match(/-?\d+.\d+/);

    if (this.temperature_type == 'Fahrenheit') {
        for (let i = 0; i < this.chart_24hours.data.datasets[0].values.length; i++) {
            this.chart_24hours.data.datasets[0].values[i] = parseFloat(((this.chart_24hours.data.datasets[0].values[i] - 32) * 5 / 9).toFixed(2));
            this.chart_24hours.data.datasets[1].values[i] = parseFloat(((this.chart_24hours.data.datasets[1].values[i] - 32) * 5 / 9).toFixed(2));
        }
        for (let i = 0; i < this.chart_7days.data.datasets[0].values.length; i++) {
            this.chart_7days.data.datasets[0].values[i] = parseFloat(((this.chart_7days.data.datasets[0].values[i] - 32) * 5 / 9).toFixed(2));
            this.chart_7days.data.datasets[1].values[i] = parseFloat(((this.chart_7days.data.datasets[1].values[i] - 32) * 5 / 9).toFixed(2));
            this.chart_7days.data.datasets[2].values[i] = parseFloat(((this.chart_7days.data.datasets[2].values[i] - 32) * 5 / 9).toFixed(2));
        }
        temperature.innerText = 'Temperature: ' + parseFloat(((parseFloat(numbers) -32) * 5 / 9).toFixed(2)) + ' Celsius'
        max_temperature.innerText = 'Highest temperature: ' + parseFloat(((parseFloat(max_numbers) -32) * 5 / 9).toFixed(2)) + ' Celsius'
        min_temperature.innerText = 'Lowest temperature: ' + parseFloat(((parseFloat(min_numbers) -32) * 5 / 9).toFixed(2)) + ' Celsius'
        convertFahrenheitButton.className = 'btn btn-outline-primary';
    }
    if (this.temperature_type == 'Kelvin') {
        for (let i = 0; i < this.chart_24hours.data.datasets[0].values.length; i++) {
            this.chart_24hours.data.datasets[0].values[i] = parseFloat((this.chart_24hours.data.datasets[0].values[i] - 273.15).toFixed(2));
            this.chart_24hours.data.datasets[1].values[i] = parseFloat((this.chart_24hours.data.datasets[1].values[i] - 273.15).toFixed(2));
        }
        for (let i = 0; i < this.chart_7days.data.datasets[0].values.length; i++) {
            this.chart_7days.data.datasets[0].values[i] = parseFloat((this.chart_7days.data.datasets[0].values[i] - 273.15).toFixed(2));
            this.chart_7days.data.datasets[1].values[i] = parseFloat((this.chart_7days.data.datasets[1].values[i] - 273.15).toFixed(2));
            this.chart_7days.data.datasets[2].values[i] = parseFloat((this.chart_7days.data.datasets[2].values[i] - 273.15).toFixed(2));
        }
        temperature.innerText = 'Temperature: ' + (parseFloat(numbers) - 273.15).toFixed(2) + ' Celsius'
        max_temperature.innerText = 'Highest temperature: ' + (parseFloat(max_numbers) - 273.15).toFixed(2) + ' Celsius'
        min_temperature.innerText = 'Lowest temperature: ' + (parseFloat(min_numbers) - 273.15).toFixed(2) + ' Celsius'
        convertKelvinButton.className = 'btn btn-outline-primary';
    }
    this.chart_7days.update();
    this.chart_24hours.update();
    this.temperature_type = 'Celsius';
    convertCelsiusButton.className = 'btn btn-primary';
});

convertFahrenheitButton.addEventListener('click', () => { 
    if (this.temperature_type == 'Fahrenheit') {
        return;
    }
    let str = temperature.innerText
    let numbers = str.match(/-?\d+.\d+/);

    let max_str = max_temperature.innerText
    let max_numbers = max_str.match(/-?\d+.\d+/);

    let min_str = min_temperature.innerText
    let min_numbers = min_str.match(/-?\d+.\d+/);

    if (this.temperature_type == 'Celsius') {
        for (let i = 0; i < this.chart_24hours.data.datasets[0].values.length; i++) {
            this.chart_24hours.data.datasets[0].values[i] = parseFloat((this.chart_24hours.data.datasets[0].values[i] * 9 / 5 + 32).toFixed(2));
            this.chart_24hours.data.datasets[1].values[i] = parseFloat((this.chart_24hours.data.datasets[1].values[i] * 9 / 5 + 32).toFixed(2));
        }
        for (let i = 0; i < this.chart_7days.data.datasets[0].values.length; i++) {
            this.chart_7days.data.datasets[0].values[i] = parseFloat((this.chart_7days.data.datasets[0].values[i] * 9 / 5 + 32).toFixed(2));
            this.chart_7days.data.datasets[1].values[i] = parseFloat((this.chart_7days.data.datasets[1].values[i] * 9 / 5 + 32).toFixed(2));
            this.chart_7days.data.datasets[2].values[i] = parseFloat((this.chart_7days.data.datasets[2].values[i] * 9 / 5 + 32).toFixed(2));
        }
        temperature.innerText = 'Temperature: ' + (parseFloat(numbers) * 9 / 5 + 32).toFixed(2) + ' Fahrenheit'
        max_temperature.innerText = 'Highest temperature: ' + (parseFloat(max_numbers) * 9 / 5 + 32).toFixed(2) + ' Fahrenheit'
        min_temperature.innerText = 'Lowest temperature: ' + (parseFloat(min_numbers) * 9 / 5 + 32).toFixed(2) + ' Fahrenheit'
        convertCelsiusButton.className = 'btn btn-outline-primary';
    }
    if (this.temperature_type == 'Kelvin') {
        for (let i = 0; i < this.chart_24hours.data.datasets[0].values.length; i++) {
            this.chart_24hours.data.datasets[0].values[i] = parseFloat(((this.chart_24hours.data.datasets[0].values[i]) * 9 / 5 - 459.67).toFixed(2));
            this.chart_24hours.data.datasets[1].values[i] = parseFloat(((this.chart_24hours.data.datasets[1].values[i]) * 9 / 5 - 459.67).toFixed(2));
        }
        for (let i = 0; i < this.chart_7days.data.datasets[0].values.length; i++) {
            this.chart_7days.data.datasets[0].values[i] = parseFloat(((this.chart_7days.data.datasets[0].values[i]) * 9 / 5 - 459.67).toFixed(2));
            this.chart_7days.data.datasets[1].values[i] = parseFloat(((this.chart_7days.data.datasets[1].values[i]) * 9 / 5 - 459.67).toFixed(2));
            this.chart_7days.data.datasets[2].values[i] = parseFloat(((this.chart_7days.data.datasets[2].values[i]) * 9 / 5 - 459.67).toFixed(2));
        }
        temperature.innerText = 'Temperature: ' + ((parseFloat(numbers) - 273.15) * 9 / 5 +32).toFixed(2) + ' Fahrenheit'
        max_temperature.innerText = 'Highest temperature: ' + ((parseFloat(max_numbers) - 273.15) * 9 / 5 +32).toFixed(2) + ' Fahrenheit'
        min_temperature.innerText = 'Lowest temperature: ' + ((parseFloat(min_numbers) - 273.15) * 9 / 5 +32).toFixed(2) + ' Fahrenheit'
        convertKelvinButton.className = 'btn btn-outline-primary';
    }
    this.chart_7days.update();
    this.chart_24hours.update();
    this.temperature_type = 'Fahrenheit';
    convertFahrenheitButton.className = 'btn btn-primary';
});

convertKelvinButton.addEventListener('click', () => {
    if (this.temperature_type == 'Kelvin') {
        return;
    } 
    let str = temperature.innerText
    let numbers = str.match(/-?\d+.\d+/);
    
    let max_str = max_temperature.innerText
    let max_numbers = max_str.match(/-?\d+.\d+/);

    let min_str = min_temperature.innerText
    let min_numbers = min_str.match(/-?\d+.\d+/);

    if (this.temperature_type == 'Celsius') {
        for (let i = 0; i < this.chart_24hours.data.datasets[0].values.length; i++) {
            this.chart_24hours.data.datasets[0].values[i] = parseFloat((this.chart_24hours.data.datasets[0].values[i] + 273.15));
            this.chart_24hours.data.datasets[1].values[i] = parseFloat((this.chart_24hours.data.datasets[1].values[i] + 273.15));
        }
        for (let i = 0; i < this.chart_7days.data.datasets[0].values.length; i++) {
            this.chart_7days.data.datasets[0].values[i] = parseFloat((this.chart_7days.data.datasets[0].values[i] + 273.15));
            this.chart_7days.data.datasets[1].values[i] = parseFloat((this.chart_7days.data.datasets[1].values[i] + 273.15));
            this.chart_7days.data.datasets[2].values[i] = parseFloat((this.chart_7days.data.datasets[2].values[i] + 273.15));
        }
        temperature.innerText = 'Temperature: ' + (parseFloat(numbers) + 273.15).toFixed(2) + ' Kelvin'
        max_temperature.innerText = 'Highest temperature: ' + (parseFloat(max_numbers) + 273.15).toFixed(2) + ' Kelvin'
        min_temperature.innerText = 'Lowest temperature: ' + (parseFloat(min_numbers) + 273.15).toFixed(2) + ' Kelvin'
        convertCelsiusButton.className = 'btn btn-outline-primary';
    }
    if (this.temperature_type == 'Fahrenheit') {
        for (let i = 0; i < this.chart_24hours.data.datasets[0].values.length; i++) {
            this.chart_24hours.data.datasets[0].values[i] = parseFloat(((this.chart_24hours.data.datasets[0].values[i] + 459.67) * 5 / 9).toFixed(2));
            this.chart_24hours.data.datasets[1].values[i] = parseFloat(((this.chart_24hours.data.datasets[1].values[i] + 459.67) * 5 / 9).toFixed(2));
        }
        for (let i = 0; i < this.chart_7days.data.datasets[0].values.length; i++) {
            this.chart_7days.data.datasets[0].values[i] = parseFloat(((this.chart_7days.data.datasets[0].values[i] + 459.67) * 5 / 9).toFixed(2));
            this.chart_7days.data.datasets[1].values[i] = parseFloat(((this.chart_7days.data.datasets[1].values[i] + 459.67) * 5 / 9).toFixed(2));
            this.chart_7days.data.datasets[2].values[i] = parseFloat(((this.chart_7days.data.datasets[2].values[i] + 459.67) * 5 / 9).toFixed(2));
        }
        temperature.innerText = 'Temperature: ' + ((parseFloat(numbers) - 32) * 5 / 9 + 273.15).toFixed(2) + ' Kelvin'
        max_temperature.innerText = 'Highest temperature: ' + ((parseFloat(max_numbers) - 32) * 5 / 9 + 273.15).toFixed(2) + ' Kelvin'
        min_temperature.innerText = 'Lowest temperature: ' + ((parseFloat(min_numbers) - 32) * 5 / 9 + 273.15).toFixed(2) + ' Kelvin'
        convertFahrenheitButton.className = 'btn btn-outline-primary';
    }
    this.chart_7days.update();
    this.chart_24hours.update();
    this.temperature_type = 'Kelvin';
    convertKelvinButton.className = 'btn btn-primary';
});

const geoLocate = async () => {
    try{
        let newgeodataURL = geodataURL.replace('{address}', address.value);
        const response_geo = await fetch(newgeodataURL);
        const data_geo = await response_geo.json();
        latInput.value = data_geo.results[0].geometry.location.lat;
        lonInput.value = data_geo.results[0].geometry.location.lng;
        getData();
    }catch{
        r_geoLocate();
    }
};

const r_geoLocate = async () => {
    let newr_geodataURL = r_geodataURL.replace('{lat}', latInput.value).replace('{lon}', lonInput.value);
    const response_r_geo = await fetch(newr_geodataURL);
    const data_r_geo = await response_r_geo.json();
    address.value = data_r_geo.results[0].formatted_address;
    getData();
};

favourite_button.addEventListener('click', () => {
    if (image.src == ''){
        return;
    }
    var rows = document.querySelectorAll("#table tr");
    
    let newRow = document.createElement('tr');
    let locationCell = document.createElement('td');
    let descriptionCell = document.createElement('td')
    let tempCell = document.createElement('td');
    let max_tempCell = document.createElement('td');
    let min_tempCell = document.createElement('td');
    let windCell = document.createElement('td')
    let imageTD = document.createElement('td')
    let imageCell = document.createElement('img');

    locationCell.innerText = address.value;
    descriptionCell.innerText = description.innerText
    tempCell.innerText = temperature.innerText;
    max_tempCell.innerText = max_temperature.innerText;
    min_tempCell.innerText = min_temperature.innerText;
    windCell.innerText = wind_speed.innerText
    imageCell.src = document.getElementById('icon').src

    imageCell.width = 64;
    imageCell.height = 64;
    newRow.appendChild(locationCell);
    newRow.appendChild(descriptionCell)
    newRow.appendChild(tempCell);
    newRow.appendChild(max_tempCell)
    newRow.appendChild(min_tempCell)
    newRow.appendChild(windCell)
    imageTD.appendChild(imageCell);
    newRow.appendChild(imageTD);

    const tableBody = document.getElementById('table');
    for (let row of rows) {
        if (row.cells[0].innerText == address.value) {
            row.remove();
            tableBody.appendChild(newRow);
            return;
        }
    }
    tableBody.appendChild(newRow);
});

delete_top_button.addEventListener('click', () => {
    var rows = document.querySelectorAll("#table tr");
    rows[0].remove()
});

delete_bottom_button.addEventListener('click', () => {
    var rows = document.querySelectorAll("#table tr");
    rows[rows.length-1].remove()
});

delete_all_button.addEventListener('click', () => {
    var rows = document.querySelectorAll("#table tr");
    for (let row of rows) {
        row.remove();
    }
});

search_button.addEventListener('click', ()   => {
    if (latInput.value == '' && lonInput.value == '' && address.value == '') {
        return;
    }else if (address.value == ''){
        r_geoLocate();
    }else {
        geoLocate();
    }
});

QR_button.addEventListener('click', () => {
    if (image.src == ''){
        if (latInput.value == '' && lonInput.value == '' && address.value == '') {
            return;
        }else if (address.value == ''){
            r_geoLocate();
        }else {
            geoLocate();
        }
    }
    window.location.href = 'QR.html';
});

export_24hours_button.addEventListener('click', () => {
    if (image.src == ''){
        return;
    }
    this.chart_24hours.export()
})

export_7days_button.addEventListener('click', () => {
    if (image.src == ''){
        return;
    }
    this.chart_7days.export()
})

function handleForm(event) {
    event.preventDefault();
}

form.addEventListener('submit', handleForm)


changeBackground_dark();
