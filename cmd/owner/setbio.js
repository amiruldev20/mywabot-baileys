export default (handler) => {
    handler.reg({
        cmd: ['setbiobot', 'setbio'],
        tags: 'owner',
        desc: 'Change your bot bio',
        isOwner: true,
        run: async (m, { sock }) => {
            if (!m.text) {
                return m.reply('Silahkan berikan bio bot anda\ncontoh: .setbiobot MyWaBot', true)
            }
            sock.updateProfileStatus(m.text)
            m.reply(`bio bot berhasil berganti menjadi, ${m.text}`)
        }
    });
};

