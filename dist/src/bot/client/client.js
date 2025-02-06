import { Client } from "discord.js";
import { config } from "../../../config";
import { deployCommands } from "./deploy-commands";
import { cooldownForInteraction } from "../interactions/cooldown.interaction";
import { createMessage, answerBotMention } from "../events/messageCreate.event";
const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});
client.once("ready", async () => {
    await deployCommands();
    console.log("Discord bot is ready! 🤖");
});
client.on("interactionCreate", async (interaction) => {
    await cooldownForInteraction(interaction);
});
client.on("messageCreate", async (message) => {
    if (message.author.bot)
        return;
    await createMessage(message);
    await answerBotMention(message);
});
export function startClient() {
    client.login(config.DISCORD_TOKEN);
}
