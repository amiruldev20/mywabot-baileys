import moment from 'moment-timezone'

export default (handler) => {
    handler.reg({
        cmd: ['listgrup', 'listgc', 'listgroup'],
        tags: 'owner',
        desc: 'List groups connected with bot',
        isOwner: true,
        run: async (m, { sock }) => {
            try {
                // Mengambil daftar semua grup yang bot ikuti
                const groups = await sock.groupFetchAllParticipating()
                const groupList = Object.values(groups)

                if (groupList.length === 0) {
                    return m.reply('⚠️ Bot tidak terhubung dengan grup mana pun.')
                }

                // Menyusun informasi grup
                let teks = `𖦏 *LIST GROUP CHAT*\n\nTotal Grup: ${groupList.length} Grup\n\n`
                let mentions = [] // Menyimpan semua mention

                for (let i = 0; i < groupList.length; i++) {
                    const group = groupList[i]
                    const metadata = await sock.groupMetadata(group.id).catch(() => null)
                    
                    if (metadata) {
                        teks += `𖥔 Nama: ${metadata.subject}\n`
                        if (metadata.owner !== undefined) {
                            const ownerJid = metadata.owner
                            const ownerTag = '@' + ownerJid.split('@')[0]
                            teks += `𖥔 Owner: ${ownerTag}\n`
                            mentions.push(ownerJid) // Menambahkan owner ke daftar mention
                        } else {
                            teks += `𖥔 Owner: Tidak diketahui\n`
                        }
                        teks += `𖥔 ID: ${metadata.id}\n`
                        teks += `𖥔 Dibuat: ${moment(metadata.creation * 1000)
                            .tz('Asia/Jakarta')
                            .format('DD/MM/YYYY HH:mm:ss')}\n`
                        teks += `𖥔 Member: ${metadata.participants.length}\n`
                        teks += `────────────────────────\n\n`
                    } else {
                        teks += `${i + 1}. *${group.subject}*\n(ID: ${group.id})\n\n`
                    }
                }

                // Mengirim balasan dengan mention
                m.reply(teks, null, { mentions })
            } catch (error) {
                m.reply(`❌ Terjadi kesalahan: ${error.message}`)
            }
        },
    })
}
