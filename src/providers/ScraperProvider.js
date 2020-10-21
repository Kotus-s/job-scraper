import scraper from '../services/scraper';

export default class ScraperProvider {

    constructor(options) {
        this.name = options.name
        this.source = options.source
        this.url = options.url
        this.logo = options.logo
    }

    scrape() {
        return scraper(this)
    }

}
