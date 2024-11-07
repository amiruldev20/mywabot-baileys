[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#table-of-contents)
## MywaBot (BAILEYS)
#### Support single / Multi Plugins
> Bot ini dibuat menggunakan library [Baileys](https://github.com/WhiskeySockets/Baileys)
> Bot ini menggunakan session external (mongodb) & database mongodb
> jika ingin fitur lengkap (include my api) + database multi (mysql, mongoodb, firebase, localdb) & support command via vn silahkan beli premium
#### ADD PLUGINS? BACA SAMPE BAWAH
# Join Official Group
> masuk ke grup seputar bot [disini](https://chat.whatsapp.com/JbzMsezhCwUKdC6dnjwcIz)
### Requirements
- [x] NodeJS >= 18 (Recommended v18)
- [x] FFMPEG & WEBPMUX
- [x] Server vCPU/RAM 500/1GB (Min)
### Server Support
- [x] NAT VPS [Hostdata](https://hostdata.id/nat-vps-usa/)  (Recommended)
- [x] Hosting Pterodactyl - [Free Host](https://optiklink.com)
- [x] RDP Windows
- [x] Termux
# Premium Script V1.0.1
🏷 Paket Bulanan: **Rp 35.000,00 / Bulan**
🏷 Paket Lifetime: **Rp 180.000,00 / Lifetime**
### Spesifikasi Paket Bulanan
- Multi Database (mysql,localdb,mongoodb,firebase)
- Support Command With VN
- Free Update (Selagi Mentaati Rules)
- Free Support
- Free Fix Bug
### Fitur Paket Plan Berbayar
 - Convert Menu (sticker, to audio, to image, to anime, tts, to document, sticker meme, carbon, attp, ttp, read viewonce)
 - Ai Menu (You ai,Bing Ai, Chatgpt Ai, GPT Turbo, GPT 4)
 - Downloader (Facebook, Instagram, Tiktok, Twitter, Apple, Spotify, Youtube, Sfile, Webdriver, Sticker Tele Downloader)
 - Tools (Ocr, Check Gempa, Google Search, Search Resep Masak, Search Shopee, Search Toko Pedia, Search Pinterest, Upload File, Short URL, Translate, Inspect Web, Remini, Remove bg)
 - Fun Menu (Tebak Gambar, Tebak Bendera, Tebak Lagu, Tebak Surah)
 - E-Topup (Game, Pulsa, Data, Voucher, PLN, Emoney, etc) (full auto)
 - Pterodactyl (order server, manage server, etc) (full auto payment)
 - E-Shop (Add product, order product, delete product) (full auto)
 - Group (add, kick, close/open gc, accept/reject request member, set pp, set desc, change link, get link, hidetag, total chat)
 - etc
### Add Plugins Command Support Multi
```Javascript
export default (handler) => {
    handler.reg({
        cmd: ['command1', 'command2'],
        tags: 'main',
        desc: 'Deskripsi command',
        isLimit: true,
        ...opsi lain,
        run: async (m, { sock, dll }) => {
            m.reply("hello world")
        }
    })
// tambahkan lagi seperti ini jika ingij 1 file 2 fitur/lebih
    handler.reg({
        cmd: ['command1', 'command2'],
        tags: 'main',
        desc: 'Deskripsi command',
        isLimit: true,
        ...opsi lain,
        run: async (m, { sock, dll }) => {
            m.reply("hello world")
        }
    })
}
```
> command 1 didalam cmd itu yang nanti akan ditampilkan di list menu
> islimit jika true = memotong 1 limit, jika ingin potong 2/3 limit jadikan isLimit: 2, sesuaikan nominal yang kamu mau
> ...Opsi lain itu adalah opsional seperti dibawah ini
1. isOwner
2. isAdmin
3. isBotAdmin
4. isGroup
5. isPrivate
> contoh penggunaan: isOwner: true,
> unuk opsi dll setelah sock itu adalah (sock, db, util, color, func, scraper)
### Add Handler Function
```Javascript
export default function (handler) {
    handler.addFunction(async (m, { sock, dll }) => {
        if (m.body === "bot") return m.reply(" hello")
    })
}
```
> isi dll sama seperti contoh plugins db, util dll
