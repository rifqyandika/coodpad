const puppeteer = require('puppeteer');

const PODCAST_URL = "https://cookpad.com/id/cari/kue?page=1";
async function scrapeEpisodeLinks() {
    let browser = await puppeteer.launch({ headless: false }); //headless:false so we can watch the browser as it works 
    let page = await browser.newPage(); //open a new page
    await page.goto(PODCAST_URL, { waitUntil: 'networkidle0',}); //access the podcasts page

    let episodes_details = await page.evaluate(() => {
        //Extract each episode's basic details
        let table = document.querySelector('ul[data-controller="search-tracking"]');
        let episode_panels = Array.from(table.children);
        console.log(table)

        // Loop through each episode and get their details 
        let episodes_info = episode_panels.map(episode_panel => {
            let title = episode_panel.querySelector("a").textContent;
            // let datetime = episode_panel.querySelector(".datetime").textContent;
            // let episode_download_page = episode_panel
            //     .querySelector(".download")
            //     .getAttribute("href");
            return { title };
        });
        return episodes_info;
    });

    console.log(episodes_details)
    // Close the browser when everything is done 
    await browser.close()
}
scrapeEpisodeLinks()