export default (handler) => {
    handler.reg({
        cmd: ['setnamebot', 'setname'],
        tags: 'owner',
        desc: 'Change your bot name',
        isOwner: true,
        run: async (m, { sock }) => {
            if (!m.text) {
                return m.reply('Silahkan berikan nama bot anda\ncontoh: .setnamabot MyWaBot', true)
            }
            sock.updateProfileName(m.text)
            m.reply(`Nama bot berhasil berganti menjadi, @${m.text}`)
        }
    });
};

