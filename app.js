import WelcomeToTheJungleProvider from './src/providers/welcometothejungle'
import scraper from './src/services/scraper';
import { connect } from './src/services/jobs';
import { client } from './src/services/discord'

connect(process.env.MONGO_URL).then(() => {
    client.login(process.env.DISCORD_TOKEN).then((r) => {
        scraper(new WelcomeToTheJungleProvider()).catch(console.error);
    })
})
