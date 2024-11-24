import axios from 'axios'
// pr from @Abuzzpoet
export default (handler) => {
  handler.reg({
    cmd: ['chatgpt', 'openai'],
    tags: 'ai',
    desc: 'ChatGpt',
    isLimit: true,
    run: async (m) => {
      if (!m.quoted && !m.text) {
        return m.reply('Silahkan masukan pertanyaan anda\ncontoh: .chatgpt siapa kamu', true)
      }
      async function fetchWithModel(content, model) {
        try {
          const response = await axios.post('https://luminai.my.id/', {
            content: content,
            model: model
          })

          return response.data.result
        } catch (error) {
          return error
        }
      }

      try {
        const budy = m.quoted ? m.quoted.body : m.text
        const model = 'gpt-4o'
        const result = await fetchWithModel(budy, model)

        const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : result
        m.reply(output, true)
      } catch {
        m.reply("Terjadi kesalahan dalam mendapatkan respons.", true)
      }
    },
  })
}
