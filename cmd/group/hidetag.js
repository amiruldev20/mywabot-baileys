export default (handler) => {
    handler.reg({
        cmd: ['hidetag', 'h'],
        tags: 'group',
        desc: 'Hide tag in group',
        isGroup: true,
        isAdmin: true,
        isBotAdmin: false,
        run: async (m, { sock }) => {
            const text = m.text ? m.text : m.quoted ? m.quoted.text : ''
            const meta = await sock.groupMetadata(m.from)
            const mentions = meta.participants.map(u => u.id)
            await sock.sendMessage(m.from, { text, mentions })
        }
    })
}