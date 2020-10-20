import WelcomeToTheJungleProvider from './src/providers/welcometothejungle'
import scraper from './src/services/scraper';
import { connect } from './src/services/jobs';


connect(process.env.MONGO_URL).then(() => {
    scraper(new WelcomeToTheJungleProvider()).catch(console.error)
})
