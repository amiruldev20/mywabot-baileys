import axios from 'axios'
// pr from @Abuzzpoet
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
          return error
        }
      }

      try {
        const model = 'claude-sonnet-3.5'
        const result = await fetchWithModel(m.quoted ? m.quoted.body : m.text, model)
        const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : result
        m.reply(output, true)
      } catch {
        m.reply("Terjadi kesalahan dalam mendapatkan respons.", true)
      }
    },
  })
}
