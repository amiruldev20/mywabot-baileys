export default (handler) => {
    handler.reg({
        cmd: ['delpremium', 'delprem', 'removepremium'],
        tags: 'owner',
        desc: 'delete premium user.',
        isOwner: true,
        run: async (m, { db, sock }) => {
            const input = m.text ? m.text : m.quoted ? m.quoted.sender : m.mentions.length > 0 ? m.mentions[0] : false
            if (!input) {
                return m.reply(
                    'Silakan tag atau reply target untuk dihapus status premiumnya.\nContoh: .delpremium @user',
                    true
                )
            }

            // Mengecek apakah nomor terdaftar di WhatsApp
            const p = await sock.onWhatsApp(input.trim())
            if (p.length === 0) return m.reply('⚠️ Nomor tidak terdaftar di WhatsApp.', true)

            // Mendapatkan JID dan mencari pengguna di database
            const jid = sock.decodeJid(p[0].jid)
            const user = db.users[jid]

            // Jika pengguna tidak ditemukan
            if (!user) {
                return m.reply('⚠️ Pengguna tersebut tidak ditemukan dalam database.', true)
            }

            // Hapus status premium dan atur ulang limit
            user.premium = false
            user.exp_prem = -1
            user.limit = 10

            // Kirim pesan konfirmasi
            const removeMessage = {
                text: `❌ Pengguna @${jid.split('@')[0]} telah dihapus status premiumnya.\nLimit pengguna sekarang diatur menjadi 10.`,
                mentions: [jid],
            }

            m.reply(removeMessage)

            // Simpan perubahan ke database
            if (db && db.write) {
                await db.write()
            }
        },
    })
}
