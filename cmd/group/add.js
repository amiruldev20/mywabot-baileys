export default (handler) => {
    handler.reg({
        cmd: ['add'],
        tags: 'group',
        desc: 'Add member',
        isAdmin: true,
        isBotAdmin: true,
        run: async (m, { sock, util }) => {
            const input = m.text ? m.text : m.quoted ? m.quoted.sender : m.mentions.length > 0 ? m.mentions[0] : false
            if (!input) return m.reply('Silahkan tag / reply target')
            const p = await sock.onWhatsApp(input.trim())
            if (p.length == 0) return m.reply('⚠️ Nomor tidak terdaftar di WhatsApp')
            const jid = sock.decodeJid(p[0].jid)
            const meta = await sock.groupMetadata(m.from)
            const member = meta.participants.find(u => u.id == jid)
            if (member?.id) return m.reply('Sudah join ke grup')
            sock.groupParticipantsUpdate(m.from, [jid], 'add').then(res => m.reply(util.format(res)))
        }
    })
}