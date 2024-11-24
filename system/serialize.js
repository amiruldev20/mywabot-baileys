/*
terimakasih telah menggunakan source code saya. apabila ada masalah, silahkan hubungi saya
•
Thank you for using my source code. If there is a problem, please contact me

- Facebook: fb.com/amiruldev.ci
- Instagram: instagram.com/amirul.dev
- Telegram: t.me/amiruldev20
- Github: @amiruldev20
- WhatsApp: 085157489446
*/

/* module external */
import baileys from "baileys"
const {
    extractMessageContent, areJidsSameUser,
    makeWASocket, jidDecode, jidNormalizedUser, downloadMediaMessage
} = baileys
import path from "path"
import fs from "fs"
import pino from "pino"
import { fileTypeFromBuffer } from "file-type"

/* module internal */
import * as func from "./function.js"

function escapeRegExp(string) {
    return string.replace(/[.*=+:\-?^${}()|[\]\\]|\s/g, '\\$&')
}

function rand(length = 32) {
    const chars = '0123456789ABCDEF'
    let result = ''
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length)
        result += chars[randomIndex]
    }
    return result
}

/* custom client */
const parsePhoneNumber = number => {
    let cleaned = ("" + number).replace(/\D/g, "")
    if (cleaned.startsWith("62")) {
        if (cleaned.length >= 11 && cleaned.length <= 13) {
            return `+${cleaned.slice(0, 2)} ${cleaned.slice(
                2,
                6
            )} ${cleaned.slice(6, 10)} ${cleaned.slice(10)}`
        } else if (cleaned.length === 10) {
            return `+${cleaned.slice(0, 2)} ${cleaned.slice(
                2,
                4
            )} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
        }
    } else if (cleaned.startsWith("1")) {
        if (cleaned.length === 10) {
            return `+1 ${cleaned.slice(0, 3)}-${cleaned.slice(
                3,
                6
            )}-${cleaned.slice(6)}`
        } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
            return `+${cleaned.slice(0, 1)} ${cleaned.slice(
                1,
                4
            )}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
        }
    }

    return number
}

export function Client(db, ...args) {
    let sock = makeWASocket(...args)

    /* send contact */
    sock.sendContact = async (jid, number, quoted, options = {}) => {
        let list = [];
        for (let v of number) {
            if (v.endsWith('g.us')) continue;
            v = v.replace(/\D+/g, '');
            list.push({
                displayName: sock.getName(v + '@s.whatsapp.net'),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${sock.getName(v + '@s.whatsapp.net')}\nFN:${sock.getName(v + '@s.whatsapp.net')}\nitem1.TEL;waid=${v}:${v}\nEND:VCARD`,
            });
        }
        return sock.sendMessage(
            jid,
            {
                contacts: {
                    displayName: `${list.length} Contact`,
                    contacts: list,
                },
            },
            {
                quoted, ephemeralExpiration: quoted ? quoted.expiration : undefined,
                messageId: rand(32), ...options
            }
        );
    }

    /* adreply */
    sock.sendAd = async (jid, capt, quoted, opt = {}) => {
        return sock.sendMessage(
            jid,
            {
                text: capt || `${sock.user.name} Here`,
                contextInfo: {
                    isForwarded: true,
                    mentionedJid: sock.parseMention(capt),
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: opt?.idch || db.setting.ch_id,
                        serverMessageId: -1,
                        newsletterName: opt?.nch || db.setting.ch_name
                    },
                    externalAdReply: {
                        title: opt?.title || sock.user.name,
                        body: opt?.body || db.setting.dev,
                        mediaType: 2,
                        thumbnailUrl: opt?.thumbnailUrl || db.setting.logo
                    }
                }
            },
            {
                quoted: quoted || null,
                ephemeralExpiration: quoted ? quoted.expiration : undefined,
                messageId: rand(32)
            }
        )
    }

    /* adreply large */
    sock.sendAdL = async (jid, capt, quoted, opt = {}) => {
        return sock.sendMessage(
            jid,
            {
                text: capt || `${sock.user.name} Here`,
                contextInfo: {
                    isForwarded: true,
                    mentionedJid: sock.parseMention(capt),
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: opt?.idch || db.setting.ch_id,
                        serverMessageId: -1,
                        newsletterName: opt?.nch || db.setting.ch_name
                    }
                }
            },
            {
                quoted: quoted || null,
                ephemeralExpiration: quoted ? quoted.expiration : undefined,
                messageId: rand(32)
            }
        )
    }

    /* send button */
    sock.sendBtn = (jid, capt, foot, quoted, btn) => {
        const msg = {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: {
                        body: {
                            text: capt
                        },
                        footer: {
                            text: foot
                        },
                        header: {
                            //title: 'title',
                            subtitle: "subtitle",
                            hasMediaAttachment: false
                            // ...(await Baileys.prepareWAMessageMedia({ image: { url: img } }, { upload: conn.waUploadToServer }))
                        },
                        nativeFlowMessage: {
                            buttons: btn
                        },
                        contextInfo: {
                            quotedMessage: quoted.message,
                            participant: quoted.sender,
                            ...quoted.key
                        }
                    }
                }
            }
        }
        return sock.relayMessage(jid, msg, {})
    }

    /* send media */
    sock.sendMedia = async (jid, media, quoted = "", options = {}) => {
        let fetch = await func.getFile(media, false, options)
        let { mime, data, ext, sizen, filename } = fetch
        mime = options?.mimetype || mime

        let mymsg = { text: "" }
        if (sizen > 42000000)
            mymsg = {
                document: data,
                mimetype: mime,
                fileName: filename,
                ...options
            }
        else if (/image/.test(mime) && !options.asSticker)
            mymsg = {
                image: data,
                mimetype: options?.mimetype ? mime : "image/png",
                ...options
            }
        else if (options?.asSticker) mymsg = { sticker: media }
        else if (/audio/.test(mime))
            mymsg = {
                audio: data,
                mimetype: options?.mimetype ? mime : "audio/mpeg",
                ...options
            }
        else if (/video/.test(mime))
            mymsg = {
                video: data,
                mimetype: options?.mimetype ? mime : "video/mp4",
                ...options
            }
        else if (ext === "bin" || !ext) mymsg = { text: media, ...options }
        else
            mymsg = {
                document: data,
                mimetype: options?.mimetype ? options.mimetype : mime,
                fileName: filename,
                ...options
            }

        return sock.sendMessage(jid, mymsg, {
            quoted,
            ephemeralExpiration: quoted.expiration,
            messageId: rand(32),
            ...options
        })
    }

    /* get name */
    sock.getName = jid => {
        let id = jidNormalizedUser(jid)
        if (id.endsWith("g.us")) {
            let metadata = db.groupMetadata?.[id]
            return metadata ? metadata.subject : "none"
        } else {
            let metadata = db.contacts[id]
            return (
                metadata?.name ||
                metadata?.verifiedName ||
                metadata?.notify ||
                parsePhoneNumber("+" + id.split("@")[0])
            )
        }
    }

    /* download media */
    sock.downloadMediaMessage = async (message, filename) => {
        let media = await downloadMediaMessage(
            message,
            "buffer",
            {},
            {
                logger: pino({
                    timestamp: () => `,"time":"${new Date().toJSON()}"`,
                    level: "fatal"
                }).child({ class: "sock" }),
                reuploadRequest: sock.updateMediaMessage
            }
        )

        if (filename) {
            let mime = await fileTypeFromBuffer(media)
            let filePath = path.join(
                process.cwd(),
                `temp/${filename}.${mime.ext}`
            )
            await fs.promises.writeFile(filePath, media)
            return filePath
        }

        return media
    }

    /* parse tag */
    sock.parseMention = text => {
        if (typeof text === "string") {
            const matches = text.match(/@([0-9]{5,16}|0)/g) || []
            return matches.map(
                match => match.replace("@", "") + "@s.whatsapp.net"
            )
        }
    }

    /* decode jid */
    sock.decodeJid = jid => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            const decode = jidDecode(jid) || {}
            return (
                (decode.user &&
                    decode.server &&
                    `${decode.user}@${decode.server}`) ||
                jid
            )
        } else return jid
    }

    return sock
}

export async function msg(sock, msg, db) {
    const m = {}
    let ids
    if (msg.message.interactiveResponseMessage) {
        ids = JSON.parse(msg.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id
    }

    if (!msg.message) return

    if (!msg) return msg

    //let M = proto.WebMessageInfo
    m.message = parseMessage(msg.message)

    if (msg.key) {
        m.key = msg.key
        m.from = m.key.remoteJid.startsWith('status') ? jidNormalizedUser(m.key?.participant || msg.participant) : jidNormalizedUser(m.key.remoteJid)
        m.fromMe = m.key.fromMe
        m.id = m.key.id
        m.device = /^3A/.test(m.id) ? 'ios' : m.id.startsWith('3EB') ? 'web' : /^.{21}/.test(m.id) ? 'android' : /^.{18}/.test(m.id) ? 'desktop' : 'unknown'
        m.isBot = m.id.startsWith('BAE5') || m.id.startsWith('HSK')
        m.isGroup = m.from.endsWith('@g.us')
        m.participant = jidNormalizedUser(msg?.participant || m.key.participant) || false
        m.sender = jidNormalizedUser(m.fromMe ? sock.user.id : m.isGroup ? m.participant : m.from)
    }

    if (m.isGroup) {
        const groupMetadata = db?.groupMetadata?.[m.from]
            ? db.groupMetadata[m.from]
            : await sock.groupMetadata(m.from)
        const adminList = Array.isArray(groupMetadata.participants)
            ? groupMetadata.participants.filter(
                member => member.admin || member.superadmin
            )
            : Object.values(groupMetadata.participants).filter(
                member => member.admin || member.superadmin
            )
        m.isAdmin = !!adminList.find(member => member.id === m.sender)
        m.isBotAdmin = !!adminList.find(
            member => member.id === jidNormalizedUser(sock.user.id)
        )
    }

    m.pushName = msg.pushName
    m.isOwner = m.sender && db?.setting?.owner.map(v => v.replace(/[^0-9]/g, '') + "@s.whatsapp.net").includes(m.sender)
    if (m.message) {
        m.type = getContentType(m.message) || Object.keys(m.message)[0]
        m.msg = parseMessage(m.message[m.type]) || m.message[m.type]
        m.mentions = [...(m.msg?.contextInfo?.mentionedJid || []), ...(m.msg?.contextInfo?.groupMentions?.map(v => v.groupJid) || [])]
        m.body = m.msg?.text ||
            m.msg?.conversation ||
            m.msg?.caption ||
            m.message?.conversation ||
            m.msg?.selectedButtonId ||
            m.msg?.singleSelectReply?.selectedRowId ||
            m.msg?.selectedId ||
            m.msg?.contentText ||
            m.msg?.selectedDisplayText ||
            m.msg?.title ||
            m.msg?.name || ids || ""
        m.prefix = new RegExp('^[°•π÷×¶∆£¢€¥®™+✓=|/~!?@#%^&.©^]', 'gi').test(m.body) ? m.body.match(new RegExp('^[°•π÷×¶∆£¢€¥®™+✓=|/~!?@#%^&.©^]', 'gi'))[0] : ''
        m.command = m.body && m.body.trim().replace(m.prefix, '').trim().split(/ +/).shift()
        m.args =
            m.body
                .trim()
                .replace(new RegExp('^' + escapeRegExp(m.prefix), 'i'), '')
                .replace(m.command, '')
                .split(/ +/)
                .filter(a => a) || []
        m.text = m.args.join(' ').trim()
        m.expiration = m.msg?.contextInfo?.expiration || 0
        m.timestamps = typeof msg.messageTimestamp === 'number' ? msg.messageTimestamp * 1000 : m.msg.timestampMs * 1000
        m.isMedia = !!m.msg?.mimetype || !!m.msg?.thumbnailDirectPath

        m.isQuoted = false
        if (m.msg?.contextInfo?.quotedMessage) {
            m.isQuoted = true
            m.quoted = {}
            m.quoted.message = parseMessage(m.msg?.contextInfo?.quotedMessage)

            if (m.quoted.message) {
                m.quoted.type = getContentType(m.quoted.message) || Object.keys(m.quoted.message)[0]
                m.quoted.msg = parseMessage(m.quoted.message[m.quoted.type]) || m.quoted.message[m.quoted.type]
                m.quoted.isMedia = !!m.quoted.msg?.mimetype || !!m.quoted.msg?.thumbnailDirectPath
                m.quoted.key = {
                    remoteJid: m.msg?.contextInfo?.remoteJid || m.from,
                    participant: jidNormalizedUser(m.msg?.contextInfo?.participant),
                    fromMe: areJidsSameUser(jidNormalizedUser(m.msg?.contextInfo?.participant), jidNormalizedUser(sock?.user?.id)),
                    id: m.msg?.contextInfo?.stanzaId,
                }
                m.quoted.from = /g\.us|status/.test(m.msg?.contextInfo?.remoteJid) ? m.quoted.key.participant : m.quoted.key.remoteJid
                m.quoted.fromMe = m.quoted.key.fromMe
                m.quoted.id = m.msg?.contextInfo?.stanzaId
                m.quoted.device = /^3A/.test(m.quoted.id) ? 'ios' : /^3E/.test(m.quoted.id) ? 'web' : /^.{21}/.test(m.quoted.id) ? 'android' : /^.{18}/.test(m.quoted.id) ? 'desktop' : 'unknown'
                m.quoted.isBot = m.quoted.id.startsWith('BAE5') || m.quoted.id.startsWith('HSK')
                m.quoted.isGroup = m.quoted.from.endsWith('@g.us')
                m.quoted.participant = jidNormalizedUser(m.msg?.contextInfo?.participant) || false
                m.quoted.sender = jidNormalizedUser(m.msg?.contextInfo?.participant || m.quoted.from)
                m.quoted.mentions = [...(m.quoted.msg?.contextInfo?.mentionedJid || []), ...(m.quoted.msg?.contextInfo?.groupMentions?.map(v => v.groupJid) || [])]
                m.quoted.body = m.quoted.msg?.text || m.quoted.msg?.caption || m.quoted?.message?.conversation || m.quoted.msg?.selectedButtonId || m.quoted.msg?.singleSelectReply?.selectedRowId || m.quoted.msg?.selectedId || m.quoted.msg?.contentText || m.quoted.msg?.selectedDisplayText || m.quoted.msg?.title || m.quoted?.msg?.name || ''
                m.quoted.prefix = new RegExp('^[°•π÷×¶∆£¢€¥®™+✓=|/~!?@#%^&.©^]', 'gi').test(m.quoted.body) ? m.quoted.body.match(new RegExp('^[°•π÷×¶∆£¢€¥®™+✓=|/~!?@#%^&.©^]', 'gi'))[0] : ''
                m.quoted.command = m.quoted.body && m.quoted.body.replace(m.quoted.prefix, '').trim().split(/ +/).shift()
                m.quoted.args =
                    m.quoted.body
                        .trim()
                        .replace(new RegExp('^' + escapeRegExp(m.quoted.prefix), 'i'), '')
                        .replace(m.quoted.command, '')
                        .split(/ +/)
                        .filter(a => a) || []
                m.quoted.text = m.quoted.args.join(' ').trim() || m.quoted.body
                m.quoted.isOwner = m.quoted.sender && db?.setting?.owner.map(v => v.replace(/[^0-9]/g, '') + "@s.whatsapp.net").includes(m.quoted.sender)

                m.quoted.delete = async () => {
                    return await sock.sendMessage(m.from, {
                        delete: m.quoted.key
                    })
                }

                m.quoted.react = async react => {
                    return await sock.sendMessage(m.from, {
                        react: {
                            text: react,
                            key: m.quoted.key
                        }
                    })
                }

                m.quoted.download = async act => {
                    if (act) {
                        return await sock.downloadMediaMessage(
                            m.quoted ? m.quoted : m,
                            rand(7)
                        )
                    } else {
                        return await sock.downloadMediaMessage(m.quoted ? m.quoted : m)
                    }
                }


            }
        }
    }

    m.reply = async (text, trs, options = {}) => {
        const ms = typeof text === "string" && trs ? await func.tr(text, db.setting.lang) : text
        return await sock.sendMessage(
            m.from,
            typeof text === "string" ? { text: ms, ...options } : { ...text, ...options },
            {
                quoted: m,
                ephemeralExpiration: m.expiration,
                messageId: rand(32),
                ...options
            }
        )
    }

    m.delete = async () => {
        return await sock.sendMessage(m.from, {
            delete: m.quoted ? m.quoted.key : m.key
        })
    }

    m.react = async react => {
        return await sock.sendMessage(m.from, {
            react: {
                text: react,
                key: m.key
            }
        })
    }

    m.download = async act => {
        if (act) {
            return await sock.downloadMediaMessage(
                m.quoted ? m.quoted : m,
                rand(7)
            )
        } else {
            return await sock.downloadMediaMessage(m.quoted ? m.quoted : m)
        }
    }

    return m
}

function getContentType(content) {
    if (content) {
        const keys = Object.keys(content)
        const key = keys.find(k => (k === 'conversation' || k.endsWith('Message') || k.includes('V2') || k.includes('V3')) && k !== 'senderKeyDistributionMessage')
        return key
    }
}
function parseMessage(content) {
    content = extractMessageContent(content)

    if (content && content.viewOnceMessageV2Extension) {
        content = content.viewOnceMessageV2Extension.message
    }
    if (content && content.protocolMessage && content.protocolMessage.type == 14) {
        let type = getContentType(content.protocolMessage)
        content = content.protocolMessage[type]
    }
    if (content && content.message) {
        let type = getContentType(content.message)
        content = content.message[type]
    }

    return content
}