import puppeteer from 'puppeteer'

export default async (provider) => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: true
    })

    const page = await browser.newPage()
    await page.goto(provider.url)

    let content = await page.content()

    if (provider.parse && typeof provider.parse === 'function') {
        content = await provider.parse(page)
    }

    await browser.close()

    return content
}
