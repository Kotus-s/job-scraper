import {connect, createOrUpdateJob} from './src/services/jobs'
import {addOrUpdateDiscordJob, client} from './src/services/discord'
import {providers} from './src/providers'

connect(process.env.MONGO_URL).then(() => {
    client.login(process.env.DISCORD_TOKEN).then((r) => {
        providers.forEach((provider) => {
            provider.scrape().then((jobs) => {
                jobs.forEach((job) => {
                    createOrUpdateJob(provider, job).then((job) => addOrUpdateDiscordJob(provider, job)).catch(console.error)
                })
            }).catch(console.error)
        })
    })
})
