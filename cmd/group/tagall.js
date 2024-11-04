export default (handler) => {
    handler.reg({
        cmd: ['tagall', 't'],
        tags: 'group',
        desc: 'Tag all member in group',
        isAdmin: true,
        isBotAdmin: false,
        run: async (m, { sock }) => {
            const meta = await sock.groupMetadata(m.from)
            const mentions = meta.participants.map(u => u.id)
            let text = m.text ? m.text.trim() : m.quoted ? m.quoted.text.trim() : ''.trim()
            for (let m of mentions) text += `\n@${m.split`@`[0]}`
            await sock.sendMessage(m.from, { text, mentions })
        }
    })
}
