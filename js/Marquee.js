class Marquee {

    constructor (marqueeContainer) {
        this.marqueeContainer = marqueeContainer;
    }

    url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/nyse`

    async fetch() {

        try {
            const response = await fetch(this.url);
            const data = await response.json();       
            return data
        } catch (error) {
            console.log(error);
        }}

    async load() {

        const marqueeArray = await this.fetch();
        const marquee = document.createElement('div');

        marquee.classList.add("marquee");
        this.marqueeContainer.classList.add("marquee-container");

        let filteredArray = marqueeArray.map(({symbol, price}) => 
        `${symbol}:<span class="changes-positive">${price}</span>`
        ).join(' ');
        
        marquee.innerHTML = filteredArray;
    
        this.marqueeContainer.appendChild(marquee);

    }
}