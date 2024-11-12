import axios from 'axios';

export default (handler) => {
  handler.reg({
    cmd: ['chatgpt', 'openai'],
    tags: 'ai',
    desc: 'ChatGpt',
    isLimit: true,
    run: async (m) => {
      // Fungsi untuk mengirim permintaan ke API Lumin AI dengan model tertentu
      async function fetchWithModel(content, model) {
        try {
          const response = await axios.post('https://luminai.my.id/', {
            content: content,
            model: model
          });

          return response.data.result;
        } catch (error) {
          console.error("Terjadi kesalahan:", error.message);
          throw new Error("Gagal mendapatkan respons dari AI.");
        }
      }

      try {
        const budy = m.text; // Teks yang ingin diajukan
        const model = 'gpt-4o'; // Model default atau Anda dapat membuatnya dinamis berdasarkan kebutuhan

        // Memanggil fetchWithModel dengan model yang ditentukan
        const result = await fetchWithModel(budy, model);

        // Mengonversi result jika berbentuk objek
        const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : result;

        // Mengirimkan hasil ke pengguna
        m.reply(`Respons ChatGpt AI:\n${output}`);
      } catch (error) {
        console.error("Error:", error.message);
        m.reply("Terjadi kesalahan dalam mendapatkan respons.");
      }
    },
  });
};
