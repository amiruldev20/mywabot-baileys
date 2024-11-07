export default (handler) => {
    handler.reg({
        cmd: ['info', 'botinfo'],
        tags: 'main',
        desc: 'Detail informasi bot',
        run: async (m, { db }) => {
            m.reply(`*Bot Information*

𖥔 Owner: @${db.setting.owner}
𖥔 Firstchat: ${db.setting.firstchat ? '*Active* ✅' : '*Non Active* ❌'}
𖥔 Read Story WhatsApp: ${db.setting.readstory ? '*Active* ✅' : '*Non Active* ❌'}
𖥔 Reaction Story: ${db.setting.reactstory ? '*Active* ✅' : '*Non Active* ❌'}
𖥔 Auto Read Chat: ${db.setting.autoread ? '*Active* ✅' : '*Non Active* ❌'}
𖥔 Mode Self: ${db.setting.self ? '*Active* ✅' : '*Non Active* ❌'}
𖦏 ID Channel: 
> ${db.setting.ch_id}
𖦏 Name Channel: 
> ${db.setting.ch_name}
𖦏 Logo: 
> ${db.setting.logo}
𖦏 Packname Sticker: 
> ${db.setting.packname}`, { mentions: [db.setting.owner + '@s.whatsapp.net'] })
        }
    })
}