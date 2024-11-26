export default (handler) => {
    handler.reg({
        cmd: ['leave'],
        tags: 'owner',
        desc: 'leave the group',
        isOwner: true,
        isGroup: true,
        run: async (m, { sock, db }) => {
            try {
                const groupId = m.from
                const groupMeta = await sock.groupMetadata(groupId)
                const groupName = groupMeta.subject
                const ownerNumber = db?.setting?.owner
                if (!ownerNumber) {
                    return m.reply('❌ Nomor owner tidak ditemukan di pengaturan.')
                }

                await sock.sendMessage(groupId, {
                    text: `⚠️ Bot akan keluar dari grup *${groupName}* dalam beberapa detik.`
                })

                await sock.sendMessage(ownerNumber + '@s.whatsapp.net', {
                    text: `⚠️ Bot akan keluar dari grup *${groupName}*\n(${groupId}).`
                })

                await sock.groupLeave(groupId)
                m.reply(`✅ Bot telah keluar dari grup *${groupName}*.`)
            } catch (error) {
                m.reply(`❌ Terjadi kesalahan: ${error.message}`)
            }
        },
    })
}
