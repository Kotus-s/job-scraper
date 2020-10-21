import puppeteer from 'puppeteer'
import {getRandom} from 'random-useragent'

export default async (provider) => {
    return new Promise(async (success, failure) => {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--shm-size=3gb'],
            headless: true
        })

        const page = await browser.newPage()

        await page.setUserAgent(getRandom(function (ua) {
            return parseFloat(ua.browserVersion) >= 60;
        }));

        await page.goto(provider.url, {waitUntil: 'networkidle2'})

        await page.setViewport({
            width: 1200,
            height: 800
        });

        await autoScroll(page);

        await page.screenshot({path: 'example.png'});

        if (provider.parse && typeof provider.parse === 'function') {
            success(await provider.parse(page).catch(failure))
        }

        await page.close()
        await browser.close()
    })
}

async function autoScroll(page){
    await page.evaluate(`(async() => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0
            let distance = 100
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight
                window.scrollBy(0, distance)
                totalHeight += distance
    
                if(totalHeight >= scrollHeight){
                    clearInterval(timer)
                    resolve()
                }
            }, 100)
        })
    })()`);
}
