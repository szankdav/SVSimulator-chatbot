import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN_DEV, DISCORD_CLIENT_ID_DEV, GUILD_ID_DEV } = process.env;

if (!DISCORD_TOKEN_DEV || !DISCORD_CLIENT_ID_DEV || !GUILD_ID_DEV) {
    throw new Error("Missing environment variables");
}

export const config = {
    DISCORD_TOKEN_DEV,
    DISCORD_CLIENT_ID_DEV,
    GUILD_ID_DEV,
};