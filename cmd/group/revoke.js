export default (handler) => {
    handler.reg({
        cmd: ['revoke', 'revokelink', 'revokegc'],
        tags: 'group',
        desc: 'Revoke a group url',
        isAdmin: true,
        isBotAdmin: true,
        run: async (m, { sock }) => {
            const url = await sock.groupRevokeInvite(m.from)
            if (!url) return m.react("❌")
            m.reply('https://chat.whatsapp.com/' + url)
        }
    })
}
