export default (handler) => {
    handler.reg({
        cmd: ['setlimit', 'limit'],
        tags: 'owner',
        desc: 'Set limit for users',
        isOwner: true,
        run: async (m, { db, sock }) => {
            let [input, limit] = m.text.split(",")
            if (!input && !limit) return m.reply('Silakan tentukan pengguna dan limit yang ingin diterapkan.\nContoh: .limit @user,1000', true)
            if (!input || !limit) return m.reply('Perintah salah. Format yang benar\n.limit @user,1000', true)
            const p = await sock.onWhatsApp(input.trim())
            if (p.length == 0) return m.reply('⚠️ Nomor tidak terdaftar di WhatsApp', true)
            const jid = sock.decodeJid(p[0].jid)
            const set = db.users[jid]
            if (!set) {
                return m.reply('⚠️ Pengguna tersebut tidak ditemukan dalam database.', true)
            }

            set.limit = parseInt(limit)
            m.reply({
                text: `✅ Pengguna @${jid.split('@')[0]} telah diberi limit sebesar ${limit}.`,
                mentions: [jid],
            })
        },
    })
}
