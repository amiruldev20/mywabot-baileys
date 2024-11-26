/*
terimakasih telah menggunakan source code saya. apabila ada masalah, silahkan hubungi saya
•
Thank you for using my source code. If there is a problem, please contact me

- Facebook: fb.com/amiruldev.ci
- Instagram: instagram.com/amirul.dev
- Telegram: t.me/amiruldev20
- Github: @amiruldev20
- WhatsApp: 085157489446
*/

const styles = {
    modifier: {
        reset: [0, 0],
        // 21 isn't widely supported and 22 does the same thing
        bold: [1, 22],
        dim: [2, 22],
        italic: [3, 23],
        underline: [4, 24],
        overline: [53, 55],
        inverse: [7, 27],
        hidden: [8, 28],
        strikethrough: [9, 29],
    },
    color: {
        black: [30, 39],
        red: [31, 39],
        green: [32, 39],
        yellow: [33, 39],
        blue: [34, 39],
        magenta: [35, 39],
        cyan: [36, 39],
        white: [37, 39],

        // Bright color
        blackBright: [90, 39],
        gray: [90, 39], // Alias of `blackBright`
        grey: [90, 39], // Alias of `blackBright`
        redBright: [91, 39],
        greenBright: [92, 39],
        yellowBright: [93, 39],
        blueBright: [94, 39],
        magentaBright: [95, 39],
        cyanBright: [96, 39],
        whiteBright: [97, 39],
    },
    bgColor: {
        black: [40, 49],
        red: [41, 49],
        green: [42, 49],
        yellow: [43, 49],
        blue: [44, 49],
        magenta: [45, 49],
        cyan: [46, 49],
        white: [47, 49],

        // Bright color
        blackBright: [100, 49],
        gray: [100, 49], // Alias of `bgBlackBright`
        grey: [100, 49], // Alias of `bgBlackBright`
        redBright: [101, 49],
        greenBright: [102, 49],
        yellowBright: [103, 49],
        blueBright: [104, 49],
        magentaBright: [105, 49],
        cyanBright: [106, 49],
        whiteBright: [107, 49],
    },
}

function applyStyle(text, style) {
    const [start, end] = style
    return `\x1b[${start}m${text}\x1b[${end}m`
}

const Color = {
    bold: (text) => applyStyle(text, styles.modifier.bold),

    // background
    bgBlack: (text) => applyStyle(text, styles.bgColor.black),
    bgRed: (text) => applyStyle(text, styles.bgColor.red),
    bgGreen: (text) => applyStyle(text, styles.bgColor.green),
    bgYellow: (text) => applyStyle(text, styles.bgColor.yellow),
    bgBlue: (text) => applyStyle(text, styles.bgColor.blue),
    bgMagenta: (text) => applyStyle(text, styles.bgColor.magenta),
    bgCyan: (text) => applyStyle(text, styles.bgColor.cyan),
    bgWhite: (text) => applyStyle(text, styles.bgColor.white),
    bgBlackBright: (text) => applyStyle(text, styles.bgColor.blackBright),
    bgGray: (text) => applyStyle(text, styles.bgColor.gray),
    bgBrey: (text) => applyStyle(text, styles.bgColor.grey),
    bgRedBright: (text) => applyStyle(text, styles.bgColor.redBright),
    bgGreenBright: (text) => applyStyle(text, styles.bgColor.greenBright),
    bgYellowBright: (text) => applyStyle(text, styles.bgColor.yellowBright),
    bgBlueBright: (text) => applyStyle(text, styles.bgColor.blueBright),
    bgMagentaBright: (text) => applyStyle(text, styles.bgColor.magentaBright),
    bgCyanBright: (text) => applyStyle(text, styles.bgColor.cyanBright),
    bgWhiteBright: (text) => applyStyle(text, styles.bgColor.whiteBright),

    // text
    black: (text) => applyStyle(text, styles.color.black),
    red: (text) => applyStyle(text, styles.color.red),
    green: (text) => applyStyle(text, styles.color.green),
    yellow: (text) => applyStyle(text, styles.color.yellow),
    blue: (text) => applyStyle(text, styles.color.blue),
    magenta: (text) => applyStyle(text, styles.color.magenta),
    cyan: (text) => applyStyle(text, styles.color.cyan),
    white: (text) => applyStyle(text, styles.color.white),
    blackBright: (text) => applyStyle(text, styles.color.blackBright),
    gray: (text) => applyStyle(text, styles.color.gray),
    grey: (text) => applyStyle(text, styles.color.grey),
    redBright: (text) => applyStyle(text, styles.color.redBright),
    greenBright: (text) => applyStyle(text, styles.color.greenBright),
    yellowBright: (text) => applyStyle(text, styles.color.yellowBright),
    blueBright: (text) => applyStyle(text, styles.color.blueBright),
    magentaBright: (text) => applyStyle(text, styles.color.magentaBright),
    cyanBright: (text) => applyStyle(text, styles.color.cyanBright),
    whiteBright: (text) => applyStyle(text, styles.color.whiteBright),

    // hex
    hex:
        (hex) =>
            (text) =>
                `\x1B[382${hex
                    .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => `${m ? m : '#'}` + r + r + g + g + b + b)
                    .substring(1)
                    .match(/.{2}/g)
                    .map((x) => parseInt(x, 16))
                    .join('')}m${text}\x1B[39m`
}

export default Color