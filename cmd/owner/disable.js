export default (handler) => {
    handler.reg({
        cmd: ['off'],
        tags: 'owner',
        desc: 'Disable features',
        isOwner: true,
        run: async (m, { db }) => {
            const set = db.setting

            switch (m.text) {
                case '1':
                    m.reply('_First chat berhasil dinonaktifkan!!_', true)
                    set.firstchat = false
                    break
                case '2':
                    m.reply('_Read story berhasil dinonaktifkan!!_', true)
                    set.readstory = false
                    break
                case '3':
                    m.reply('_Reaction story berhasil dinonaktifkan!!_', true)
                    set.reactstory = false
                    break
                case '4':
                    m.reply('_Auto read chat berhasil dinonaktifkan!!_', true)
                    set.autoread = false
                    break
                case '5':
                    m.reply('_Self mode berhasil dinonaktifkan!!_', true)
                    set.self = false
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