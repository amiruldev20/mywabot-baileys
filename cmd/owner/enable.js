export default (handler) => {
    handler.reg({
        cmd: ['on'],
        tags: 'owner',
        desc: 'Enable features',
        isOwner: true,
        run: async (m, { db }) => {
            const set = db.setting

            switch (m.text) {
                case '1':
                    m.reply('_First chat berhasil diaktifkan!!_', true)
                    set.firstchat = true
                    break
                case '2':
                    m.reply('_Read story berhasil diaktifkan!!_', true)
                    set.readstory = true
                    break
                case '3':
                    m.reply('_Reaction story berhasil diaktifkan!!_', true)
                    set.reactstory = true
                    break
                case '4':
                    m.reply('_Auto read chat berhasil diaktifkan!!_', true)
                    set.autoread = true
                    break
                case '5':
                    m.reply('_Self mode berhasil diaktifkan!!_', true)
                    set.self = true
                    break
                default:
                    m.reply(`_Tidak ada fitur yang ditemukan_
                
*List fitur:*
1. First chat
2. Read story
3. Reaction story
4. Auto read chat
5. Self mode

example: .on 1`, true)

            }
        }
    })
}