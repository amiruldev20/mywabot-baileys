import bail, { toNumber } from 'baileys'
const { generateWAMessageFromContent, proto } = bail
export default (handler) => {
    handler.reg({
        cmd: ['add'],
        tags: 'group',
        desc: 'Add member',
        isGroup: true,
        isAdmin: true,
        isBotAdmin: true,
        run: async (m, { sock, func }) => {
            const input = m.text ? m.text : m.quoted ? m.quoted.sender : m.mentions.length > 0 ? m.mentions[0] : false
            if (!input) return m.reply('Silahkan tag / reply target', true)
            const p = await sock.onWhatsApp(input.trim())
            if (p.length == 0) return m.reply('⚠️ Nomor tidak terdaftar di WhatsApp', true)
            const jid = sock.decodeJid(p[0].jid)
            const meta = await sock.groupMetadata(m.from)
            const member = meta.participants.find(u => u.id == jid)
            if (member?.id) return m.reply('Target sudah masuk di grup!!', true)
            const resp = await sock.groupParticipantsUpdate(
                m.from,
                [jid],
                'add',
            );
            for (let res of resp) {
                if (res.status == 421) {
                    m.reply(res.content.content[0].tag)
                }
                if (res.status == 408) {
                    await m.reply(`Link grup berhasil dikirim ke @${parseInt(
                        res.jid,
                    )} karena baru saja keluar grup!!`, true, {
                        mentions: [res.jid],
                    });
                    await sock.sendMessage(res.jid, {
                        text:
                            "https://chat.whatsapp.com/" +
                            (await sock.groupInviteCode(m.from)),
                    });
                }
                if (res.status == 403) {
                    await m.reply(`Pesan invite grup telah dikirim ke @${parseInt(res.jid)}`, true, {
                        mentions: [res.jid],
                    });
                    const { code, expiration } = res.content.content[0].attrs;
                    const pp = await sock.profilePictureUrl(m.from).catch(() => null);
                    const gp = await func.getFile(pp)
                    const msgs = generateWAMessageFromContent(
                        res.jid,
                        proto.Message.fromObject({
                            groupInviteMessage: {
                                groupJid: m.from,
                                inviteCode: code,
                                inviteExpiration: toNumber(expiration),
                                groupName: await sock.getName(m.from),
                                jpegThumbnail: gp ? gp.data : null,
                                caption: "Invitation to join my WhatsApp group",
                            },
                        }),
                        { userJid: sock.user.jid },
                    );
                    await sock.sendMessage(res.jid, { forward: msgs });
                }
            }
        }
    })
}