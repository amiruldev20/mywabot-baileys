import fs from 'fs'
import path from 'path'
import archiver from 'archiver'

export default (handler) => {
    handler.reg({
        cmd: ['backup', 'b'],
        tags: 'owner',
        desc: 'Backup files, send to owner',
        isOwner: true,
        run: async (m, { sock, db }) => {
            const excludePatterns = ['.npm', 'node_modules', 'temp', 'package-lock.json']
            const rootDir = process.cwd()
            const tempDir = path.join(rootDir, 'temp')
            let backupNumber = 1

            try {
                const ownerNumber = db?.setting?.owner
                if (!ownerNumber) {
                    return m.reply('❌ Nomor owner tidak ditemukan di pengaturan.')
                }
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir, { recursive: true })
                }

                const existingBackups = fs.readdirSync(tempDir)
                    .filter(file => /^backup-\d+\.zip$/.test(file))
                    .map(file => parseInt(file.match(/^backup-(\d+)\.zip$/)[1], 10))
                    .sort((a, b) => b - a)
                if (existingBackups.length > 0) {
                    backupNumber = existingBackups[0] + 1
                }
                const backupFilename = `backup-${backupNumber}.zip`
                const output = fs.createWriteStream(path.join(tempDir, backupFilename))
                const archive = archiver('zip', { zlib: { level: 9 } })
                output.on('close', async () => {
                    console.log(`✅ File backup selesai: ${backupFilename}`)
                    const fileSizeInBytes = archive.pointer()
                    const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2) // KB
                    const fileSizeInMB = (fileSizeInKB / 1024).toFixed(2) // MB

                    let fileSize
                    if (fileSizeInMB >= 1) {
                        fileSize = `${fileSizeInMB} MB`
                    } else if (fileSizeInKB >= 1) {
                        fileSize = `${fileSizeInKB} KB`
                    }
                    try {
                        await sock.sendMessage(ownerNumber + '@s.whatsapp.net', {
                            document: { url: path.join(tempDir, backupFilename) },
                            mimetype: 'application/zip',
                            fileName: backupFilename,
                            caption: `🔒 Backup berhasil!\nNama file: ${backupFilename}\nUkuran: ${fileSize}.`,
                        })

                        m.reply(`✅ Backup selesai dan telah dikirim ke owner.`)

                    } catch (err) {
                        m.reply(`❌ Gagal mengirim file backup ke owner: ${err.message}`)
                    }
                })

                archive.on('error', (err) => {
                    throw err
                })

                archive.pipe(output)

                const addToArchive = (src) => {
                    const items = fs.readdirSync(src)

                    for (const item of items) {
                        const sourcePath = path.join(src, item)
                        if (excludePatterns.some(pattern => item.includes(pattern))) {
                            console.log(`⏩ Melewati: ${item}`)
                            continue
                        }
                        const stats = fs.statSync(sourcePath)
                        if (stats.isDirectory()) {
                            archive.directory(sourcePath, item)
                            console.log(`📁 Menambahkan folder: ${item}`)
                        } else if (stats.isFile()) {
                            archive.file(sourcePath, { name: item })
                            console.log(`✅ Menambahkan file: ${item}`)
                        }
                    }
                }

                addToArchive(rootDir)
                archive.finalize()
            } catch (error) {
                m.reply(`❌ Terjadi kesalahan: ${error.message}`)
            }
        },
    })
}
