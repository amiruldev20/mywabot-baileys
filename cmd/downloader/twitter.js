import * as cheerio from 'cheerio'
export default (handler) => {
    handler.reg({
        cmd: ['twitter', 'twit', 'twitdl', 'xdl'],
        tags: 'downloader',
        desc: 'Twitter / X downloader',
        isLimit: true,
        run: async (m, { sock, func }) => {
            const xRegex = /(https?:\/\/)?(www\.)?(x\.com\/[A-Za-z0-9]+)/
            const xUrl = m.text.match(xRegex)?.[0]
            if (!xUrl) {
              return m.reply('Silahkan masukan URL X yang valid!', true)
            }
            const scrape = await func.loads("amiruldev/twitdl.js")
            const ok = await scrape(cheerio, m.text)
            if (!ok.status === 'ok') return m.reply('Permintaan tidak dapat diproses!!', true)
            m.react("⏱️")
            await Promise.all(ok.images.map(it => sock.sendMedia(m.from, it.download, m)))
            m.react("✅")
        }
    })
}