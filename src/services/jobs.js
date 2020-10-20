import mongoose from 'mongoose'

const jobSchema = mongoose.Schema({
    title: String,
    company: String,
    link: String,
    source: String,
    discord_id: {
        type: String,
        default: null
    },
    deleted: {
        type: Boolean,
        default: false,
    }
})

export const Job = mongoose.model('Job', jobSchema);

export async function connect(url) {
    return new Promise((success, failure) => {
        mongoose.connect(`mongodb://${url}:27017/test`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).then(() => {
            success()
        }).catch(failure)
    })
}

export async function createOrUpdateJob(args) {
    return new Promise((success, failure) => {
        const filters = {title: args.title, source: args.source}
        Job.findOneAndUpdate(filters, args, {upsert: true, new: true, setDefaultsOnInsert: true}, function(err, job) {
            if (err) failure(err)
            success(job)
        })
    })
}
