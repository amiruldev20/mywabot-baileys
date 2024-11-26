import moment from "moment-timezone"
import { addPremiumUser, checkPremiumUser } from "../../system/db/premium.js"

export default (handler) => {
    handler.reg({
        cmd: ['setpremium', 'setprem', 'premium', 'prem'],
        tags: 'owner',
        desc: 'Set premium status for users',
        isOwner: true,
        run: async (m, { db, sock }) => {
            const [input, days] = m.text.split(',').map(i => i.trim())
            if (!input) {
                return m.reply(
                    '❓ *Cara Penggunaan:*\n' +
                    '- Untuk memberikan premium: `.premium @user,7`\n' +
                    '- Untuk tanpa batas waktu: `.premium @user,0`\n' +
                    'Durasi yang valid: 1, 3, 7, 14, atau 30 hari.',
                    true
                )
            }

            const validDurations = [1, 3, 7, 14, 30]
            let premiumDuration

            if (days?.toLowerCase() === 'unlimited') {
                premiumDuration = 'PERMANENT'
            } else {
                const duration = parseInt(days)
                if (isNaN(duration) || !validDurations.includes(duration)) {
                    return m.reply('⚠️ Durasi tidak valid. Pilih antara 1, 3, 7, 14, atau 30 hari.', true)
                }
                premiumDuration = duration * 24 * 60 * 60 * 1000
            }

            const p = await sock.onWhatsApp(input.trim())
            if (p.length === 0) {
                return m.reply('⚠️ Nomor tidak terdaftar di WhatsApp.', true)
            }

            const jid = sock.decodeJid(p[0].jid)
            const user = db.users[jid]

            if (!user) {
                return m.reply('⚠️ Pengguna tidak ditemukan dalam database.', true)
            }

            // Tambahkan pengguna sebagai premium dan reset limit jika kedaluwarsa
            try {
                const isExpired = !checkPremiumUser(jid, db)
                addPremiumUser(jid, premiumDuration, db, isExpired)
            } catch (error) {
                return m.reply(`⚠️ Terjadi kesalahan: ${error.message}`)
            }

            const expiryDate = premiumDuration === 'PERMANENT'
                ? 'Tanpa Batas Waktu'
                : moment(Date.now() + premiumDuration).tz('Asia/Jakarta').format('HH:mm:ss [WIB], DD MMMM')

            const premiumMessage = premiumDuration === 'PERMANENT'
                ? {
                    text: `✅ Pengguna @${jid.split('@')[0]} telah menjadi pengguna premium *tanpa batas waktu*.\nLimit premium: ${isExpired ? 10 : 100}.`,
                    mentions: [jid],
                }
                : {
                    text: `✅ Pengguna @${jid.split('@')[0]} telah menjadi pengguna premium selama *${days} hari*.\nPremium berakhir pada: *${expiryDate}*.\nLimit premium: ${isExpired ? 10 : 100}.`,
                    mentions: [jid],
                }

            m.reply(premiumMessage)

            if (db && db.write) {
                await db.write()
            }
        },
    })
}
