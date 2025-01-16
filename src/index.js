const { startClient } = require("./client/client");
const { deployCommands } = require("./client/deploy-commands");

deployCommands();
startClient();