# Discord Bot - Logger
The purpose of this program is to initialize a Discord bot, connect it to the designated server, and log the messages sent on that server.

During execution, the program initializes a pre-created bot on the Discord Developer Portal:
https://discord.com/developers/docs/intro

It also starts a MPA (Multi Page Application) that displays the logs stored in an SQLite3 database via a web browser.

# Running the Program
To start the program in developer mode, run:

    npm run dev

In this case, a local file named DiscordMessages.db will be created to store the logs.

The program includes functional Playwright tests to ensure the UI operates correctly.
To test the UI functions, after starting the program, run:

    npm run playwright-dev
This command populates the database with generated data, which is used for the Playwright tests.
After successful execution, the generated data is deleted from the database.

# Building the Program

To build the project, run:

    npm run build

This command uses tsup to compile the code into a runnable format.
During this process, .ejs files responsible for rendering are also copied into the dist folder.

After building, start the compiled program with:

    npm run start

The program includes functional Playwright tests to ensure the UI operates correctly.
To test the UI functions, after build, start the program and run:

    npm run playwright-prod

This command populates the database with generated data, which is used for the Playwright tests.
After successful execution, the generated data is deleted from the database.

## SliDev
A presentation has been created for the project.
To view it, navigate to the /discord-bot-logger folder and run:

    npm run dev