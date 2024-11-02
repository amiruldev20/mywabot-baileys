export default (handler) => {
    handler.reg({
        cmd: ['restart', 'r'],
        tags: 'owner',
        desc: 'Restart bot',
        noPrefix: true,
        isOwner: true,
        run: async (m) => {
            await m.reply("Restarting...")
            process.send('reset')
        }
    })
}