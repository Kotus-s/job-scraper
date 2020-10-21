import mongoose from 'mongoose'

const jobSchema = mongoose.Schema({
    title: String,
    company: String,
    link: String,
    source: String,
    company_logo: String,
    created_at: Date,
    type: String,
    location: String,
    discord_id: {
        type: String,
        default: null
    },
    deleted: {
        type: Boolean,
        default: false
    }
})

export const Job = mongoose.model('Job', jobSchema);

/**
 * TODO: Refactor method name
 * @param url
 * @returns {Promise<unknown>}
 */
export async function connect(url) {
    return new Promise((success, failure) => {
        mongoose.connect(`mongodb://${url}:27017/test?authSource=admin`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).then(() => {
            success()
        }).catch(failure)
    })
}

/**
 *
 * @param {ScraperProvider} provider
 * @param args
 * @returns {Promise<unknown>}
 */
export async function createOrUpdateJob(provider, args) {
    return new Promise((success, failure) => {
        const filters = {title: args.title, source: args.source}
        Job.findOneAndUpdate(filters, args, {upsert: true, new: true, setDefaultsOnInsert: true}, function(err, job) {
            if (err) failure(err)
            success(job)
        })
    })
}

export async function deleteJobFromDiscord(discord_id) {
    return new Promise((success, failure) => {
        Job.findOneAndUpdate({discord_id}, {deleted: true}, function(err, job) {
            if (err) failure(err)
            success(job)
        })
    })
}
