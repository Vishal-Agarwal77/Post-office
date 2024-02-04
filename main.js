const ip_info = document.getElementById("ip-info");
const lat = document.getElementById("Lat-info");
const city = document.getElementById("city-info");
const organisation = document.getElementById("Organisation-info");
const long = document.getElementById("long-info");
const region = document.getElementById("region-info");
const hostname = document.getElementById("hostname-info");
const IP = sessionStorage.getItem("ip");
const postal = document.getElementById("pincode");
const post_offices_content = document.getElementsByClassName("post-offices-content")[0];
const message = document.getElementById("message");
const time_zone = document.getElementById("time-zone");
const date_time=document.getElementById("date-time");

ip_info.innerHTML = IP;
let postoffice_data;

function displayPostOffice(items) {
    for (let el of items) {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
        <div class="card-info">
                    <div class="card-info-head">
                        Name : 
                    </div>
                    <div class="card-info-content">
                        ${el.Name}
                    </div>
                </div>
                <div class="card-info">
                    <div class="card-info-head">
                        Branch Type : 
                    </div>
                    <div class="card-info-content">
                        ${el.BranchType}
                    </div>
                </div>
                <div class="card-info">
                    <div class="card-info-head">
                        Delivery Status :
                    </div>
                    <div class="card-info-content">
                        ${el.DeliveryStatus}
                    </div>
                </div>
                <div class="card-info">
                    <div class="card-info-head">
                        District :
                    </div>
                    <div class="card-info-content">
                        ${el.District}
                    </div>
                </div>
                <div class="card-info">
                    <div class="card-info-head">
                        Division :
                    </div>
                    <div class="card-info-content">
                        ${el.Division}
                    </div>
                </div>`;
        post_offices_content.appendChild(div);
    }
}

async function getinfo() {
    const response = await fetch(`http://ip-api.com/json/${IP}`);
    const data = await response.json();
    console.log(data);
    lat.innerHTML = data.lat;
    city.innerHTML = data.city;
    organisation.innerHTML = data.isp;
    long.innerHTML = data.lon;
    region.innerHTML = data.regionName;
    postal.innerHTML = data.zip;
    time_zone.innerHTML = data.timezone;
    let datetime_str = new Date().toLocaleString("en-US", { timeZone: data.timeZone });
    date_time.innerHTML=datetime_str;
    getpostoffices(data.zip);
    showMap(data);
}

async function showMap(data) {
    let lat = data.lat;
    let long = data.lon;
    let linkUrl = "http://maps.google.com?q=" + lat + ", " + long;
    let embedMap = document.getElementById("map");
    embedMap.src = linkUrl + "&z=15&output=embed";
}


async function getpostoffices(pincode) {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();
    console.log(data);
    message.innerHTML = data[0].Message;
    postoffice_data = data[0].PostOffice;
    displayPostOffice(postoffice_data);
}

function debounce(func, delay = 300) {
    let timerid;
    return (...args) => {
        clearTimeout(timerid);
        timerid = setTimeout(() => {
            func(...args);
        }, delay);
    }
}
const search_box = document.getElementById("search");
function filterpostoffice() {
    post_offices_content.innerHTML = ``;
    const search = document.getElementById("search").value.toUpperCase();
    console.log(search);
    const temp_data = postoffice_data.filter((el) => {
        return el.Name.toUpperCase().includes(search) || el.BranchType.toUpperCase().includes(search);
    });
    displayPostOffice(temp_data);
}
const debounced = debounce(filterpostoffice);
search_box.addEventListener("keyup", debounced);
getinfo();
