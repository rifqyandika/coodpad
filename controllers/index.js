const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const randomUseragent = require('random-useragent')

exports.getFoods = async function (req, res, next) {
    let foodName = req.query.name;
    var pages = req.query.page ? req.query.page : 1;

    if (!foodName) {
        return res.status(400).json({ status: 400, message: 'Food Name Empty' });
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setUserAgent(randomUseragent.getRandom());
    try {
        await page.goto(
            `https://cookpad.com/id/cari/${foodName}?page=${pages}`, { waitUntil: 'networkidle0', }
        );
        await page.waitForSelector("ul");
        const content = await page.content();
        const $ = cheerio.load(content);
        const recipes = [];
        $('li.block-link', 'ul').slice(0, 10).each((idx, elem) => {
            const title = $(elem).find('h2 > a').text().replace(/\n/g, ' ')
            const imageUrl = $(elem).find('div.flex-none.w-20.xs\\:w-auto.h-auto > picture > img').attr('data-original')
            const recipe = $(elem).attr('id')
            const receipeID = recipe.split("_")[recipe.split("_").length - 1];
            recipes.push({ receipeID, title, imageUrl });
        })
        await browser.close();
        return res.status(200).json({ status: 200, message: `Success get ${foodName} page ${pages}`, data: recipes, });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}