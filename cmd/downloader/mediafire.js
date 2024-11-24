export default (handler) => {
    handler.reg({
        cmd: ['mediafire', 'mf'],
        tags: 'downloader',
        desc: 'Mediafire downloader',
        isLimit: true,
        run: async (m, { func, sock }) => {
            if (!m.text) return m.reply('Silahkan masukan url mediafire\ncontoh: .mediafire https://www.mediafire.com/file/jzn9gfjkupdmwou/Simple-Botz-V3_share_by_misterius.zip/file', true)
            await m.react("⏱️")
            const gmf = await func.loads("amiruldev/mediafire.js")
            const res = await gmf(func, m.text)
            sock.sendMedia(m.from, res.download, m, { fileName: res.filename, mimetype: res.mimetype })
            m.react("✅")
        }
    })
}