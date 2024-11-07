import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default (handler) => {
    handler.reg({
        cmd: ['menu', 'list', 'help', 'start'],
        tags: 'main',
        desc: 'Show all commands',
        run: async (m, { sock, cmds }) => {
            const commandGroups = {}
            const baseDir = path.join(__dirname)

            if (!fs.existsSync(baseDir)) {
                console.error(`[ERROR] Directory not found: ${baseDir}`)
                await m.reply("Command directory not found.")
                return
            }

            const loadCommands = (dir) => {
                const items = fs.readdirSync(dir)
                items.forEach(item => {
                    const itemPath = path.join(dir, item)
                    if (fs.statSync(itemPath).isDirectory()) {
                        loadCommands(itemPath) // Rekursif untuk subfolder
                    } else if (path.extname(item) === '.js') {
                        import(itemPath).then(commandModule => {
                            if (commandModule.default) {
                                commandModule.default(handler)
                            }
                        }).catch(error => {
                            console.error(`[ERROR] Failed to load command from ${itemPath}:`, error)
                        })
                    }
                })
            }

            loadCommands(baseDir)

            for (const [command, details] of cmds) {
                const tag = details.tags || 'LAINNYA'
                if (!commandGroups[tag]) {
                    commandGroups[tag] = []
                }

                const commandText = `${command}${details.isLimit ? ' 𖣨' : ''}\n> ${details.desc}`

                if (!commandGroups[tag].some(cmd => cmd.includes(`\n> ${details.desc}`))) {
                    commandGroups[tag].push(commandText)
                }
            }

            const orderedTags = ['main', 'convert', 'ai', 'downloader', 'group', 'channel', 'owner', 'tools']
            let menu = ''
            let counter = 1

            orderedTags.forEach(tag => {
                const upperTag = tag.toUpperCase()
                if (commandGroups[tag]) {
                    menu += `*# ${upperTag} MENU* (${commandGroups[tag].length})\n`
                    commandGroups[tag].forEach(command => {
                        menu += `${counter}. ${command}\n`
                        counter++
                    })
                    menu += '\n'
                }
            })

            const hitAll = await fetch("https://amiruldev.serv00.net/hit.txt")
            const counts = await hitAll.text()
            sock.sendAdL(m.from, `Hi, *@${m.sender.split("@")[0]}* 👋
            
Selamat datang di MyWA BOT
bot ini masih dalam tahap beta

*• Hit Pengguna Script*: ${counts}

${menu.trim()}

> 2024 © Amirul Dev`, m)
        }
    })
}