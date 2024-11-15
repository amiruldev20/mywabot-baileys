export default (handler) => {
    handler.reg({
        cmd: ['timer'],
        tags: 'group',
        desc: 'Setting ephemeral chat',
        run: async (m, { sock }) => {
            if (m.isGroup) {
                if (!m.isBotAdmin) return m.reply('Untuk setel timer chat di grup ini, bot harus menjadi admin!!', true)
                if (!m.text) return m.reply(`Silahkan masukan waktunya

0. mati
1. 24 jam
2. 7 hari
3. 90 hari`, true)
                if (m.text === "0") {
                    sock.sendMessage(m.from, { disappearingMessagesInChat: 0 })
                    m.reply('Ephemeral telah dimatikan', true)
                } else if (m.text === "1") {
                    sock.sendMessage(m.from, { disappearingMessagesInChat: 86400 })
                    m.reply('Ephemeral telah diatur 24 jam', true)
                } else if (m.text === "2") {
                    sock.sendMessage(m.from, { disappearingMessagesInChat: 604800 })
                    m.reply('Ephemeral telah diatur 7 hari', true)
                } else if (m.text === "3") {
                    sock.sendMessage(m.from, { disappearingMessagesInChat: 7776000 })
                    m.reply('Ephemeral telah diatur 90 hari', true)
                }

            } else {
                if (!m.text) return m.reply(`Silahkan masukan waktunya

0. mati
1. 24 jam
2. 7 hari
3. 90 hari`, true)
                if (m.text === "0") {
                    sock.sendMessage(m.from, { disappearingMessagesInChat: 0 })
                    m.reply('Ephemeral telah dimatikan', true)
                } else if (m.text === "1") {
                    sock.sendMessage(m.from, { disappearingMessagesInChat: 86400 })
                    m.reply('Ephemeral telah diatur 24 jam', true)
                } else if (m.text === "2") {
                    sock.sendMessage(m.from, { disappearingMessagesInChat: 604800 })
                    m.reply('Ephemeral telah diatur 7 hari', true)
                } else if (m.text === "3") {
                    sock.sendMessage(m.from, { disappearingMessagesInChat: 7776000 })
                    m.reply('Ephemeral telah diatur 90 hari', true)
                }

            }
        }
    })
}