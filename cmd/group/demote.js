export default (handler) => {
    handler.reg({
        cmd: ['demote', 'dm', 'deladmin'],
        tags: 'group',
        desc: 'Remove group admin',
        isGroup: true,
        isAdmin: true,
        isBotAdmin: true,
        run: async (m, { sock }) => {
            const input = m.text ? m.text : m.quoted ? m.quoted.sender : m.mentions.length > 0 ? m.mentions[0] : false
            if (!input) return m.reply('Silahkan tag / reply target', true)
            const p = await sock.onWhatsApp(input.trim())
            if (p.length == 0) return m.reply('⚠️ Nomor tidak terdaftar di WhatsApp', true)
            const jid = sock.decodeJid(p[0].jid)
            const meta = await sock.groupMetadata(m.from)
            const member = meta.participants.find(u => u.id == jid)
            if (!member) return m.reply('Sudah keluar dari grup', true)
            sock.groupParticipantsUpdate(m.from, [jid], 'demote')
            m.react("✅")
        }
    })
}
