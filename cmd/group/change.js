export default (handler) => {
    handler.reg({
        cmd: ['group', 'grup', 'gc'],
        tags: 'main',
        desc: 'open group and close group',
        isGroup: true,
        isAdmin: true,
        isBotAdmin: true,
        run: async (m, { sock }) => {
            switch (m.text) {
                case '1':
                    m.reply('_Berhasil Mengganti Setelan Grup Menjadi Anggota Dapat Mengirim Pesan!!_', true)
                    await sock.groupSettingUpdate(m.from, 'not_announcement')
                    break
                case '2':
                    m.reply('_Berhasil Mengganti Setelan Grup Menjadi Hanya Admin Yang Dapat Mengirim Pesan!!_', true)
                    await sock.groupSettingUpdate(m.from, 'announcement')
                    break
                default:
                    m.reply(`_Tidak ada fitur yang ditemukan_
                
*List fitur:*
1. Open Group
2. Close Group
example: .grup 1`, true)

            }
        }
    })
}