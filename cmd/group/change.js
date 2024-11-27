export default (handler) => {
    handler.reg({
        cmd: ['group', 'grup', 'gc'],
        tags: 'group',
        desc: 'Setting Group',
        isGroup: true,
        isAdmin: true,
        isBotAdmin: true,
        run: async (m, { db, sock }) => {
            const set = db.groups[m.from]
            switch (m.text) {
                case '1':
                    m.reply('_Berhasil Mengganti Setelan Grup Menjadi Anggota Dapat Mengirim Pesan!!_', true)
                    await sock.groupSettingUpdate(m.from, 'not_announcement')
                    break
                case '2':
                    m.reply('_Berhasil Mengganti Setelan Grup Menjadi Hanya Admin Yang Dapat Mengirim Pesan!!_', true)
                    await sock.groupSettingUpdate(m.from, 'announcement')
                    break
                case '3':
                    if (set.mute) {
                        m.reply('_Bot sudah dalam kondisi mute di grup ini._', true)
                    } else {
                        m.reply('_Berhasil Mute Bot Di Grup!!_', true)
                        set.mute = true
                    }
                    break
                case '4':
                    if (!set.mute) {
                        m.reply('_Bot sudah dalam kondisi unmute di grup ini._', true)
                    } else {
                        m.reply('_Berhasil Unmute Bot Di Grup!!_', true)
                        set.mute = false
                    }
                    break
                default:
                    m.reply(`_Tidak ada fitur yang ditemukan_
                
*List fitur:*
1. Open Group
2. Close Group
3. Bot Mute in Group
4. Bot Unmute in Group
example: .grup 1`, true)

            }
        }
    })
}