export default (handler) => {
    handler.reg({
        cmd: ['infobot', 'botinfo'],
        tags: 'main',
        desc: 'Detail informasi bot',
        run: async (m, { db }) => {
            const jid = `${db.setting.owner}@s.whatsapp.net`
            m.reply({ text: `*Bot Information*

𖥔 Owner: @${jid.split('@')[0]}
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
> ${db.setting.packname}`, mentions: [jid] })
        }
    })
}