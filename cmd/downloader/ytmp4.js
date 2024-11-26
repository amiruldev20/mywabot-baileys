export default (handler) => {
    handler.reg({
        cmd: ['ytmp4', 'ytv'],
        tags: 'downloader',
        desc: 'Youtube video downloader',
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
                await sock.sendMedia(m.from, json.links[0].url, m, {
                    fileName: `${json.title}.mp4`,
                    mimetype: "video/mp4",
                    caption: `*Youtube MP4 Downloader*
- Title: ${json.title}
- Description:
${json.description}
- Duration: ${json.duration}
- Size: ${json.links[0].size}`
                })

            ])
            m.react("✅")
        }
    })
}