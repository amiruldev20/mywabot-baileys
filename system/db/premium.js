import fs from "fs"

/**
 * Tambahkan atau perbarui status premium pengguna.
 * @param {String} userId 
 * @param {Number|'PERMANENT'} duration 
 * @param {Object} db 
 */
export const addPremiumUser = (userId, duration, db) => {
    if (!db.users[userId]) {
        throw new Error('Pengguna tidak ditemukan dalam database.')
    }

    db.users[userId].premium = true
    db.users[userId].exp_prem = duration === 'PERMANENT' ? 0 : Date.now() + duration
    saveToFile(db)
}

/**
 * Simpan data ke file JSON.
 * @param {Object} db 
 */
export const saveToFile = (db) => {
    fs.writeFileSync('./mywadb.json', JSON.stringify(db, null, 2))
}

/**
 * Periksa status premium pengguna.
 * @param {String} userId 
 * @param {Object} db 
 * @returns {Boolean}
 */
export const checkPremiumUser = (userId, db) => {
    const user = db.users[userId]
    if (!user) return false

    // Periksa apakah premium masih berlaku
    if (user.premium && (user.exp_prem === 0 || user.exp_prem > Date.now())) {
        return true
    }

    // Hapus status premium jika sudah kedaluwarsa
    user.premium = false
    user.exp_prem = -1
    saveToFile(db)
    return false
}

/**
 * Dapatkan waktu kedaluwarsa premium pengguna.
 * @param {String} userId 
 * @param {Object} db 
 * @returns {String|Number}
 */
export const getPremiumExpired = (userId, db) => {
    const user = db.users[userId]
    if (!user) return null
    return user.exp_prem
}

/**
 * Periksa kedaluwarsa premium secara otomatis.
 * @param {Object} sock 
 * @param {Object} db 
 */
export const expiredCheck = (sock, db) => {
    setInterval(() => {
        Object.keys(db.users).forEach(userId => {
            const user = db.users[userId]
            if (user.premium && user.exp_prem !== 0 && user.exp_prem <= Date.now()) {
                console.log(`Premium expired: ${userId}`)
                
                // Kirim pesan ke pengguna
                sock.sendMessage(userId, {
                    text: `Premium Anda telah kedaluwarsa. Status Anda telah diatur ulang. Terima kasih telah menggunakan layanan kami.`,
                })
                user.premium = false
                user.exp_prem = -1
                user.limit = 10
            }
        })
        saveToFile(db)
    }, 1000)
}

/**
 * Dapatkan semua pengguna dengan status premium.
 * @param {Object} db 
 * @returns {Array}
 */
export const getAllPremiumUser = (db) => {
    return Object.keys(db.users).filter(userId => {
        const user = db.users[userId]
        return user.premium && (user.exp_prem === 0 || user.exp_prem > Date.now())
    })
}

