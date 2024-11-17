export default (handler) => {
    handler.reg({
        cmd: ['unban', 'unbanned'],
        tags: 'owner',
        desc: 'Unban a user',
        isOwner: true,
        run: async (m, { db, sock }) => {
            const input = m.text ? m.text : m.quoted ? m.quoted.sender : m.mentions.length > 0 ? m.mentions[0] : false
            if (!input) return m.reply('Silahkan tag / reply target', true)
            const p = await sock.onWhatsApp(input.trim())
            if (p.length == 0) return m.reply('⚠️ Nomor tidak terdaftar di WhatsApp', true)
            const jid = sock.decodeJid(p[0].jid)
            const set = db.users[jid]
            if (!set) {
                return m.reply('⚠️ Users tersebut tidak ditemukan terdaftar dalam database.', true)
            }
            set.banned = false
            m.reply(`✅ Pengguna ${input} telah di-unbanned.`, true)
            },
        },
    )
}
