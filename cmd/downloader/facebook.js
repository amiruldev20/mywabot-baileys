import * as cheerio from 'cheerio'

export default (handler) => {
    handler.reg({
        cmd: ['facebook', 'fb', 'fbdl'],
        tags: 'downloader',
        desc: 'Facebook downloader',
        isLimit: true,
        run: async (m, { sock, func }) => {
            const facebookRegex = /(https?:\/\/)?(www\.)?(facebook\.com\/(watch|[A-Za-z0-9._-]+\/posts|story.php\?story_fbid=|photo.php\?fbid=)[A-Za-z0-9&?=_-]+)/
            const facebookUrl = m.text.match(facebookRegex)?.[0]
            if (!facebookUrl) {
            return m.reply('Silahkan masukan URL Facebook yang valid!', true)
            }
            const scrape = await func.loads("amiruldev/aio.js")
            const ok = await scrape(func, m.text)
            if (!ok.response.gif) return m.reply('Permintaan tidak dapat diproses!!', true)
            await m.react("⏱️")
            await sock.sendMedia(m.from, ok.response.gif.url, m, { fileName: 'FBDL-MyWABOT.mp4' })
            m.react("✅")
        }
    })
}