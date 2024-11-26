export default (handler) => {
    handler.reg({
        cmd: ['join'],
        tags: 'owner',
        desc: 'Join a group using an invite link',
        isOwner: true,
        run: async (m, { sock }) => {
            try {
                const text = m.text && m.text.trim()
                if (!text) {
                    m.reply('❌ Harap berikan tautan undangan grup yang valid.\n\n*Penggunaan:*\n.join https://chat.whatsapp.com/XXXXXX')
                    return
                }

                const inviteCode = text.split("https://chat.whatsapp.com/")[1]
                if (!inviteCode) {
                    m.reply('❌ Tautan undangan grup tidak valid. Harap berikan tautan yang benar.')
                    return
                }

                const groupId = await sock.groupAcceptInvite(inviteCode).catch((err) => {
                    if (err.message.includes('already in group')) {
                        throw new Error('Bot sudah menjadi anggota grup ini.')
                    }
                    throw err
                })

                const groupMeta = await sock.groupMetadata(groupId)
                const groupName = groupMeta.subject || 'grup tersebut'
                const groupAdmins = groupMeta.participants
                    .filter((p) => ['admin', 'superadmin'].includes(p.admin))
                    .map((p) => p.id)

                if (groupAdmins.length === 0) {
                    m.reply(`✅ Bot berhasil bergabung ke grup *${groupName}*.\nNamun, tidak ada admin untuk memberi bot akses sebagai admin.`)
                    return
                }

                const adminMessage = `✅ Bot telah bergabung ke grup *${groupName}*.\n\nAdmin, silakan berikan akses admin kepada bot jika diperlukan.`

                for (const admin of groupAdmins) {
                    try {
                        await sock.sendMessage(admin, { text: adminMessage })
                    } catch (err) {
                        m.reply(`❌ Gagal mengirim pesan ke admin: @${admin.split('@')[0]} (${err.message})`)
                    }
                }

                m.reply(`🔄 Permintaan telah dikirim ke admin grup untuk memberikan akses admin kepada bot di grup *${groupName}*.`)
            } catch (error) {
                if (error.message === 'Bot sudah menjadi anggota grup ini.') {
                    m.reply('⚠️ Bot sudah berada di grup ini.')
                } else {
                    m.reply(`❌ Terjadi kesalahan: ${error.message}`)
                }
            }
        },
    })
}
