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

            const folders = fs.readdirSync(baseDir).filter(folder => {
                const folderPath = path.join(baseDir, folder)
                return fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()
            })

            for (const folder of folders) {
                const folderPath = path.join(baseDir, folder)
                const files = fs.readdirSync(folderPath).filter(file => path.extname(file) === '.js')

                for (const file of files) {
                    const filePath = path.join(folderPath, file)
                    const commandModule = await import(filePath)
                    if (commandModule.default) {
                        commandModule.default(handler)
                    }
                }
            }

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

            const orderedTags = ['main', 'convert', 'downloader', 'group', 'channel', 'owner']
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

            sock.sendAdL(m.from, `Hi, *@${m.sender.split("@")[0]}* 👋
            
Selamat datang di MyWA BOT
bot ini masih dalam tahap beta

${menu.trim()}

> 2024 © Amirul Dev`, m)
        }
    })
}
