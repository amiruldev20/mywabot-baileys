/*
terimakasih telah menggunakan source code saya. apabila ada masalah, silahkan hubungi saya:
- Facebook: fb.com/amiruldev.ci
- Instagram: instagram.com/amirul.dev
- Telegram: t.me/amiruldev20
- Github: @amiruldev20
*/

/* module external */
import pino from "pino"
import fs from "node:fs"
import { Boom } from "@hapi/boom"
import * as baileys from "baileys"
import session from "session"
import readline from "readline"
import path from "path"
import util from "util"

/* module internal */
const { Client, msg } = await import(`./system/serialize.js?${Date.now()}`)
import * as dbprov from "./system/db/provider.js"
import color from "./system/color.js"
import setting from "./setting.js"
import sch from "./system/db/schema.js"
import * as func from "./system/function.js"
const { default: CommandHandler } = await import(`./system/cmd.js?${Date.now()}`)
const logger = pino({ timestamp: () => `,"time":"${new Date().toJSON()}"` })
logger.level = 'fatal'

const { state, saveCreds, clearAll } =
    await session.useMongoAuthState(setting.db.mongo)

const mydb = /json/i.test(setting.typedb)
    ? new dbprov.Local()
    : /mongo/i.test(setting.typedb)
        ? new dbprov.MongoDB(setting.db.mongo, 'db_bot')
        : process.exit(1)

let db = await mydb.read()
if (!db || Object.keys(db).length === 0) {
    db = {
        users: {},
        groups: {},
        setting: {},
        contacts: {},
        groupMetadata: {}
    }
    await mydb.write(db)
    console.log(color.green("[ DATABASE ] Database initialized!"))
} else {
    console.log(color.yellow("[ DATABASE ] Database loaded."))
}
let phone = db?.setting?.number
const handler = new CommandHandler()
const loadCommands = async (dir) => {
    handler.clear()
    const loadFile = async (filePath) => {
        try {
            const fileUrl = `file://${filePath}?${Date.now()}`
            const module = await import(fileUrl)

            if (typeof module.default === 'function') {
                await module.default(handler)
                return true
            } else {
                console.log("[DEBUG] Module has no default export:", filePath)
                return false
            }
        } catch (error) {
            console.error("[ERROR] Failed to load file:", filePath, error)
            return false
        }
    }

    const processDirectory = async (currentDir) => {
        try {
            const items = fs.readdirSync(currentDir)

            for (const item of items) {
                const fullPath = path.join(currentDir, item)
                const stat = fs.statSync(fullPath)

                if (stat.isDirectory()) {
                    await processDirectory(fullPath)
                } else if (item.endsWith('.js')) {
                    await loadFile(fullPath)
                }
            }
        } catch (error) {
            console.error("[ERROR] Error processing directory:", currentDir, error)
        }
    }
    await processDirectory(dir)
}
const cmdDir = path.join(process.cwd(), 'cmd')
await loadCommands(cmdDir)

const watchDirectory = (dirPath) => {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error(`Error reading directory ${dirPath}:`, err)
            return
        }

        files.forEach((file) => {
            const filePath = path.join(dirPath, file)

            fs.watchFile(filePath, { interval: 100 }, (curr, prev) => {
                if (curr.mtime !== prev.mtime) {
                    console.log(`[+] Detected change on ${file}, reloading commands...`)
                    loadCommands(dirPath)
                }
            })
        })
    })
}
watchDirectory(cmdDir)

async function connectWA() {
    process.on("uncaughtException", error => {
        console.error("Uncaught Exception:", error.message)
    })
    async function getPhoneNumber() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        return new Promise((resolve) => {
            rl.question('[+] WhatSapp (+62): ', async (number) => {
                db.setting.number = number
                db.setting.owner = setting.owner[0]
                await mydb.write(db)
                rl.close()
                resolve(number)
            })
        })
    }
    console.log(color.yellow("[+] STARTING WHATSAPP BOT..."))
    const { version, isLatest } = await baileys.fetchLatestBaileysVersion()
    console.log(color.cyan(`[+] Using WA v${version.join(".")}, isLatest: ${isLatest}`))

    if (!phone) {
        phone = await getPhoneNumber()
    }

    console.log(color.cyan(`[+] Request Pairing: ${phone}`))

    const sock = Client(db, {
        version,
        logger,
        auth: {
            creds: state.creds,
            keys: baileys.makeCacheableSignalKeyStore(state.keys, logger)
        },
        mobile: false,
        printQRInTerminal: true,
        browser: baileys.Browsers.ubuntu("Chrome"),
        markOnlineOnConnect: false,
        generateHighQualityLinkPreview: true,
        syncFullHistory: false,
        retryRequestDelayMs: 10,
        transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 10 },
        maxMsgRetryCount: 15,
        appStateMacVerification: {
            patch: true,
            snapshot: true
        },
    })

    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            const code = (await sock.requestPairingCode(phone))
                ?.match(/.{1,4}/g)
                ?.join("-") || ""
            console.log(`Your Pairing Code: `, color.green(code))
        }, 3000)
    }

    sock.ev.on("connection.update", async update => {
        const { lastDisconnect, connection, receivedPendingNotifications } = update

        if (receivedPendingNotifications && !sock.authState.creds?.myAppStateKeyId) {
            sock.ev.flush()
        }
        if (connection) {
            console.log(color.yellow(`[+] Connection Status : ${connection}`))
        }
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            console.log('reason: ', reason)
            console.log('dis ', baileys.DisconnectReason)

            switch (reason) {
                case 408:
                    console.log(color.red('[+] Connection timed out. restarting...'))
                    await connectWA()
                    break
                case 503:
                    console.log(color.red('[+] Unavailable service. restarting...'))
                    await connectWA()
                    break
                case 428:
                    console.log(color.cyan('[+] Connection closed, restarting...'))
                    await connectWA()
                    break
                case 515:
                    console.log(color.cyan('[+] Need to restart, restarting...'))
                    await connectWA()
                    break

                case 401:
                    try {
                        console.log(color.cyan('[+] Session Logged Out.. Recreate session...'))
                        await clearAll()
                        console.log(color.green('[+] Session removed!!'))
                        process.send('reset')
                    } catch {
                        console.log(color.cyan('[+] Session not found!!'))
                    }
                    break

                case 403:
                    console.log(color.red(`[+] Your WhatsApp Has Been Baned :D`))
                    await clearAll()
                    process.send('reset')
                    break

                case 405:
                    try {
                        console.log(color.cyan('[+] Session Not Logged In.. Recreate session...'))
                        await clearAll()
                        console.log(color.green('[+] Session removed!!'))
                        process.send('reset')
                    } catch {
                        console.log(color.cyan('[+] Session not found!!'))
                    }
                    break
                default:

            }
        }
        if (connection === "open") {
            const conn = await func.load("@amiruldev/connect.js")
            conn(color)
            if (!fs.existsSync("./temp")) {
                fs.mkdirSync("./temp")
                console.log(color.cyan('[+] Folder "temp" successfully created.'))
            }
            await mydb.write(db)
        }
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("messages.upsert", async ({ type, messages }) => {
        if (type === "notify" && messages.length) {
            let m = messages[0]
            if (m.message) {
                m.message = m.message?.ephemeralMessage
                    ? m.message.ephemeralMessage.message
                    : m.message
                const mes = await msg(sock, m, db)
                sch.schema(mes, sock, db)
                await handler.execute(mes, sock, db, func, color, util)
            }
        }
    })

    sock.ev.on("contacts.update", update => {
        for (const contact of update) {
            const id = baileys.jidNormalizedUser(contact.id)
            if (db.contacts) {
                db.contacts[id] = {
                    ...(db.contacts[id] || {}),
                    ...(contact || {})
                }
            }
        }
    })

    sock.ev.on("contacts.upsert", update => {
        for (const contact of update) {
            const id = baileys.jidNormalizedUser(contact.id)
            if (db.contacts) {
                db.contacts[id] = { ...(contact || {}), isContact: true }
            }
        }
    })

    sock.ev.on("groups.update", updates => {
        for (const update of updates) {
            const id = update.id
            if (db.groupMetadata[id]) {
                db.groupMetadata[id] = {
                    ...(db.groupMetadata[id] || {}),
                    ...(update || {})
                }
            }
        }
    })

    sock.ev.on("group-participants.update", ({ id, participants, action }) => {
        const metadata = db.groupMetadata[id]
        if (metadata) {
            switch (action) {
                case "add":
                case "revoked_membership_requests":
                    metadata.participants.push(
                        ...participants.map(id => ({
                            id: baileys.jidNormalizedUser(id),
                            admin: null
                        }))
                    )
                    break
                case "demote":
                case "promote":
                    for (const participant of metadata.participants) {
                        const id = baileys.jidNormalizedUser(participant.id)
                        if (participants.includes(id)) {
                            participant.admin =
                                action === "promote" ? "admin" : null
                        }
                    }
                    break
                case "remove":
                    metadata.participants = metadata.participants.filter(
                        p => !participants.includes(baileys.jidNormalizedUser(p.id))
                    )
                    break
            }
        }
    })

    // interval save db
    setInterval(async () => {
        await mydb.write(db)
    }, 30000)
}

connectWA()