import fs from "fs"
import path from "path"
import setting from "../../setting.js"
import mongoose from 'mongoose'

/* class json */
export class Local {
    data = {}
    file = path.join(process.cwd(), setting.db.local)

    read() {
        let data
        if (fs.existsSync(this.file)) {
            data = JSON.parse(fs.readFileSync(this.file))
        } else {
            fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2))
            data = this.data
        }

        return data
    }

    write(data) {
        this.data = data ? data : global.db
        let dirname = path.dirname(this.file)
        if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true })
        fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2))
        return this.file
    }
}

/* class mongoose */
export class MongoDB {
    constructor(url, tableName) {
        this.url = url
        this.tableName = tableName
        this.connection = null
        this.schema = new mongoose.Schema({
            data: { type: mongoose.Schema.Types.Mixed, default: {} }
        })
        this.model = mongoose.model(this.tableName, this.schema)
    }

    async connect() {
        if (!this.connection) {
            try {
                this.connection = await mongoose.connect(this.url, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                })
            } catch (error) {
                console.error('MongoDB connection error:', error)
                throw error
            }
        }
    }

    async read() {
        await this.connect()
        try {
            const document = await this.model.findOne()
            if (!document) {
                const defaultData = new this.model({ data: {} })
                await defaultData.save()
                return defaultData.data
            }
            return document.data
        } catch (error) {
            console.error('Error reading data from MongoDB:', error)
            throw error
        }
    }
    async write(data) {
        await this.connect()
        try {
            let document = await this.model.findOne()
            if (document) {
                document.data = data || {}
                await document.save()
            } else {
                document = new this.model({ data: data || {} })
                await document.save()
            }
        } catch (error) {
            console.error('Error writing data to MongoDB:', error)
            throw error
        }
    }

    async close() {
        if (this.connection) {
            try {
                await mongoose.disconnect()
                this.connection = null
                console.log('Disconnected from MongoDB')
            } catch (error) {
                console.error('Error disconnecting from MongoDB:', error)
                throw error
            }
        }
    }
}


