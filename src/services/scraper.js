import puppeteer from 'puppeteer'
import {getRandom} from 'random-useragent'

export default async (provider) => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    })

    const page = await browser.newPage()

    await page.setUserAgent(getRandom(function (ua) {
        return parseFloat(ua.browserVersion) >= 60;
    }));

    await page.goto(provider.url)

    await page.setViewport({
        width: 1200,
        height: 800
    });

    await autoScroll(page);

    let content = await page.content()

    if (provider.parse && typeof provider.parse === 'function') {
        content = await provider.parse(page)
    }

    await browser.close()

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
