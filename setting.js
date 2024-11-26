/*
pengaturan lainnya ada di db.setting. anda bisa gunakan command owner. default bahasa adalah id. lakukan perintah - db.setting.lang = "en" atau kode bahasa lainnya untuk mengubahnya
-
Other settings are in db.setting. you can use the owner command. default language is id. do the command - db.setting.lang = "en" or any other language code to change it
*/
export default {
    owner: ["6282171978174"],
    typedb: "json", // use json / mongo

    /* database setting */
    db: {
        local: "mywadb.json",
        mongo: "mongodb+srv://rajifarmansyah46:rajif1707@cluster0.sndup.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    }

}
