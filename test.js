const { Builder, By } = require('selenium-webdriver');

const edge = require('selenium-webdriver/edge');

(async () => {
    const service = new edge.ServiceBuilder()
    .addArguments("--verbose", "--enable-chrome-logs")
    .setStdio('inherit')
    .build();

    const options = new edge.Options();
    options.addArguments("--enable-logging");

    const driver = edge.Driver.createSession(options, service);
    try {
        await driver.get('https://bing.com');

        const element = await driver.findElement(By.id('sb_form_q'));
        await element.sendKeys('WebDriver');
        await element.submit();

        const title = await driver.getTitle();
        console.log(title);
    } finally {
        await driver.quit();
        await service.kill();
    }
})();