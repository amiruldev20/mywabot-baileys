export default (handler) => {
    handler.reg({
        cmd: ['delete', 'del'],
        tags: 'main',
        desc: 'Delete message',
        run: async (m) => {
            if (m.quoted) {
                await m.quoted.delete()
            } else {
                await m.delete()
            }
        }
    })
}