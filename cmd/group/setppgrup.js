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
        if (!/image/.test(mime)) {
          return m.reply("❌ Harap kirim atau reply gambar untuk mengganti foto profil grup.")
        }
        let media = await sock.downloadMediaMessage(m.quoted, `${Date.now()}`)
        if (!media) {
          return m.reply("❌ Gagal mengunduh gambar. Pastikan media masih tersedia.")
        }
        if (m.text === 'panjang') {
          try {
            const { img } = await func.generateProfilePicture(media)
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
            return error
          }
        } else {
          try {
            await sock.updateProfilePicture(m.from, { url: media })
            m.reply("✅ Berhasil mengganti foto profil grup!")
          } catch (error) {
            return error
          }
        }
        fs.unlinkSync(media)
      } catch (error) {
        return error
      }
    },
  })
}