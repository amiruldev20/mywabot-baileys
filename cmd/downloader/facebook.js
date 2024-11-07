import * as cheerio from 'cheerio'

export default (handler) => {
    handler.reg({
        cmd: ['facebook', 'fb', 'fbdl'],
        tags: 'downloader',
        desc: 'Facebook downloader',
        isLimit: true,
        run: async (m, { sock, func }) => {
            if (!m.text) return m.reply('Silahkan masukan link facebook')
            const scrape = await func.loads("amiruldev/fbdl.js")
            const ok = await scrape(cheerio, m.text)
            if (!ok.result.url) return m.reply('Permintaan tidak dapat diproses!!')
            m.react("⏱️")
            sock.sendMedia(m.from, ok.result.hd, m)
            m.react("✅")
        }
    })
}