export default (handler) => {
    handler.reg({
        cmd: ['listban', 'listbanned'],
        tags: 'owner',
        desc: 'List all banned users',
        isOwner: true,
        run: async (m, { db }) => {
            try {
                const bannedUsers = Object.entries(db.users || {})
                    .filter(([_, data]) => data.banned)

                if (bannedUsers.length === 0) {
                    return m.reply('Tidak ada pengguna yang di-banned.', true)
                }
                let teks = `𖦏 *DAFTAR PENGGUNA YANG DI-BANNED*\n\n`
                let mentions = []

                bannedUsers.forEach(([jid, data], i) => {
                    const name = data.name || 'Tanpa Nama'
                    const tag = '@' + jid.split('@')[0]
                    teks += `${i + 1}. ${name} (${tag})\n`
                    mentions.push(jid)
                })

                m.reply(teks, null, { mentions })
            } catch (error) {
                return error
            }
        },
    })
}
