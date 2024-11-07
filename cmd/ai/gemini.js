import axios from 'axios';

export default (handler) => {
  handler.reg({
    cmd: ['gemini', 'geminiai'],
    tags: 'ai',
    desc: 'Gemini Pro',
    isLimit: true,
    run: async (m, { sock, dll }) => {
      // Fungsi untuk mengirim permintaan ke API Google Gemini AI
      async function getGeminiAIResponse(text, user) {
        try {
          const response = await axios.post('https://luminai.my.id/v3', {
            text: text,
            user: user,
          });

          return response.data.result; // Mengembalikan respons dari AI
        } catch (error) {
          console.error("Terjadi kesalahan:", error.message);
          throw new Error("Gagal mendapatkan respons dari AI.");
        }
      }

      try {
        const budy = m.text; // Teks yang ingin diajukan
        const user = m.sender; // ID pengguna (opsional)

        // Memanggil fungsi getGeminiAIResponse
        const result = await getGeminiAIResponse(budy, user);
        
        // Cek apakah result adalah objek, dan konversi ke string jika perlu
        const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : result;

        // Mengirimkan hasil ke pengguna
        m.reply(`Respons Google Gemini AI:\n${output}`);
      } catch (error) {
        console.error("Error:", error.message);
        m.reply("Terjadi kesalahan dalam mendapatkan respons.");
      }
    },
  });
};
            
