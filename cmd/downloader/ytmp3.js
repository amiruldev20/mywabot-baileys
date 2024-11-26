export default (handler) => {
    handler.reg({
        cmd: ['ytmp3', 'yta'],
        tags: 'downloader',
        desc: 'Youtube audio downloader',
        isLimit: true,
        run: async (m, { func, sock }) => {
            const youtubeRegex = /(https?:\/\/)?(www\.)?(youtube\.com\/(?:watch\?v=|shorts\/|embed\/)?[A-Za-z0-9_-]+|youtu\.be\/[A-Za-z0-9_-]+)/
            const youtubeUrl = m.text.match(youtubeRegex)?.[0]
            if (!youtubeUrl) {
               return m.reply('Silahkan masukan URL YouTube yang valid!', true)
            }
            const ytdl = await func.loads("amiruldev/ytdl.js")
            const json = await ytdl(fetch, m.text)
            await m.react("⏱️")
            await Promise.all([
                await sock.sendMessage(m.from, {
                    audio: { url: json.links[1].url },
                    mimetype: "audio/mpeg",
                    contextInfo: {
                        externalAdReply: {
                            thumbnailUrl: json.thumbnail,
                            title: json.title,
                            body: `Duration: ${json.duration}`,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                },
                    {
                        quoted: m,
                        ephemeralExpiration: m.expiration,
                        messageId: func.rand(32)
                    })

            ])
            m.react("✅")
        }
    })
}