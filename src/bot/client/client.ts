import { Client } from "discord.js";
import { config } from "../../config.js";
import { deployCommands } from "./deploy-commands.js";
import { cooldownForInteraction } from "../interactions/cooldown.interaction.js";
import { createMessage, answerBotMention } from "../events/messageCreate.event.js"
import { logger } from "../../winston/winston.js";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

client.once("ready", async () => {
  await deployCommands();
  console.log("Discord bot is ready! 🤖");
  logger.info("Discord bot is ready! 🤖");
});

client.on("interactionCreate", async (interaction) => {
  await cooldownForInteraction(interaction);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  await createMessage(message);
  await answerBotMention(message);
})

export function startClient() {
  client.login(config.DISCORD_TOKEN_DEV);
}