import * as cheerio from 'cheerio'

export default (handler) => {
    handler.reg({
        cmd: ['facebook', 'fb', 'fbdl'],
        tags: 'downloader',
        desc: 'Facebook downloader',
        isLimit: true,
        run: async (m, { sock, func }) => {
            if (!m.text) return m.reply('Silahkan masukan link facebook/contoh: .fb https://www.facebook.com/100084113192055/videos/1260496541801423/?mibextid=BXdpk9X53FVjvJiK', true)
            const scrape = await func.loads("amiruldev/fbdl.js")
            const ok = await scrape(cheerio, m.text)
            if (!ok.result.url) return m.reply('Permintaan tidak dapat diproses!!', true)
            await m.react("⏱️")
            await sock.sendMedia(m.from, ok.result.hd, m, { fileName: 'FBDL-MyWABOT.mp4' })
            m.react("✅")
        }
    })
}