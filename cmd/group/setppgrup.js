import fs from 'fs'
import { S_WHATSAPP_NET } from 'baileys'

export default (handler) => {
  handler.reg({
    cmd: ['setppgrup', 'setppgroup', 'setppgc'],
    tags: 'group',
    desc: 'Set Profile Picture for Group',
    isGroup: true,
    isAdmin: true,
    isBotAdmin: true,
    run: async (m, { sock, func }) => {
      try {
        const quoted = m.quoted ? m.quoted : m
        const mime = (quoted.msg || quoted).mimetype || ""
      
        // Periksa apakah gambar valid
        if (!/image/.test(mime)) {
          return m.reply("❌ Harap kirim atau reply gambar untuk mengganti foto profil grup.")
        }

        // Unduh media (gambar)
        let media = await sock.downloadMediaMessage(m.quoted, `${Date.now()}`)
        if (!media) {
          return m.reply("❌ Gagal mengunduh gambar. Pastikan media masih tersedia.")
        }

        if (m.text === 'panjang') {
          // Mode "panjang"
          try {

            // Proses gambar menggunakan generateProfilePicture
            const { img } = await func.generateProfilePicture(media)

            // Kirim query untuk mengganti foto profil bot
            await sock.query({
              tag: 'iq',
              attrs: {
                target: m.from,
                to: S_WHATSAPP_NET,
                type: 'set',
                xmlns: 'w:profile:picture',
              },
              content: [
                {
                  tag: 'picture',
                  attrs: { type: 'image' },
                  content: img,
                },
              ],
            })


            m.reply("✅ Berhasil mengganti foto profil grup dengan gambar panjang!")
          } catch (error) {
            m.reply(`❌ Terjadi kesalahan saat mengganti foto profil panjang: ${error.message}`)
          }
        } else {
          // Mode default
          try {
            await sock.updateProfilePicture(m.from, { url: media })
            m.reply("✅ Berhasil mengganti foto profil grup!")
          } catch (error) {
            m.reply(`❌ Terjadi kesalahan saat mengganti foto profil grup: ${error.message}`)
          }
        }

        // Hapus file sementara
        fs.unlinkSync(media)
      } catch (error) {
        m.reply(`❌ Terjadi kesalahan: ${error.message}`)
      }
    },
  })
}