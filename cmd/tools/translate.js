export default (handler) => {
    handler.reg({
        cmd: ['translate', 'tr'],
        tags: 'tools',
        desc: 'Google translate',
        run: async (m, { func }) => {
            if (m.quoted) {
                if (!m.text) return m.reply('Silahkan masukan kode bahasa', true)
                const tr = await func.loads("amiruldev/tr.js")
                const res = await tr(fetch, m.quoted.body, m.text)
                m.reply(res)
            } else {
                const last = m.text.lastIndexOf(",")
                const txt = m.text.slice(0, last).trim()
                const code = m.text.slice(last + 1).trim()

                if (!txt) return m.reply('Silahkan masukan teks\ncontoh: .tr selamat pagi,en', true)
                if (!code) return m.reply('Silahkan masukan kode bahasa\ncontoh: .tr selamat pagi,en', true)
                const tr = await func.loads("amiruldev/tr.js")
                const res = await tr(fetch, txt, code)
                m.reply(res)
            }
        }
    })
}