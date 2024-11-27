import speedTest from "speedtest-net"

export default (handler) => {
    handler.reg({
        cmd: ['speedtest', 'speed'],
        tags: 'main',
        desc: 'Test internet speed',
        run: async (m) => {
            await m.reply("🔄 Testing Speed...")
            try {
                const test = await speedTest({
                    acceptLicense: true,
                    acceptGdpr: true,
                })

                const convertSpeed = (speed) => {
                    const mbps = speed / 125_000
                    return mbps > 1000
                        ? `${(mbps / 1000).toFixed(2)} Gbps`
                        : `${mbps.toFixed(2)} Mbps`
                }

                const downloadSpeed = convertSpeed(test.download.bandwidth)
                const uploadSpeed = convertSpeed(test.upload.bandwidth)
                const latency = test.ping.latency
                const serverName = test.server.name
                const serverLocation = `${test.server.location}, ${test.server.country}`

                m.reply(`
🔍 *Speed Test Results*
📶 Latency: ${latency} ms
⬆️ Upload Speed: ${uploadSpeed}
⬇️ Download Speed: ${downloadSpeed}
🌐 Server: ${serverName} (${serverLocation})`)
            } catch (error) {
                return error
            }
        },
    })
}