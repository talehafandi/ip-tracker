console.log('Hello There');
let defLat = 37.38605;
let defLng = -122.08385;

let map = L.map('mapid').setView([defLat, defLng], 12);

L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=TrQ0x1elMQSVKqK6VGHw', 
            {
                attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(map);

// let marker = L.marker([defLat, defLng], {draggable: true});
// marker.addTo(map);

let marker = L.marker([defLat, defLng], {draggable: false});
marker.addTo(map);
const markerList = [marker];

function mapFly(lat, lng) {
    map.flyTo([lat, lng], 12, {
        animated: true,
        duration: 4
    });
    let mark = L.marker([lat, lng], {draggable: false});
    mark.addTo(map); // create new marker and add to the map
    markerList.push(mark); // add it to the list
    map.removeLayer(markerList[0]); // remove old marker from the map
    markerList.shift(markerList[0]) // remove old marker from the list
}

let geoApiKey = 'GET_YOUR_API_KEY'; //https://geo.ipify.org/
let ipAddress = '8.8.8.8';

//Patterns 
const domainPattern= /[www.]?.+\.com(\.[a-z]+)?/g;
const ipPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/g;

const input = document.querySelector('#form-input');
const form = document.querySelector('.form')
const ipTag = document.querySelector('#ip-address');
const locationTag = document.querySelector('#location');
const timezoneTag = document.querySelector('#timezone');
const ispTag = document.querySelector('#isp');


async function fetchByIp(ipAddress) {
    let json = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_jJBqy2w9IGerhBCAVyMGTiAwkqYlB&ipAddress=${ipAddress}`);
    let data = await json.json();
    // console.log(data);
    return data;
}

async function fetchByDomain(domain) {
    let json = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_jJBqy2w9IGerhBCAVyMGTiAwkqYlB&domain=${domain}`);
    let data = await json.json();
    // console.log(data);
    return data;
}

async function loadData(value) {
    try {
        let data;
        if (ipPattern.test(value)) {
            console.log('ip pattern');
            data = await fetchByIp(value);
        }
        if (domainPattern.test(value)) {
            // console.log('domain pattern');
            data = await fetchByDomain(value);
        }
        console.log(data);
        if (data) {
            let {ip} = data;
            let {country, region, city, timezone, lat, lng} = data.location;
            let {isp} = data;

            ipTag.innerText = ip;
            locationTag.innerText = `${city}, ${country}, ${region}`;
            timezoneTag.innerText = timezone;
            ispTag.innerText = isp;
        
            mapFly(lat, lng);
        }
        else{
            alert('Please try again');
        }
        // console.log(data);
    } catch (error) {
        console.log(error);
    }
}


form.addEventListener('submit', (e)=>{
    e.preventDefault();
    loadData(input.value)
    // console.log(input.value);

})

// let res = await fetchData(ipAddress);
// console.log(res);

