const axios = require('axios')

module.exports = (handler) => {
    handler.reg({
        cmd: ['instagram', 'ig', 'igdl'],
        tags: 'downloader',
        desc: 'Instagram downloader (support reel/story)',
        isLimit: true,
        run: async (m, { sock, func }) => {
            const instagramRegex = /(https?:\/\/)?(www\.)?(instagram\.com\/(p|reel|tv|stories)\/[A-Za-z0-9_-]+\/?)/
            const instagramUrl = m.text.match(instagramRegex)?.[0]
            if (!instagramUrl) {
                return m.reply('Silahkan masukan URL Instagram yang valid!', true)
            }
            const scrape = await func.loads("amiruldev/igdl.js")
            const ok = await scrape(func, m.text)

            if (!ok.data) return m.reply('Permintaan tidak dapat diproses!!', true)
            m.react("⏱️")
            await Promise.all(ok.data.map(it => sock.sendMedia(m.from, it.url, m)))
            m.react("✅")
        }
    })
}
