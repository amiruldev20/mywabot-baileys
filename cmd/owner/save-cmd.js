import fs from 'fs'
import path from 'path'

export default (handler) => {
    handler.reg({
        cmd: ['svcmd'],
        tags: 'owner',
        desc: 'Save file cmd',
        isOwner: true,
        run: async (m) => {
            let [file, code] = m.text.split("@")
            if (!file) return m.reply('Command anda salah\ncontoh: .svcmd main/nama.js@kodenya', true)

            if (!code && m.quoted) code = m.quoted.body

            if (!code) return m.reply('Silahkan input kodenya\ncontoh: .svcmd main/name.js@kodenya', true)

            const fullPath = path.join('cmd', file)
            const dirPath = path.dirname(fullPath)

            if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })

            fs.writeFileSync(fullPath, code)
            m.reply(`File ${path.basename(file)} berhasil disimpan di subfolder ${path.dirname(file)}`)
        }
    })
}
