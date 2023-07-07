class SearchForm {
    searchInput = document.createElement("input");
    searchBtn = document.createElement("button");
    queryString = new URLSearchParams(window.location.search).get('query');
    results = new SearchResult(document.getElementById("results"));

    constructor(formContainer) {
        this.formContainer = formContainer;
        this.buildDOM();
        this.buildEventListeners();
    }


    buildDOM() {

        this.formContainer.innerHTML = ''

        this.searchInput.id = "searchInput";
        this.searchBtn.id = "searchBtn";

        if (this.queryString != null) this.searchInput.value = `${this.queryString}`;    
        this.searchInput.type = "search";
        this.searchInput.placeholder = "Search for company stock symbol";
        this.searchBtn.innerText = "Search";

        this.searchInput.classList.add("search-input");
        this.searchBtn.classList.add("search-btn");
        this.formContainer.classList.add("search-container");


        this.formContainer.appendChild(this.searchInput);
        this.formContainer.appendChild(this.searchBtn);
    
    }

    
    callSearch() {
        this.onSearch(async (companies) => {
            await this.results.renderResults(companies);
        })
    }

    debounce(func, timeout) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, timeout)
        }
    }

    debounceCallback = this.debounce(this.callSearch, 500)

    buildEventListeners() {
        searchBtn.addEventListener('click', () => {
            this.callSearch();
        })
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.callSearch();
            } else {
                this.debounceCallback();
            }
        })
    }
    
    
    async fetchSearchInput() {
        let url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=` + this.searchInput.value + `&limit=10&exchange=NASDAQ`;
    
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    }


    async onSearch(render) {
        if (this.queryString == null && this.searchInput.value == "") return
        window.history.pushState({}, "", `./index.html?query=${this.searchInput.value}`);

        const fetchCompanies = await this.fetchSearchInput();

        render(fetchCompanies)
    }
}