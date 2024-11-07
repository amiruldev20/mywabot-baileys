import axios from 'axios';

export default (handler) => {
    handler.reg({
        cmd: ['chatgpt', 'openai'],
        tags: 'ai',
        desc: 'GPT-4o Mini',
        isLimit: true,
        run: async (m) => {
            async function ai(userid, text, model = "gpt-4o-mini") {
                try {
                    const response = await axios.post('https://luminai.my.id/v2', {
                        text: text,
                        userId: userid,
                        model: model
                    });

                    return response.data.reply.reply;
                } catch (error) {
                    console.error("Terjadi kesalahan:", error.message);
                    throw new Error("Gagal mendapatkan respons dari AI.");
                }
            }

            try {
                const userId = m.sender;
                const userText = m.text;

                const result = await ai(userId, userText);
                const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : result;
                m.reply(output);
            } catch (error) {
                console.error("Error:", error.message);
                m.reply("Terjadi kesalahan dalam mendapatkan respons.");
            }
        },
    });
};

