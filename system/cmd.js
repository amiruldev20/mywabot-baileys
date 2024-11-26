/*
terimakasih telah menggunakan source code saya. apabila ada masalah, silahkan hubungi saya
•
Thank you for using my source code. If there is a problem, please contact me

- Facebook: fb.com/amiruldev.ci
- Instagram: instagram.com/amirul.dev
- Telegram: t.me/amiruldev20
- Github: @amiruldev20
- WhatsApp: 085157489446
*/

/* module external */
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

/* module internal */
import color from './color.js'

export default class CommandHandler {
    constructor() {
        this.commands = new Map()
        this.functions = new Set()
        this.prefixes = ['.', ',', '/', '\\', '#', '!']
        this.executedCommands = new Set()
    }

    reg({ cmd, tags, desc = 'No description', noPrefix = false, isOwner = false, isLimit = false, isAdmin = false, isBotAdmin = false, isGroup = false, isPrivate = false, run, expectedArgs = {} }) {
        const commands = Array.isArray(cmd) ? cmd : [cmd]
        commands.forEach(command => {
            this.commands.set(command.toLowerCase(), { tags, desc, noPrefix, isOwner, isLimit, isAdmin, isBotAdmin, isGroup, isPrivate, run, expectedArgs })
        })
    }

    addFunction(fn) {
        this.functions.add(fn)
    }

    async loadPlugin(path) {
        try {
            if (path.endsWith('.cjs')) {
                const module = require(path)
                return module.default || module
            } else if (path.endsWith('.mjs') || path.endsWith('.js')) {
                const module = await import(path)
                return module.default || module
            } else {
                console.log(color.red(`[ CMD ] Unsupported module format: ${path}`))
            }
        } catch {
            console.log(color.red(`[ CMD ] Failed to load module: ${path}`))
        }
    }

    async execute(m, sock, db, func, color, util) {
        try {
            if (this.executedCommands.has(m.id)) return false
            this.executedCommands.add(m.id)
            for (const fn of this.functions) {
                try {
                    await fn(m, { sock, db, color, func })
                } catch (error) {
                    console.error("[ERROR] Error in function handler:", error)
                }
            }

            if (!m.body) return false
            const text = m.body.trim()
            const gc = m.isGroup ? db.groups[m.from] : false
            const usr = db.users[m.sender] || {}

            // mute gc
            if (m.isGroup && gc.mute && !m.isOwner) return false

            // self mode
            if (db.setting.self && !m.isOwner && !m.key.fromMe) return false

            // autoread
            if (db.setting.autoread) {
                await sock.readMessages([m.key])
            }

            // readstory
            const sw = await func.loads("amiruldev/sw.js")
            await sw(sock, db, m)

            const prefixMatched = this.prefixes.find(p => text.startsWith(p))
            if (prefixMatched) {
                return await this.handleCommand(text, prefixMatched, m, sock, db, func, color, util, usr)
            }

            return await this.handleNoPrefixCommand(text, m, sock, db, func, color, util)
        } catch (error) {
            console.error("[ERROR] Error in execute method:", error)
            return false
        }
    }

    async handleCommand(text, prefix, m, sock, db, func, color, util, usr) {
        const [cmd, ...args] = text.slice(prefix.length).trim().split(' ')
        const command = this.commands.get(cmd.toLowerCase())

        if (command && !command.noPrefix) {
            const cmd = await func.loads('amiruldev/cmd.js')
            const mcmd = await cmd(command, usr, sock, m, db)
            if (mcmd) return;
            try {
                const parsedArgs = this.parseArguments(args, command.expectedArgs)
                await command.run(m, { sock, args: parsedArgs, db, util, color, func, cmds: this.commands })
                return true
            } catch (error) {
                console.error("[ERROR] Error executing prefixed command:", error)
            }
        }
        return false
    }

    async handleNoPrefixCommand(text, m, sock, db, func, color, util) {
        const [potentialCmd, ...args] = text.split(' ')
        const command = this.commands.get(potentialCmd.toLowerCase())
        const usr = db.users[m.sender] || {}

        if (command && command.noPrefix) {
            const cmd = await func.loads('amiruldev/cmd.js')
            const mcmd = await cmd(command, usr, sock, m, db)
            if (mcmd) return;
            try {
                const parsedArgs = this.parseArguments(args, command.expectedArgs)
                await command.run(m, { sock, args: parsedArgs, db, util, color, func, cmds: this.commands })
                return true
            } catch (error) {
                console.error("[ERROR] Error executing non-prefixed command:", error)
            }
        }
        return false
    }

    parseArguments(args, expectedArgs) {
        const argObject = {}
        args.forEach(arg => {
            const [key, value] = arg.split('=')
            if (expectedArgs[key]) argObject[key] = value || true
        })
        return argObject
    }

    clear() {
        this.commands.clear()
        this.functions.clear()
        this.executedCommands.clear()
    }
}