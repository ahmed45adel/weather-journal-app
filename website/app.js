
// full url -> api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={your api key}
const API_key = '&appid=62fab54a1c570e24de871ff22c7a85d8';
const API_base = 'https://api.openweathermap.org/data/2.5/weather?'


/* Global Variables */
const zipCode = document.getElementById('zip');
const feelings = document.getElementById('feelings');
const country = document.getElementById('country');
const generate = document.getElementById('generate');
const dateEntry = document.getElementById('date');
const tempEntry = document.getElementById('temp');
const contentEntry = document.getElementById('content');

//modal
const modalContainer = document.querySelector('.modal_container');
const modal = document.querySelector('.modal p');
const modal_close = document.querySelector('.modal_close');

const userData = {};
let errors = '';

// Create a new date instance dynamically with template literals
let d = new Date();
let newDate = `${d.getMonth() + 1}  .  ${d.getDate()}  .  ${d.getFullYear()}`;


const postData = async (url = '', data = {}) => {
    // post data
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        // Body data type must match "Content-Type" header        
        body: JSON.stringify(data),
    });
    // try-catch
    try {
        const newData = await response.json();
        console.log(newData);
        return newData;
    } catch (error) {
        console.log("error", error);
        generateModal('Something went wrong please try again.')
    }
}

// inputs validation before fetching temprature data from openweathermap api
const checkInvalidity = () => {
    const invalid_zipCode = zipCode.value == '' || isNaN(Number(zipCode.value));
    const invalid_feeling = feelings.value.trim().length < 3;
    const ivalid_countryCode = (country.value.trim().length != 2 || country.value.match(/[0-9]/g) != null);

    // wrong zip code or empty, invalid country code or empty and empty feelings
    if (invalid_feeling && ivalid_countryCode && (invalid_zipCode)) {
        errors = 'Please add a valid zip/postal code number, two letters country code and describe your feeling';
        generateModal(errors);
        console.log(errors)

        // wrong zip code, invalid country code or empty and valid feelings
    } else if ((invalid_zipCode) && ivalid_countryCode) {
        errors = 'Please enter a valid zip/postal code number andtwo letters country code';
        generateModal(errors);
        console.log(errors)

        // valid zip code, invalid country code or empty and empty feelings
    } else if (invalid_feeling && ivalid_countryCode) {
        errors = 'Please describe your feeling and add two letters country code';
        generateModal(errors);
        console.log(errors)

        // wrong zip code or empty, valid country code and feelings
    } else if ((invalid_zipCode)) {
        errors = 'Please enter a valid zip/postal code number';
        generateModal(errors);
        console.log(errors)

        // invalid  country code , valid zip code and feelings
    } else if (ivalid_countryCode) {
        errors = 'Please enter a valid two letters country code';
        generateModal(errors);
        console.log(errors)

        // invalid  feelings , valid  country codezip code
    } else if (invalid_feeling) {
        errors = 'Please describe your feeling';
        generateModal(errors);
        console.log(errors)
    } else {
        errors = '';
    }
}

// fetching temprature data from openweathermap api
const getWeatherData = async (url = '', data = {}) => {

    // inputs validation before fetching temprature data from openweathermap api
    checkInvalidity();

    // if all inputs data are valid > fetching temprature data
    if (errors == '') {

        // const Full_URL = `${API_base}zip=${zipCode.value},${(country.value).toLowerCase()}&appid=${API_key}`;
        const zip_code = `zip=${zipCode.value},`;
        const country_code = `${(country.value).toLowerCase()}`;
        const response = await fetch(API_base + zip_code + country_code + API_key);

        try {
            const newData = await response.json();
            // set the input data to post them
            userData.zipCode = zipCode.value;
            userData.country = country.value;
            userData.feelings = feelings.value;
            userData.temperature = `${(newData.main.temp - 273.15).toFixed(1)} °C`;
            userData.date = newDate;

            // post data to server
            postData('/projectData', userData).then(updateUI('/projectData'))

            return newData;

        } catch (error) {
            console.log("error", error);
            generateModal('Something went wrong please try again later.')
        }
    }
}
// updating UI
const updateUI = async (url = '', data = {}) => {
    const response = await fetch(url);
    try {
        const newData = await response.json();
        dateEntry.innerHTML = newData.date;
        tempEntry.innerHTML = newData.temperature;
        contentEntry.innerHTML = `<p>country ${newData.country}.</p> <p>feelings: ${newData.feelings}</p> <p>zipCode: ${newData.zipCode}</p>`
        console.log('UI', newData);

    } catch (error) {
        console.log("error", error);
        generateModal('Something went wrong please try again later.')
    }

}

// inputs click event
generate.addEventListener('click', getWeatherData)

const generateModal = (errormsg) => {
    modal.innerHTML = errormsg;
    modalContainer.style.display = 'block';
}

modal_close.addEventListener('click', (e) => {
    modalContainer.style.display = 'none';
})