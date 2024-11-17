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
                    .map(([jid, data], i) => `${i + 1}. ${data.name || 'Tanpa Nama'} (${jid})`)

                    if (bannedUsers.length === 0) {
                        return m.reply('Tidak ada pengguna yang di-banned.', true)
                    }

                    m.reply(`Daftar Pengguna yang Di-banned:\n\n${bannedUsers.join('\n')}`)
                } catch (error) {
                    m.reply(`❌ Terjadi kesalahan: ${error.message}`)
                }
            },
        },
    )
}
