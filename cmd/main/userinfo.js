import moment from "moment-timezone"
import { getPremiumExpired } from "../../system/db/premium.js"

export default (handler) => {
    handler.reg({
        cmd: ['info', 'userinfo'],
        tags: 'main',
        desc: 'Detail informasi user',
        run: async (m, { db }) => {
            const jid = m.sender
            const set = db.users[jid]
            m.reply({ text :`*user Information*

𖥔 Nama: @${jid.split('@')[0]}
𖥔 Premium: ${set.premium ? '*Active* ✅' : '*Non Active* ❌'}
𖥔 Limit: ${set.limit}`, mentions: [jid] })
        }
    })
}