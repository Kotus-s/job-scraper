import {createOrUpdateJob} from '../services/jobs'
import {addOrUpdateDiscordJob} from '../services/discord'

export default class WelcomeToTheJungleProvider {
    constructor() {
        this.url = 'https://www.welcometothejungle.com/fr/jobs?page=1&query=developer&page=1&aroundQuery=Rennes%2C+France&aroundLatLng=48.10804%2C-1.68449&aroundRadius=50000&sortBy=mostRecent'
        this.source = 'wttj'
    }

    async parse(page) {
        try {
            const jobs = await page.$$('ul[data-testid=jobs-search-search-results] > li > article')
            // Make non blocking parsing for each job
            for (const job of jobs) {
                const title = await job.$eval('div > header > a > h3', el => el.innerText)
                const company = await job.$eval('div > header > h4', el => el.innerText)
                const href = await job.$eval('div > header > a', el => el.href)
                const company_logo = await job.$eval('div > div > img', el => el.src)
                const infos = await job.$$eval('div > header > ul > li', options => options.map((el) => el.innerText).slice(0, 2))
                const created_at = new Date(await job.$eval('div > header > ul > li > span > time', el => el.getAttribute('datetime')))

                // TODO: Return list of object formatted correctly. Scraper need to get all job and sort them by date before adding them to discord
                // TODO: Compute score of the job with a scorer service

                createOrUpdateJob(this, {
                    title,
                    company,
                    link: href,
                    source: this.source,
                    company_logo,
                    type: infos[0],
                    created_at,
                    location: infos[1]
                }).then((job) => addOrUpdateDiscordJob(this, job)).catch(console.error)
            }

        } catch(e) {
            // Better error handling
            console.error(e)
        }
    }
}

