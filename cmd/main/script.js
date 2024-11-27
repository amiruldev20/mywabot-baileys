export default (handler) => {
    handler.reg({
        cmd: ['script', 'sc'],
        tags: 'main',
        desc: 'Source code',
        run: async (m) => {
            m.reply(`Script ini menggunakan https://github.com/amiruldev20/mywabot-baileys`)
        }
    })
}