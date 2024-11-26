/*export default (handler) => {
    handler.reg({
        cmd: ['sticker', 'stiker', 'st'],
        tags: 'maker',
        desc: 'Sticker maker',
        run: async (m, { func, sock, db }) => {
            if (!m?.quoted?.isMedia) {
                m.react("❌")
                return m.reply(`Silahkan post / reply media`, true)
            }
            let media = m.quoted ? await m.quoted.download() : await m.download()

            if (/image|video|sticker/.test(m.quoted.msg.mimetype)) {
                if (m.quoted.msg.seconds > 15) return m.reply(`Max video 15 second`)
                const gf = await func.getFile(media)
                const buf = await func.writeExif(gf, { wm: `${m.pushName} • ${db.setting.packname}` })
                sock.sendMessage(
                    m.from,
                    { sticker: buf },
                    {
                        quoted: m,
                        ephemeralExpiration: m.expiration,
                        messageId: func.rand(32)
                    }
                )
            }
        }
    })
}*/