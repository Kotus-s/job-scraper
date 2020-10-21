import {createOrUpdateJob} from '../services/jobs'
import {addOrUpdateDiscordJob} from '../services/discord'
import ScraperProvider from "./ScraperProvider";

export default class WelcomeToTheJungleProvider extends ScraperProvider {
    constructor() {
        super({
            name: 'WelcomeToTheJungle',
            source: 'wttj',
            url: 'https://www.welcometothejungle.com/fr/jobs?page=1&query=developer&page=1&aroundQuery=Rennes%2C+France&aroundLatLng=48.10804%2C-1.68449&aroundRadius=50000&sortBy=mostRecent',
            logo: 'https://pbs.twimg.com/profile_images/1276052731481010185/-qW6vD_H_400x400.jpg'
        })
    }

    async parse(page) {
        const jobsPage = await page.$$('ul[data-testid=jobs-search-search-results] > li > article')
        const jobs = []

        // Make non blocking parsing for each job
        for (const jobPage of jobsPage) {
            const infos = await jobPage.$$eval('div > header > ul > li', options => options.map((el) => el.innerText).slice(0, 2))
            jobs.push({
                title: await jobPage.$eval('div > header > a > h3', el => el.innerText),
                company: await jobPage.$eval('div > header > h4', el => el.innerText),
                link: await jobPage.$eval('div > header > a', el => el.href),
                source: this.source,
                company_logo: await jobPage.$eval('div > div > img', el => el.src),
                type: infos[0],
                created_at: new Date(await jobPage.$eval('div > header > ul > li > span > time', el => el.getAttribute('datetime'))),
                location: infos[1]
            })

            // TODO: Return list of object formatted correctly. Scraper need to get all job and sort them by date before adding them to discord
            // TODO: Compute score of the job with a scorer service
        }

        return jobs
    }
}

