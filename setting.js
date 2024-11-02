/*
pengaturan lainnya ada di db.setting. anda bisa gunakan command owner
*/
export default {
    owner: ["6285157489446"],
    typedb: "mongo", // use json,mongo

    /* database setting */
    db: {
        local: "mywadb.json",
        mongo: "mongodb+srv://@cluster0.000be.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    }

}
