const puppeteer = require('puppeteer');
const fs = require('fs');
const check = require('./check');


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function loadCodes() {
    try {
        let contents = fs.readFileSync('./codes.txt', { encoding: 'utf-8' })
        return contents.trim().split('\n');
    } catch {
        await fs.promises.writeFile('./codes.txt', '')
        console.log(`[Checker] codes.txt doesn\'t exist, and has been created.`)
        process.exit(1)
    }
}

async function openBrowser() {
    const browser = await puppeteer.launch({ headless: false });
    return browser;
}

async function checkCode(code, browser) {
    const page = await browser.newPage();

    await page.setViewport({ width: 0, height: 0 });
    await page.goto("https://social.beefeater.co.uk/"); {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const element = await frame.waitForSelector("aria/Enter code");
        await element.click();
    } {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const element = await frame.waitForSelector("aria/Enter code");
        await element.type(code);
    } {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const element = await frame.waitForSelector("aria/CONTINUE");
        await element.click();
    } {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const element = await frame.waitForSelector("aria/Email Address");
        await element.click();
    } {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const element = await frame.waitForSelector("aria/Email Address");
        await element.type("johnappleseed+" + code + "@gmail.com");
    } {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const element = await frame.waitForSelector("aria/First Name");
        await element.type("John");
    } {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const element = await frame.waitForSelector("aria/Last Name");
        await element.type("Appleseed");
    } {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const element = await frame.waitForSelector("aria/I agree to the terms & conditions");
        await element.click();
    } {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const element = await frame.waitForSelector("aria/I agree to the terms & conditions");
        await element.type("on");
    }
    await sleep(500) {
        const targetPage = page;
        const frame = targetPage.mainFrame();
        const element = await frame.waitForSelector("aria/LET’S PLAY!");
        await element.click();
    }
    await sleep(250)
    try {
        {
            const targetPage = page;
            const frame = targetPage.mainFrame();
            const element = await frame.waitForSelector("aria/SPIN THE WHEEL");
            await element.click();
        }
    } catch {
        console.log(`[Checker] Failed to check '${code}'.`)
    }

    await page.close()
}

async function run() {
    let codes = await loadCodes()
    console.log(`[Checker] Loaded ${codes.length} codes!`)

    let browser = await openBrowser()
    console.log(`[Checker] Opened browser.`)

    for (i = 0; i < codes.length; i++) {
        let code = codes[i]
        console.log(`[Checker] Checking '${code}'.`)

        if (await check.checkCode(code)) {
            console.log(`[Checker] Code '${code}' is valid! Entering code..`)
            await checkCode(code, browser)
        } else {
            console.log(`[Checker] Code '${code}' is invalid! Skipping code..`)
        }

        await sleep(2000)
    }
}
run();