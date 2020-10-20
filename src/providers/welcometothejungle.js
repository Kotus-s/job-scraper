import {createOrUpdateJob} from "../services/jobs";

export default class WelcomeToTheJungleProvider {
    constructor() {
        this.url = 'https://www.welcometothejungle.com/fr/jobs?page=1&query=developer&page=1&aroundQuery=Rennes%2C+France&aroundLatLng=48.10804%2C-1.68449&aroundRadius=50000&sortBy=mostRecent'
    }

    async parse(page) {
        try {
            const jobs = await page.$$('ul[data-testid=jobs-search-search-results] > li > article > div > header')

            for (const job of jobs) {
                const title = await job.$eval('a > h3', el => el.innerText)
                const company = await job.$eval('h4', el => el.innerText)
                const href = await job.$eval('a', el => el.href)

                createOrUpdateJob({
                    title,
                    company,
                    link: href,
                    source: 'wttj'
                }).then(console.log).catch(console.error)
                // TODO: Create job on discord
            }

        } catch(e) {
            console.error(e)
        }
    }
}

