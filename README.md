[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#table-of-contents)
### MywaBot (WhatsApp Bot Baileys 2024-2025)
[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#table-of-contents)
- [x] Support Single & Multi Handler
- [x] Support CommonJs & ESM
- [x] Stable On Ram 350MB
- [x] Support Termux, VPS, RDP (Windows)
- [x] Support Panel Pterodactyl
- [x] Support cPanel, Plesk
- [x] Support Session Internal (Json) & External (MongoDB)
- [ ] Support Case (Soon)
- [ ] Support Multi Type Plugins (Soon)
- [ ] Support Running Code Python (Soon)
- [ ] Support Running Code Shell Script - Bash (Soon)

#### [ID] ADD PLUGINS CMD? SCROLL KE BAWAH
#### [EN] ADD PLUGINS CMD? SCROLL BELOW

### Official Channel & Group
> Link Group [Click Here](https://chat.whatsapp.com/JbzMsezhCwUKdC6dnjwcIz)
> 
> Info Update [Follow Channel](https://whatsapp.com/channel/0029VaF1UTpJ3jv1GsFYi302)
### Requirements
- [x] NodeJS >= 18 (Recommended v18)
- [x] FFMPEG & WEBPMUX
- [x] Server vCPU/RAM Min 350/500 MB
- [x] FFMPEG & IMAGEMAGICK

<details>
 <summary>🔥 Premium Source Code (Soon)</summary>
 
### Premium Script V 1.0.1
🏷 Price: **Rp 50.000,00 / Month** + Server Pterodactyl
 
### Features
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
</details>

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
