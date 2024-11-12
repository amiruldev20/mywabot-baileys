import axios from 'axios';

export default (handler) => {
  handler.reg({
    cmd: ['lumin', 'luminai'],
    tags: 'ai',
    desc: 'Lumin AI',
    isLimit: true,
    run: async (m, { sock, dll }) => {
      // Fungsi untuk mengirim permintaan ke API Lumin AI
      async function fetchUser(content, user) {
        try {
          const response = await axios.post('https://luminai.my.id/', {
            content: content,
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
        const userId = m.sender; // ID pengguna (opsional)

        // Memanggil fetchUser dengan userId
        const result = await fetchUser(budy, userId);

        // Mengonversi result jika berbentuk objek
        const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : result;

        // Mengirimkan hasil ke pengguna
        m.reply(`Respons Lumin AI:\n${output}`);
      } catch (error) {
        console.error("Error:", error.message);
        m.reply("Terjadi kesalahan dalam mendapatkan respons.");
      }
    },
  });
};
