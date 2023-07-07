class SearchResult {

    constructor(resultsContainer) {
        this.resultsContainer = resultsContainer;
    }


    async fetchProfile(symbols) {
        let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbols}`;
    
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.companyProfiles;
        } catch (error) {
            console.log(error);
        };
    }

    
    async highlightStrings(input, compData) {

        const compDataLowercase = compData.toLowerCase()

        if (!compDataLowercase.includes(input)) return compData

        const startingindex = compDataLowercase.indexOf(input)
        const endingIndex = startingindex + input.length
    
        const spanStart = '<span class="highlight">'
        const spanEnd = '</span>'
        
        return compData.slice(0, startingindex) + spanStart + compData.slice(startingindex, endingIndex) + spanEnd + compData.slice(endingIndex, compData.length - 1)
    
    }


    calcStockChanges = async (value) => {
        let roundedValue = parseFloat(value).toFixed(2);
        let newSpan = document.createElement('span');

        if (value > 0) {
            newSpan.innerText = `+${roundedValue}`;
            newSpan.classList.add('changes-positive', 'results-stock-changes');
        } else if (value < 0) {
            newSpan.innerText = roundedValue;
            newSpan.classList.add('changes-negative', 'results-stock-changes');
        } else {
            newSpan.innerText = Math.floor(value);
            newSpan.classList.add('results-stock-changes');
        }
        return newSpan;
    }

    async renderResults(companies) {

        this.resultsContainer.innerHTML = '';
        this.resultsContainer.classList.add('loader');
        this.resultsContainer.classList.add("results-container");  

        const companiesProfileArray = await this.fetchProfile(companies.map(({symbol}) => (symbol)))
        const searchInput = document.getElementById("searchInput");

        this.resultsContainer.classList.remove('loader');
    
        if (companiesProfileArray == undefined) return
        for (let i = 0; i < companiesProfileArray.length; i++) {
            const resultsItem = document.createElement('div');
            const imgCode = document.createElement('img');
            const nameCode = document.createElement('a');
            const symbolCode = document.createElement('div');
            const stockCode = await this.calcStockChanges(companiesProfileArray[i].profile.changesPercentage);
            const symbolAndStockCode = document.createElement('div');
    
            nameCode.setAttribute('href', `./company.html?symbol=${companiesProfileArray[i].symbol}`);
            nameCode.setAttribute('target', '_blank');
    
            resultsItem.classList.add('results-item');
            imgCode.classList.add("results-img");
            nameCode.classList.add("results-link");
            symbolAndStockCode.classList.add("results-symbol-percentage");
    
            imgCode.src = companiesProfileArray[i].profile.image;
            nameCode.innerHTML = await this.highlightStrings(searchInput.value, companiesProfileArray[i].profile.companyName);
            symbolCode.innerHTML = await this.highlightStrings(searchInput.value, companiesProfileArray[i].symbol);

            symbolAndStockCode.append(symbolCode, stockCode);
            resultsItem.append(imgCode, nameCode, symbolAndStockCode);
            this.resultsContainer.appendChild(resultsItem);
    
            if (companiesProfileArray.length > i + 1) {
            const newLineDiv = document.createElement('div');
            newLineDiv.classList.add('results-line');
            this.resultsContainer.appendChild(newLineDiv);
            }
        }
    }
}