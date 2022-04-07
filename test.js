const edge = require('selenium-webdriver/edge');
const command = require('selenium-webdriver/lib/command');

(async () => {
    const service = new edge.ServiceBuilder()
    .addArguments("--verbose", "--enable-chrome-logs")
    .setStdio('inherit')
    .build();

    const options = new edge.Options();
    options.addArguments("--enable-logging");

    const driver = edge.Driver.createSession(options, service);
    try {
        driver.getExecutor().defineCommand("addVirtualAuthenticator", "POST", "/session/:sessionId/webauthn/authenticator");

        const authOptions = {
            protocol: "ctap1/u2f",
            transport: "usb",
            hasResidentKey: false,
            hasUserVerification: false,
            isUserConsenting: true,
            isUserVerified: false
        };

        await driver.navigate().to("http://localhost:8080/test.html");

        const addAuthenticatorResult = await driver.execute(new command.Command("addVirtualAuthenticator").setParameters(authOptions));

        const response = await driver.executeAsyncScript("registerCredential().then(arguments[arguments.length - 1]);");
        console.log(response);
    } finally {
        await driver.quit();
        await service.kill();
    }
})();