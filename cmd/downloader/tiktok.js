import axios from 'axios'

export default (handler) => {
    handler.reg({
        cmd: ['tiktok', 'tt', 'tiktokdl', 'ttdl'],
        tags: 'downloader',
        desc: 'Download tiktok video',
        isLimit: true,
        run: async (m, { func, sock }) => {
            if (!m.text) return m.reply('Silahkan masukan url video tiktok!!', true)
            const ttdl = await func.loads('amiruldev/ttdl.js')
            const json = await ttdl(axios, m.text)
            if (!json.status) return m.reply(json.message, true)
            const capt = `*ᬊ TIKTOK DOWNLOADER ᬊ*
    
ID: ${json.result.data.id}
Size: ${json.result.data.size ? func.formatSize(json.result.data.size) : "none"}
Author:
- Name: ${json.result.data.author.nickname}
- Username: ${json.result.data.author.unique_id}
    
Music Info:
- Title: ${json.result.data.music_info.title}
- Author: ${json.result.data.music_info.author}
    
Play Count: ${func.formatNumber(json.result.data.play_count)}
Comment Count: ${func.formatNumber(json.result.data.comment_count)}
Share Count: ${func.formatNumber(json.result.data.share_count)}
Download Count: ${func.formatNumber(json.result.data.download_count)}
    
Caption:
${json.result.data.title}`
            if (json.result.data.images) {
                json.result.data.images.forEach(it => {
                    sock.sendMedia(m.from, it, m, { caption: capt })
                })
            } else {
                await sock.sendMedia(m.from, json.result.data.play, m, {
                    caption: capt
                })
            }
            sock.sendMedia(m.from, json.result.data.music, m)
        }
    })
}