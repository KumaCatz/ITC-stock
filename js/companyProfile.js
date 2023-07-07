const marqueeContainer = document.getElementById('marquee-container');
const symbolString = new URLSearchParams(window.location.search).get('symbol');
const logoImgDiv = document.getElementById('logoImage');
const compName = document.getElementById('compName');
const compDescrip = document.getElementById('description');
const compWebsiteDiv = document.getElementById('compWebsiteDiv');
const compChart = document.getElementById('compChart');
const stockCurrent = document.getElementById('stockCurrent');
const stockChangesProfile = document.getElementById('stockChangesProfile');


async function fetchProfile(symbol) {
    let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    };
}

async function fetchHistory() {
    const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbolString}?serietype=line`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.historical;
    } catch (error) {
        console.log(error);
    };
}


const calcStockChanges = (value) => {

    if (value > 0) {
        stockChangesProfile.classList.add('changes-positive');
        value = `+${value}`;
    } else if (value < 0) {
        stockChangesProfile.classList.add('changes-negative');
    } else {
        value = Math.floor(value);
    }
    return parseFloat(value).toFixed(2);

}

function createChart(historyArray) {

    const perSegment = Math.floor(historyArray.length / 20);
    let newArray = historyArray.slice();
    let array = [];
    for (i = 0; i < 20; i++) {
        array[i] = newArray.splice(0, perSegment);
    };

    const labels = array.slice(0, 20).map(item => item[0].date).reverse();
    const data = array.slice(0, 20).map(item => item[0].close).reverse();
  
    new Chart(compChart, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
        fill: true,
        label: 'Stock Price History',
        data: data,
        borderWidth: 1
        }]
    },
    options: {
        scales: {
        y: {
            beginAtZero: true
        }
        }
    }
});
}

function showValue(data) {
    const logoImg = document.createElement('img');
    const compWebsite = document.createElement('a');

    logoImg.classList.add("logo-image");

    logoImg.src = data.image;
    compWebsite.href = data.website;
    
    if (data.industry == null) {
        compName.innerHTML = `${data.companyName}`;
    } else {
        compName.innerHTML = `${data.companyName}: ${data.industry}`;
    }
    compDescrip.innerText = data.description;
    compWebsiteDiv.innerHTML = data.website;

    logoImgDiv.appendChild(logoImg);
    compWebsiteDiv.appendChild(compWebsite);
}

async function showStockHistory(data) {
    stockCurrent.innerText = `Stock price: $${data[0].close}`;
    stockChangesProfile.innerText = `(${await calcStockChanges(data[0].close - data[1].close)}%)`;
}


async function mainCompValue() {
    (logoImgDiv, compName, compDescrip, compWebsiteDiv).classList.add('loader');
    const resultProfile = await fetchProfile(symbolString);
    (logoImgDiv, compName, compDescrip, compWebsiteDiv).classList.remove('loader');

    showValue(resultProfile.profile);

    (stockCurrent, stockChangesProfile, compChart).classList.add('loader');
    const resultHistory = await fetchHistory();
    (stockCurrent, stockChangesProfile, compChart).classList.remove('loader');
    showStockHistory(resultHistory);

    createChart(resultHistory);
}


window.addEventListener('load', async () => {
    mainCompValue();
})
