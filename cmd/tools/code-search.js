export default (handler) => {
    handler.reg({
        cmd: ['code'],
        tags: 'tools',
        desc: 'Search GitHub code',
        run: async (m, { func }) => {
            try {
                const ghc = await func.loads("amiruldev/ghcode.js")
                const json = await ghc(fetch, m.text) 
                if (!json.items || json.items.length === 0) {
                    return m.reply("No results found.")
                }

                let capt = `*GitHub Code Search*\n\n♣︎ Total Result: ${json.total_count}\n\n`

                for (const item of json.items) {
                    const fileResponse = await fetch(item.url, {
                        headers: {
                            Authorization: `Bearer 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`,
                            Accept: "application/vnd.github+json",
                        }
                    })
                    const fileData = await fileResponse.json()
                    // console.log(fileData)
                    capt += `- Owner Name: ${item.repository.owner.login}\n`
                    capt += `- Filepath: ${item.path}\n`
                    capt += `- Link Repo: ${item.repository.html_url}\n`
                    capt += `- Description: ${item.repository.description}\n`
                    capt += `- Raw File URL: ${fileData.download_url}\n\n`
                }

                m.reply(capt)
            } catch (error) {
                console.error(error)
                m.reply("An error occurred while searching GitHub code.")
            }
        }
    })
}
