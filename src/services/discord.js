import Discord from 'discord.js'
import {createOrUpdateJob} from './jobs';

export const client = new Discord.Client();
export const getDiscordChannel = () => client.channels.cache.get(process.env.DISCORD_CHANNEL)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setPresence({
        activity: { name: 'les offres d\'emploi 🔍', type: 'WATCHING' }, status: 'idle'
    })
});


/**
 *
 * @param provider
 * @param job
 * @returns {Promise<void>}
 */
export async function addOrUpdateDiscordJob(provider, job) {
    if (job.discord_id) return
    const channel = getDiscordChannel()
    const embed = constructEmbed(job)
    if (!job.discord_id) {
        const message = await channel.send(embed)
        job.discord_id = message.id
        await createOrUpdateJob(provider, job).catch(console.error)
    } else {
        const message = channel.messages.cache.get(job.discord_id)
        await message.edit(embed)
    }
}

/**
 * TODO: Make a better office presentation from list of providers (which must extends from a custom ScraperProvider to be load dynamically)
 * @param job
 * @returns {module:"discord.js".MessageEmbed}
 */
export function constructEmbed(job) {
    const embed = new Discord.MessageEmbed()
    embed.setURL(job.link)
    embed.setTitle(job.title)
    embed.setFooter(job.source)
    embed.setTimestamp(job.created_at)
    embed.addField('Entreprise', job.company)
    embed.addField('Type', job.type, true)
    embed.addField('Ville', job.location, true)
    embed.setThumbnail(job.company_logo)
    return embed
}
