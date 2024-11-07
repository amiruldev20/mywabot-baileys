export default function (handler) {
    handler.addFunction(async (m, { sock, db, color, func }) => {
        const print = await func.loads("amiruldev/print.js")
        if (!db.groupMetadata) {
            db.groupMetadata = {}
        }

        if (m.isGroup && m.from && !db.groupMetadata[m.from]) {
            try {
                const meta = await sock.groupMetadata(m.from)
                db.groupMetadata[meta.id] = meta
                console.log(`Inserted group: ${meta.id}`)
            } catch (error) {
                console.log("Gagal insert data:", error.message)
            }
        }
        print(m, sock, db, color)
    })
}
