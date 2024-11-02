/*
terimakasih telah menggunakan source code saya. apabila ada masalah, silahkan hubungi saya:
- Facebook: fb.com/amiruldev.ci
- Instagram: instagram.com/amirul.dev
- Telegram: t.me/amiruldev20
- Github: @amiruldev20
*/
export default class CommandHandler {
    constructor() {
        this.commands = new Map()
        this.functions = new Set()
        this.prefixes = ['.', ',', '/', '\\', '#', '!']
        this.executedCommands = new Set()
    }

    reg({ cmd, tags, desc = 'No description', noPrefix = false, isOwner = false, isLimit = false, run, expectedArgs = {} }) {
        const commands = Array.isArray(cmd) ? cmd : [cmd]
        commands.forEach(command => {
            this.commands.set(command.toLowerCase(), { tags, desc, noPrefix, isOwner, isLimit, run, expectedArgs })
        })
    }

    addFunction(fn) {
        if (typeof fn === 'function') this.functions.add(fn)
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

            // mute group
            if (m.isGroup && gc.mute && !m.isOwner) return false

            // self mode
            if (db.setting.self && !m.isOwner) return false

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
            // banned
            if (command && usr.banned) {
                const mpr = await func.load("@amiruldev/ms.js")
                return mpr(sock, m, 'Anda Dibanned', 'https://spng.pngfind.com/pngs/s/173-1734525_banned-logo-png-banned-transparent-png.png', '_Ops.. anda dibanned dari bot_')
            }

            // limit
            if (command.isLimit) {
                const limitUsage = typeof command.isLimit === 'number' ? command.isLimit : 1;

                if (usr.limit < limitUsage) {
                    const mpr = await func.load("@amiruldev/ms.js")
                    return mpr(sock, m, 'Limit Tidak Cukup', 'https://cdn.icon-icons.com/icons2/307/PNG/512/Emoji-Sad-Icon_34097.png', `Penggunaan limit harian anda telah habis, Perintah ini membutuhkan *${limitUsage} Limit*
    
Limit direset setiap pukul *${db.setting.limit.reset} WIB*, gunakan kembali setelah limit direset
                                        
Atau kamu bisa topup untuk membeli limit tambahan dengan menggunakan perintah \`#buylimit\` atau bisa juga dengan upgrade akun ke premium untuk mendapatkan lebih banyak limit \`#buyprem 30\``)
                } else {
                    usr.limit -= limitUsage;
                }
            }

            // owner only
            if (command.isOwner && !m.isOwner) {
                const mpr = await func.load("@amiruldev/ms.js")
                return mpr(sock, m, 'Akses Ditolak', 'https://static.vecteezy.com/system/resources/previews/023/051/709/non_2x/access-denied-rubber-stamp-seal-vector.jpg', '_Fitur ini hanya untuk owner bot!!_')
            }

            // is admin
            if (command.isAdmin && !m.isAdmin) {
                const mpr = await func.load("@amiruldev/ms.js")
                return mpr(sock, m, 'Akses Ditolak', 'https://static.vecteezy.com/system/resources/previews/023/051/709/non_2x/access-denied-rubber-stamp-seal-vector.jpg', '_Fitur ini hanya untuk admin grup!!_')
            }

            // is bot admin
            if (command.isBotAdmin && !m.isBotAdmin) {
                const mpr = await func.load("@amiruldev/ms.js")
                return mpr(sock, m, 'Bot Bukan Admin', 'https://cdn.icon-icons.com/icons2/307/PNG/512/Emoji-Sad-Icon_34097.png', '_Untuk menggunakan fitur ini, bot harus jadi admin grup!!_')
            }

            // is group
            if (command.isGroup && !m.isGroup) {
                const mpr = await func.load("@amiruldev/ms.js")
                return mpr(sock, m, 'Akses Ditolak', 'https://static.vecteezy.com/system/resources/previews/023/051/709/non_2x/access-denied-rubber-stamp-seal-vector.jpg', '_Fitur ini hanya dapat digunakan didalam grup!!_')
            }

            // is private
            if (command.isPrivate && m.isGroup) {
                const mpr = await func.load("@amiruldev/ms.js")
                return mpr(sock, m, 'Akses Ditolak', 'https://static.vecteezy.com/system/resources/previews/023/051/709/non_2x/access-denied-rubber-stamp-seal-vector.jpg', '_Fitur ini hanya dapat digunakan di private chat!!_')
            }

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
            // banned
            if (command && usr.banned) {
                const mpr = await func.load("@amiruldev/ms.js")
                return mpr(sock, m, 'Anda Dibanned', 'https://spng.pngfind.com/pngs/s/173-1734525_banned-logo-png-banned-transparent-png.png', '_Ops.. anda dibanned dari bot_')
            }

            // limit
            if (command.isLimit) {
                const limitUsage = typeof command.isLimit === 'number' ? command.isLimit : 1;

                if (usr.limit < limitUsage) {
                    const mpr = await func.load("@amiruldev/ms.js")
                    return mpr(sock, m, 'Limit Tidak Cukup', 'https://cdn.icon-icons.com/icons2/307/PNG/512/Emoji-Sad-Icon_34097.png', `Penggunaan limit harian anda telah habis, Perintah ini membutuhkan *${limitUsage} Limit*
    
Limit direset setiap pukul *${db.setting.limit.reset} WIB*, gunakan kembali setelah limit direset
                                        
Atau kamu bisa topup untuk membeli limit tambahan dengan menggunakan perintah \`#buylimit\` atau bisa juga dengan upgrade akun ke premium untuk mendapatkan lebih banyak limit \`#buyprem 30\``)
                } else {
                    usr.limit -= limitUsage;
                }
            }

            // owner only
            if (command.isOwner && !m.isOwner) {
                const mpr = await func.load("@amiruldev/ms.js")
                return mpr(sock, m, 'Akses Ditolak', 'https://static.vecteezy.com/system/resources/previews/023/051/709/non_2x/access-denied-rubber-stamp-seal-vector.jpg', '_Fitur ini hanya untuk owner bot!!_')
            }

            // is admin
            if (command.isAdmin && !m.isAdmin) {
                const mpr = await func.load("@amiruldev/ms.js")
                return mpr(sock, m, 'Akses Ditolak', 'https://static.vecteezy.com/system/resources/previews/023/051/709/non_2x/access-denied-rubber-stamp-seal-vector.jpg', '_Fitur ini hanya untuk admin grup!!_')
            }

            // is bot admin
            if (command.isBotAdmin && !m.isBotAdmin) {
                const mpr = await func.load("@amiruldev/ms.js")
                return mpr(sock, m, 'Bot Bukan Admin', 'https://cdn.icon-icons.com/icons2/307/PNG/512/Emoji-Sad-Icon_34097.png', '_Untuk menggunakan fitur ini, bot harus jadi admin grup!!_')
            }

            // is group
            if (command.isGroup && !m.isGroup) {
                const mpr = await func.load("@amiruldev/ms.js")
                return mpr(sock, m, 'Akses Ditolak', 'https://static.vecteezy.com/system/resources/previews/023/051/709/non_2x/access-denied-rubber-stamp-seal-vector.jpg', '_Fitur ini hanya dapat digunakan didalam grup!!_')
            }

            // is private
            if (command.isPrivate && m.isGroup) {
                const mpr = await func.load("@amiruldev/ms.js")
                return mpr(sock, m, 'Akses Ditolak', 'https://static.vecteezy.com/system/resources/previews/023/051/709/non_2x/access-denied-rubber-stamp-seal-vector.jpg', '_Fitur ini hanya dapat digunakan di private chat!!_')
            }

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
