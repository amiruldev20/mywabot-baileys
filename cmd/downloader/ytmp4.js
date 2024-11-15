export default (handler) => {
    handler.reg({
        cmd: ['ytmp4', 'ytv'],
        tags: 'downloader',
        desc: 'Youtube video downloader',
        isLimit: true,
        run: async (m, { func, sock }) => {
            if (!m.text) return m.reply('Silahkan masukan url video youtube', true)
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