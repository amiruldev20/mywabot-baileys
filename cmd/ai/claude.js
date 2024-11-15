import axios from 'axios'
export default (handler) => {
  handler.reg({
    cmd: ['claude', 'claudeai'],
    tags: 'ai',
    desc: 'Claude-Sonnet-3.5',
    isLimit: true,
    run: async (m) => {
      if (!m.quoted && !m.text) {
        return m.reply('Silahkan masukan pertanyaan anda\ncontoh: .claude siapa kamu', true)
      }
      async function fetchWithModel(content, model) {
        try {
          const response = await axios.post('https://luminai.my.id/', {
            content: content,
            model: model
          })

          return response.data.result
        } catch (error) {
          console.error("Terjadi kesalahan:", error.message)
          throw new Error("Gagal mendapatkan respons dari AI.")
        }
      }

      try {
        const model = 'claude-sonnet-3.5'
        const result = await fetchWithModel(m.quoted ? m.quoted.body : m.text, model)
        const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : result
        m.reply(output)
      } catch (error) {
        console.error("Error:", error.message)
        m.reply("Terjadi kesalahan dalam mendapatkan respons.", true)
      }
    },
  })
}
