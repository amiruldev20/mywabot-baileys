export default (handler) => {
    handler.reg({
        cmd: ['owner', 'ceo'],
        tags: 'main',
        desc: 'Contact owner bot',
        run: async (m, { sock, db }) => {
            sock.sendContact(m.from, db.setting.owner, m)
        }
    })
}