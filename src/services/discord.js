import Discord from 'discord.js'
import {createOrUpdateJob, deleteJobFromDiscord} from './jobs';
import {providers} from '../providers';

export const client = new Discord.Client()
export const getDiscordChannel = () => client.channels.cache.get(process.env.DISCORD_CHANNEL)

client.on('ready', async () => {
    await client.user.setPresence({
        activity: { name: 'les offres d\'emploi 🔍', type: 'WATCHING' }, status: 'idle'
    })
    await getDiscordChannel().fetch(true)
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageReactionAdd', (reaction, user) => {
    const message = reaction.message
    if (!message) return
    const channel = message.channel
    const emoji = reaction.emoji

    if (channel.id !== getDiscordChannel().id || user.id !== '137329125223301130') return

    if (emoji.name === '❌') {
        deleteJobFromDiscord(message.id).then(() => message.delete().catch((err) => console.error('Could not delete job on discord: ' + err))).catch((err) => console.error('Could not delete job from discord on mongodb: ' + err))
    }
});


/**
 *
 * @param {ScraperProvider} provider
 * @param job
 * @returns {Promise<void>}
 */
export async function addOrUpdateDiscordJob(provider,job) {
    const channel = getDiscordChannel()
    const embed = constructEmbed(job)
    if (!job.discord_id) {
        channel.send(embed).then(async (message) => {
            await message.react('❌')
            job.discord_id = message.id
            await createOrUpdateJob(provider, job).catch((err) => console.error('Could not update job discord_id on mongodb: ' + err))
        }).catch((err) => console.error('Could not send message on discord: ' + err))
    } else {
        channel.messages.fetch(job.discord_id).then(async (message) => {
            await message.react('❌')
            await message.edit(embed)
        }).catch((err) => console.error('Could not edit message on discord: ' + err))
    }
}

/**
 * @param job
 * @returns {module:"discord.js".MessageEmbed}
 */
function constructEmbed(job) {
    const provider = providers.find((provider) => provider.source === job.source)
    const embed = new Discord.MessageEmbed()
    embed.setURL(job.link)
    embed.setTitle(job.title)
    embed.setFooter(provider.name, provider.logo)
    embed.setTimestamp(job.created_at)
    embed.addField('Entreprise', job.company)
    embed.addField('Type', job.type, true)
    embed.addField('Ville', job.location, true)
    embed.setThumbnail(job.company_logo)
    return embed
}
