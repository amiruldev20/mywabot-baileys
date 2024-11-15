export default (handler) => {
    handler.reg({
        cmd: ['waifu'],
        tags: 'anime',
        desc: 'get waifu pic',
        run: async (m, { sock }) => {
            const getUrl = await fetch(`https://api.waifu.im/search?included_tags=waifu`)
            const jsonUrl = await getUrl.json()
            const picUrl = jsonUrl.images[0].url
            m.react("⏱️")
            await sock.sendMedia(m.from, picUrl, m);
            m.react("✅")
        }
    })
}
