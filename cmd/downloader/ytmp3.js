export default (handler) => {
    handler.reg({
        cmd: ['ytmp3', 'yta'],
        tags: 'downloader',
        desc: 'Youtube audio downloader',
        isLimit: true,
        run: async (m, { func, sock }) => {
            if (!m.text) return m.reply('Silahkan masukan url video youtube', true)
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