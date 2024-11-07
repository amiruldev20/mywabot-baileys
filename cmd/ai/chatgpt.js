import axios from 'axios';

export default (handler) => {
  handler.reg({
    cmd: ['chatgpt', 'openai'],
    tags: 'ai',
    desc: 'GPT-4o Mini',
    isLimit: true,
    run: async (m, { sock, dll }) => {
      // Fungsi untuk mengirim permintaan ke API AI
      async function ai(userid, text, model = "gpt-4o-mini") {
        try {
          const response = await axios.post('https://luminai.my.id/v2', {
            text: text,
            userId: userid,
            model: model
          });

          return response.data.reply.reply; // Mengembalikan respons dari AI
        } catch (error) {
          console.error("Terjadi kesalahan:", error.message);
          throw new Error("Gagal mendapatkan respons dari AI.");
        }
      }

      try {
        const userId = m.sender; // Teks yang ingin diajukan
        const userText = m.text; // ID pengguna (opsional)

        // Memanggil fungsi ai
        const result = await ai(userId, userText);
        
        // Cek apakah result adalah objek, dan konversi ke string jika perlu
        const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : result;

        // Mengirimkan hasil ke pengguna
        m.reply(`Respons ChatGpt:\n${output}`);
      } catch (error) {
        console.error("Error:", error.message);
        m.reply("Terjadi kesalahan dalam mendapatkan respons.");
      }
    },
  });
};
            
