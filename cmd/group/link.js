export default (handler) => {
    handler.reg({
        cmd: ['link', 'linkgc'],
        tags: 'group',
        desc: 'Get a group url',
        isAdmin: true,
        isBotAdmin: true,
        run: async (m, { sock }) => {
            const url = await sock.groupInviteCode(m.from)
            if (!url) return m.react("❌")
            m.reply("https://chat.whatsapp.com/" + url)
        }
    })
}
