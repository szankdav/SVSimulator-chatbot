---
layout: post
title:  "Hogyan naplózzunk üzeneteket discordon bot segítségével?"
date:   2025-02-26 12:52:20 +0100
categories: blog post
---
# Hogyan naplózzunk üzeneteket discordon bot segítségével?

Szerintem nem túlzok, ha azt mondom, hogy a Discord ma az egyik legszélesebb körben használt csevegőalkalmazás. Hiszen sokkal több ennél, és mára már nehéz olyan igényt említeni, amire nincsen megoldása. Legyen szó munkahelyi vagy iskolai közös munkáról, személyes kapcsolattartásról, videóhívásokról vagy fájlküldésről, a teljesség igénye nélkül. A közösségek szervereken csoportosulnak, ahol különböző csatornák szolgáltatják a végtelen számú lehetőséget. Ezeken a szervereken találkozhatunk a botokkal.
    
A Discord botok olyan automatizált programok, amelyek a Discord API segítségével működnek, és különböző feladatokat látnak el egy szerveren. Ezek lehetnek egyszerű, egyfunkciós botok vagy összetett rendszerek, amelyek többféle interakciót és szolgáltatást biztosítanak a felhasználók számára. Feladatokat hajtanak végre emberi beavatkozás nélkül, például üdvözlő üzeneteket küldenek vagy moderálnak. Illetve automatizálhatunk velük szinte bármit, ha meg tudjuk valósítani. (módosítva)
    
    
## Miről olvashatsz ebben a blogban
A projekthez tartozik egy prezentáció, amit a blog olvasása előtt ajánlott megnézni: https://github.com/szankdav/SliDev-presentations 

Ebben a prezentációban bemutattam, hogy milyen technológiák segítségével készült el a Discord bot és a naplózó program. Ebben a bejegyzésben azt szeretném bemutatni, hogy a kódon keresztül hogyan érjük el azt, hogy egy szerveren található bot naplózza az üzeneteket. Létrehozunk egy botalkalmazást, inicializáljuk, és egy Node.js alkalmazás segítségével elmentjük az általa „elkapott” üzeneteket.
  
Amikor megkaptam ezt a feladatot, úgy éreztem, hogy nehéz lesz. Hiszen csak kimondani ezeket a dolgokat, hogy programozz egy botot, ami képes erre, képes arra, kezdő fejlesztőként nagy és nehéz feladatnak tűnik. De végül kiderült, hogy nem nehezebb, mint más új projektek. Csak dokumentációkat kell olvasni, tanulni, és felhasználni a tanultakat.
    
## Lássuk
    
1.  A bot létrehozása:
    
Első, vagy inkább nulladik lépésként létre kell hoznunk a Discord Developer portálon a bot alkalmazásunkat. Egy gyors regisztráció után a sarokban található "New Application" gombra kattintva létrehozzuk az alkalmazásunkat.

![enter image description here](https://i.ibb.co/cSjtp3fj/01.jpg)

![enter image description here](https://i.ibb.co/hFvL4nV6/02.jpg)

Az oldalsó navigációs sávban található **Bot** menüpont alatt megadunk egy nevet, majd generálunk egy tokent. FONTOS! Ezt a tokent csak most fogjuk látni, így mentsük le későbbi felhasználásra.
    
![enter image description here](https://i.ibb.co/bRbnKRbX/03.jpg)
    
Az **OAuth2** menüpontra kattintva kipipáljuk a **"bot"** és **"applications.commands"** lehetőségeket, majd a lejjebb lenyíló **"Bot Permissions"** ablakban kijelöljük azokat a jogosultságokat, amelyekkel szeretnénk, hogy a botunk rendelkezzen. Én itt csak alapvető jogokat adtam neki, a **"Text Permissions"** oszlopból a **"Send Messages"**, **"Manage Messages"** és **"Use Slash Command"** lehetőségeket.

![enter image description here](https://i.ibb.co/9HVG01kV/04.jpg)

Ezek után a lap alján kapunk egy linket, amelyet felkeresve megnyílik a Discord, és kiválaszthatjuk, hogy a létrehozott botot melyik szerverünkhöz szeretnénk hozzáadni.

![enter image description here](https://i.ibb.co/yn8DRw7c/05.jpg)

Gratulálok! Létrehoztál egy botot!
    
Persze még semmit nem tud, és ahogy láthatod a szervereden, nem aktív. 
Hogyan keltsük életre? Szerencsére nem kell hozzá egy vihar, és különböző forrásból származó emberi testrészek, és őrültnek sem kell lennünk. Sőt, ha életre kel, nem fog elkezdeni gyilkolászni. (Max a szerveren.) Ennél jóval egyszerűbb dolgunk lesz. Ha az eddigiekkel megvagyunk, akkor nyissuk meg a letöltött repo mappáját, és kövessétek velem végig, hogyan érjük el a célunkat!
    
Láthatjátok, hogy a fejlesztés során TypeScript-et használtam. A TypeScript azért jó, mert jó:
„A TypeScript a JavaScript „szuperkészlete”, amely elsősorban opcionális statikus gépelést, osztályokat és interface-eket biztosít. Az egyik nagy előnye az, hogy lehetővé teszi az IDE-k számára, hogy gazdagabb környezetet biztosítsanak a gyakori hibák észleléséhez a kód beírása közben.” 
Erősen típusos nyelv lévén nehezebb benne bődületesen nagy hülyeségeket csinálni, amit utána órákon keresztül debug-olunk. Persze nem lehetetlen. Én elsősorban emiatt szeretem a JavaScript „helyett” használni.
    
A program gyökerének létrehoztam egy **src** mappát, amin belül elkülönítettem a **bot** és a naplózó program (**logger**) mappáját: (módosítva)
    
![enter image description here](https://i.ibb.co/DPfJHXW8/06.jpg)
    
A **bot** mappám szerkezete:

![enter image description here](https://i.ibb.co/5gfTsJt6/07.jpg)
- A **client** mappában található fájlok felelősek a bot inicializálásáért, és a parancsok feltöltéséért.
- A **commands** mappa tartalmazza a bot számára kiadható slash (/) parancsokat.
- Az **events** mappában található fájlban kerültek definiálásra azok a függvények, amik a bot közvetlen megszólítása nélkül fognak lefutni.
- Az **interactions** mappában található a parancsok kiadása közötti várakoztatási idő logikája.
    
Lássuk akkor végre, hogyan is jön létre a botunk:  
**Importáljuk a szükséges könyvtárakat** 

    import { Client } from "discord.js"; import { config } from "../../config.js";
    import { deployCommands } from "./deploy-commands.js";
    import { cooldownForInteraction } from "../interactions/cooldown.interaction.js";
    import { createMessage, answerBotMention } from "../events/messageCreate.event.js" import { logger } from "../../winston/winston.js"; 

**Létrehozunk egy új klienst, ami a Discord Developer Portal-on található alkalmazásunk egy példánya lesz**  

    const client = new Client({
    	intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
    });

**Jelezzük, és logoljuk, ha sikeres a csatlakozás**

    client.once("ready", async () => {
    	await deployCommands();
    	console.log("Discord bot is ready! 🤖");
    	logger.info("Discord bot is ready! 🤖");
    });

  **Feliratkozunk a kívánt eseményekre**

    client.on("interactionCreate", async (interaction) => { 
    	await cooldownForInteraction(interaction); 
    }); 
    
    client.on("messageCreate", async (message) => {
    	if (message.author.bot) return;
    	await createMessage(message);
    	await answerBotMention(message);
    })

  **Elindítjuk a botunkat**

    export function startClient() {
    	client.login(config.DISCORD_TOKEN_DEV);
    }

Ahogy már a prezentációban is láthattátok, a bot inicializálása ebből a pár egyszerű lépésből áll. Az abban látható kódhoz képest is minimális eltérést láthattok:
- Más jogok kerültek beállításra az intents tömbben.
- A once funkció során a bot slash parancsait frissítjük.
- Az interctionCreate események kiváltásakor védekezünk a tömeges parancs kiadások ellen.
- A login funkció bejelentkezteti a botunkat a szerverre, a korábban felírt token segítségével, amit a programban egy config.ts fálj segítségével olvasok ki a .env fájlból:

import dotenv from "dotenv";

import { logger } from "./winston/winston.js";

dotenv.config();

    import  dotenv  from  "dotenv";
    import { logger } from  "./winston/winston.js";

    dotenv.config();
    
    const { DISCORD_TOKEN, DISCORD_CLIENT_ID, GUILD_ID } =  process.env;
    
    if (!DISCORD_TOKEN  ||  !DISCORD_CLIENT_ID  ||  !GUILD_ID) {
	    logger.error("Missing environment variables");
	    throw  new  Error("Missing environment variables");
	}
	export  const  config  = {
		DISCORD_TOKEN,
		DISCORD_CLIENT_ID,
		GUILD_ID,
	};

- DISCORD_TOKEN: A bot alkalmazás tokenje.
- DISCORD_CLIENT_ID: A bot alkalmazás General Information menüpontjában található Application ID.
- GUILD_ID: A Discord szerver azonosítója

    
Ha mindent jól csináltunk, akkor a program futtatása során a botunk aktívként lesz jelen a szerverünkön!

2.  Az üzenetek továbbítása
    
A **messageCreate** esemény létrejöttekor történik meg az, aminek történnie kell! 

Itt fogjuk meghívni azt a funkciót, ami a naplózó programunknak továbbítja a szükséges információt az üzenet naplózásához. 

A program létrehozásakor több lehetőségem volt erre. Akár maga a bot is létrehozhatna egy adatbázist, és beleírhatná a szükséges információkat. Én azonban úgy gondoltam, hogy ha a jövőben más, adatbázis használatát megkövetelő funkcióval szeretném bővíteni a botot, aminek gyökeresen más felépítésűnek kell lennie, vagy több olyan funkcióval szeretném bővíteni, amik viselkedésükben nagyon különbözőek, akkor egy idő után átláthatatlan, és nehezen karbantartható programom lesz. Emiatt a bot-ot csak mint adattovábbító csatornát képzeltem el, és a programot, ami naplózza az üzenetet, külön kezeltem. 

Ezért hoztam létre egy **logger** nevű mappát, amiben ez a program található. A **createMessage** funkció ennek a programnak fog küldeni kérést, a body-ban továbbítva a szükséges információkat:
    
    export async function createMessage(message: OmitPartialGroupDMChannel<Message<boolean>>) { 
        try { 
        	if (message.author.bot) return; 
        	if (message.content.startsWith('<@')) return; 
        	let messageWithoutMemberId :string = message.content;
        	
        	const mentionedUsers: Collection<string, User> = message.mentions.users; 
        	
        	for (const user of mentionedUsers) { 
        		messageWithoutMemberId = messageWithoutMemberId.replace(`<@${user[0]}>, user[1].username`); 
        	}

**A szükséges paraméterek kiszűrése a Discord Message típusból**

    const messageData = { 
	    username: message.author.globalName, 
	    messageCreatedAt: message.createdTimestamp, 
	    content: messageWithoutMemberId, 
	}

**Kérés küldése a naplózó program felé, a body-ban az szükséges információval**  

    const result = await fetch("http://localhost:3000/logMessage", { 
	    method: "POST", 
	    headers: { 
		    'Content-Type': 'application/json', 
		}, 
		body: JSON.stringify({ message: messageData }), }) 
		if (result.status === 200) { 
			logger.info('Message logged by user: ${message.author.globalName}') 
		} 
	} catch (error) { 
		logger.error("Error creating message:", error); 
		} 
	}
    
A funkció elején található ellenőrzések a bot végtelen üzenetküldés ciklusba kerülésének megakadályozása miatt szükségesek. Ha az üzenetet a bot hozza létre, vagy csak a bot lett megemlítve, akkor lépjünk ki a funkcióból.

3.  Az üzenetek fogadása
    
A naplózó alkalmazás, ahogy már tudjátok, a **logger** nevű mappában található: 
    
![enter image description here](https://i.ibb.co/xShfhmrz/08.jpg)

Az itt látható mappaszerkezet az MVC mintát hivatott követni.
    
- A **controller** mappa tartalmazza a controllereket.
- A **model** mappa a modelleket.
- A **view** mappa a megjelenítéshez szükséges fájlokat.
- A **types** mappa a fejlesztés során szükségessé vált típusok definícióit.
- A **utils** mappa tartalmazza az egyedi hibakezeléshez használt osztályokat:

Tekintettel a program méretére, átláthatóbbnak gondoltam azt a megközelítést, hogy külön hiba osztályokat felhasználva dobok hibát, ezzel könnyen beazonosítva, hogy a hiba okozásáért melyik programrész felelős.

- A **database** tartalmazza az adatbázishoz tartozó minden szükséges mappát és fájlt.
- A **handlers** a beérkező requestek kezeléséért felelős funckiókat tartalmazó fájlok helye.
    
Az üzeneteket **SQLite3** adatbázisban tárolom, melynek létrehozása a database.ts fájlban látható: 
**Szükséges könyvtárak importálása** 

    import sqlite3, { Database } from "sqlite3"; 
    import { SqlParams } from "../types/sqlparams.type.js"; 
    import path from "path"; 
    import fs from "fs"; 
    import { fileURLToPath } from "url"; import { logger } from "../../winston/winston.js";

**Adatbázis fájl útvonalának meghatározása** 

    const __filename = fileURLToPath(import.meta.url); 
    const __dirname = path.dirname(__filename); 
    
    let dbFolder: string; 
    logger.info("Checking if /database exists:", fs.existsSync("/database")); 
    if (fs.existsSync("/database")) { 
	    dbFolder = "/database"; 
	} else { 
		dbFolder = __dirname 
	} 
	
	const dbFilePath = path.join(dbFolder, 'DiscordMessages.db');

**Sikeres adatbázis fájl létrehozásának logolása**

    logger.info(`Using SQLite database at: ${dbFilePath}`);

**Az adatbázis inicializálása**

    export const db = new sqlite3.Database(dbFilePath, (err) => { 
	    if (err) { 
		    logger.error("Failed to connect to database:", err); 
		} else { 
		    logger.info("Connected to SQLite database successfully."); 
	    } 
	});
 
    
 Az adatbázis három táblát tartalmaz:    
import { Database } from "sqlite3"; import { execute } from "./database.js"; import { logger } from "../../winston/winston.js";
**Authors tábla**

    export const createAuthorsTable = async (db: Database): Promise<void> => { 
	    try { 
		    await execute( 
		    db, 
		    'CREATE TABLE IF NOT EXISTS Authors ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, createdAt TEXT NOT NULL)' ); 
		} catch (error) {
			logger.error("Error creating Authors table:", error); 
			};
		};
	};

**Message tábla**

    export const createMessagesTable = async (db: Database): Promise<void> => { 
	    try { 
		    await execute( 
			    db, 
			    'CREATE TABLE IF NOT EXISTS Messages ( id INTEGER PRIMARY KEY AUTOINCREMENT, authorId INTEGER NOT NULL, message TEXT NOT NULL, createdAt TEXT NOT NULL, FOREIGN KEY (authorId) REFERENCES Authors(id) ON DELETE CASCADE)' ); 
		} catch (error) { 
			logger.error("Error creating Messages table:", error); 
			}
		};
	};

**Letters tábla** 

    export const createLettersTable = async (db: Database): Promise<void> => { 
	    try { 
		    await execute( 
			    db, 
				'CREATE TABLE IF NOT EXISTS Letters ( id INTEGER PRIMARY KEY AUTOINCREMENT, authorId INTEGER NOT NULL, letter TEXT NOT NULL, count INT DEFAULT 0, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL, FOREIGN KEY (authorId) REFERENCES Authors(id) ON DELETE CASCADE)' ); 
		} catch (error) { 
			logger.error("Error creating Letters table:", error); 
		} 
	};
    
**A táblák létrehozása az adatbázisban** 

    export const createTables = async (db: Database): Promise<void> => { 
	    try { 
		    await execute(
			    db, 
			    "PRAGMA foreign_keys = ON;");
			await createAuthorsTable(db); 
			await createMessagesTable(db); 
			await createLettersTable(db); 
		} catch (error) { 
			logger.error("Error creating tables:", error); 
		} 
	};
    
Ezek a táblák tárolják a megjelenítés során felhasznált adatokat.
    
A **src** mappában még látható, de eddig nem említett mappák:
- A **scripts** a futtatáshoz szükséges segéd scripteket tartalmaz.
- A **winston** mappa pedig a **winston logger** otthona, ami egy szuper logoló könyvtár, aminek segítségével az eldobott hibákat a logs mappában tárolhatjuk.

Észrevehettétek, hogy a megszokott **console.error** helyett **logger.error** használatával kerülnek kiírásra a hibaüzenetek, ezt a winston logger könyvtár segítségével teszem: https://github.com/winstonjs/winston

A bot által küldött üzeneteket a **/logMessage** endpointon a **messageLoggerHandler** nevű handler fogja kezelni. 
Ettől a lépéstől már nagyon jól nyomon követhető, hogy az **MVC** minta hogyan vezeti végig az adatot a programunkban. A bejövő kérés body-jában szerepel minden információ ami a naplózáshoz szükséges. Mikor beérkezik az üzenet, a megfelelő controller megkapja az adatot, majd ha minden rendben ment, válaszolunk egy 200-as státusszal:
    
    export const messageLoggerHandler = async (req: Request, res: Response, next: NextFunction) => { 
	    try { 
		    const message = req.body.message; 
		    await messageLoggerController(db, message); 
		    res.sendStatus(200); 
		} catch (error) {
			logger.error("MessageLogger handler error:", error); next(error); 
		}
	};
    
A controller felelős a bejövő adat feldolgozásáért, és a megfelelő adat megfelelő modellhez történő továbbításáért:
    
export const messageLoggerController = async (db: Database, message: {username: string, messageCreatedAt: number, content: string}): Promise<void> => { try {
**Kiszűrjük a feladathoz szükséges paramétereket**

    const messageCreatedAt = new Date(message.messageCreatedAt); 
    const authorToCreate: SqlParams = [message.username, messageCreatedAt.toLocaleString()]; 
    const existingAuthor = await getAuthorByName(db, [message.username]);

**Ha már szerepel az üzenetet létrehozó felhasználó az adatbázisban, nem hozzuk létre újra**

    if (!existingAuthor) { 
	    await createAuthor(db, authorToCreate); 
	    logger.info('Author added to the database!', { username: message.username }); 
	}

**Ha még nem szerepelt, akkor szükségünk van az újonnan létrejött Author id-jára** `const newAuthorId = await getAuthorByName(db, [message.username]);`
**Létrehozunk egy MessageModel-t, amit tárolni fogunk az adatbázisban**

    const messageToCreate: MessageModel = { 
	    id: 0, authorId: newAuthorId!.id, 
	    content: message.content, 
	    messageCreatedAt: messageCreatedAt.toLocaleString(), 
	}; 
		await createMessage(
			db,[messageToCreate.authorId, messageToCreate.content, messageToCreate.messageCreatedAt]); 
		
		await createLetterCountersInDatabase(db, messageToCreate); 
	} catch (error) { 
		logger.error("Error logging message:", error); 
		throw new DatabaseError("Error logging message", 500); 
		}
	};
    
**A szükséges ellenőrző lépések végrehajtása során eldöntésre kerül, hogy melyik model melyik funkciója kerüljön meghívásra. A createAuthor fogja létrehozni az adatbázisban az új Author-t**
    
    export const createAuthor = async (db: Database, params: SqlParams): Promise<void> => { 
	    const sql: string =` INSERT INTO Authors(name, createdAt) VALUES (?, ?)`; 
	    try { 
		    await execute(db, sql, params); 
		} catch (error) { 
			logger.error("Error creating author:", error); 
			throw new Error("Error creating author"); 
		} 
	};
    
**A createMessage fogja beilleszteni az üzenetet**

    export const createMessage = async (db: Database, params: SqlParams): Promise<void> => { 
	    const sql: string =` INSERT INTO Messages(authorId, message, createdAt) VALUES (?, ?, ?)`; 
	    try { 
		    await execute(db, sql, params); 
		} catch (error) { 
			logger.error("Error creating message:", error); 
			throw new Error("Error creating message"); 
		} 
	};
\
**Végül a createLetterCountersInDatabase fogja frissíteni a betűket az adatbázisunkban**

    export const createLetterCountersInDatabase = async (db: Database, messageParams: MessageModel): Promise<void> => { 
	    try { 
		    const existingAuthorId = await checkAuthorIdExistense(db, [messageParams.authorId]); 
		    if (!existingAuthorId) await createLetterCounters(db, [messageParams.authorId, "", 0, messageParams.messageCreatedAt, new Date().toLocaleString()]); 
		    await letterIterator(db, messageParams); 
		} catch (error) { 
			logger.error("Error creating letters:", error); 
			throw new LetterCounterError("Error creating letters", 500); 
		} 
	};
    
Egy bejövő üzenet ezeken a lépéseken keresztül fog bekerülni az adatbázisba, és fogja kiváltani a megfelelő kódsorok futását, felhasználva az **MVC** minta útmutatásait. A szerveren elküldött üzeneteink ennél a pontnál már láthatóak az adatbázisunkban!
    
4.  A megjelenítés

A minta **View** részét a **view** mappánkban található fájlok segítségével valósítjuk meg. Ezek a fájlok kerülnek renderelésre a **view** számára, hogy a kliens egy böngészőben megjeleníthető html fájlt kapjon az adott URL felkeresésekor. A **handler** mappában található fájlok a **messageLogger.handler.ts** kivételével mind a naplózó program megjelenítésekor történő navigációk miatt keletkező kérésekre fogják válaszként a megfelelő view fájlt visszaküldeni, előre renderelve.
    
    export const authorsHandler = async (req: Request, res: Response, next: NextFunction) => { 
	    try { 
		    const page = parseInt(req.params['page']); 
		    const renderObject = await authorsController(db, page);
		    res.render(renderObject.viewName, renderObject.options); 
		} catch (error) { 
			logger.error("Author handler error:", error); next(error); 
		} 
	};

Hogy megkönnyítsem a rendereléshez szükséges paraméterek átadását, létrehoztam egy **renderObject** nevű típust, így a controllerekben tudjuk szabályozni, hogy melyik view fájlunk milyen adatokkal (paraméterekkel) készüljön el. A rendereléshez **EJS sablonnyelvet** használtam, és állítottam be: 

    app.set("view engine", "ejs"); 
    app.set("views", path.join(__dirname, 'logger/view'));
    
Ezt a **.ejs** kiterjesztésű fájlt fogja a renderelés során a program egy html fájlá alakítva elküldeni a kliensnek, ahol a böngésző már meg tudja jeleníteni! Ekkor a programot futtatva, és a böngészőben a beállított portot meglátogatva látni fogjuk az adatbázisban található adatokat táblázatos formában! 

![enter image description here](https://i.ibb.co/jvC197C4/author.jpg)

Ez eddig mint szép és jó, van egy programunk, ami azt teszi, amit szeretnénk. Azonban ezt ahhoz, hogy mások bármikor tudják használni, ne csak amikor éppen fut a gépemen, üzemeltetni is kellene valahol.

Több lehetőség is szóba került, de végül a **Fly.io**-ra esett a választás. 

A **Fly.io** nagyon jól konfigurálható, együttműködik a **Docker**-el, és a **GitActions**-el, így be tudunk állítani egy workflow-t a reponkhoz, aminek segítségével megkönnyíthető a projekt szállítása a Fly.io-ra. Tesztek írásával azt is megakadályozhatjuk, hogy „lecseréljük” az aktív, jól működő programunkat egy hibásra. Én ehhez **PlayWright** teszteket írtam, amiket egy fake adatokat generáló funkció segítségével állítok elő, a tesztelés időtartamára.
    
**A generálás:**  
**Szükséges könyvtárak importálása**

    import { fakerHU } from '@faker-js/faker'; 
    import { Database } from 'sqlite3'; 
    import { execute, fetchAll } from "../database.js"; 
    import { db } from "../database.js"; 
    import { logger } from '../../../winston/winston.js';

**Ál authorok létrehozása**

    const createFakeAuthors = (): string[] => { 
	    const fakeAuthors: string[] = []; 
	    for (let i = 0; i < 100; i++) { 
	    const name = fakerHU.person.fullName(); 
	    const createdAt = fakerHU.date.past().toISOString();
	    fakeAuthors.push(`('${name}', '${createdAt}')`); 
	    } 
	    return fakeAuthors; 
    };
    
**Majd ezek hozzáadása az adatbázishoz**

    const insertAuthors = async (db: Database, fakeAuthors: string[]): Promise<void> => { 
	    await execute(
		    db,
		    `INSERT INTO Authors (name, createdAt) VALUES ${fakeAuthors.join(", ")}`); 
	};

**Szükségünk van ezeknek az újonnan létrehozott authoroknak az adataira**

    const fetchAuthors = async (db: Database): Promise<{id: number; createdAt: string }[]> => { 
	    return await fetchAll(db,` SELECT id, createdAt FROM Authors`); 
	};

**Ezeket az adatokat felhasználva minden Authorhoz hozzákapcsoljuk a betűket az adatbázisban**

    const insertLetters = async (db: Database, authors: { id: number; createdAt: string }[]): Promise<void> => { 
		const alphabet: string[] = ["a", "á", "b", "c", "d", "e", "é", "f", "g", "h", "i", "í", "j", "k", "l", "m", "n", "o", "ó", "ö", "ő", "p", "q", "r", "s", "t", "u", "ú", "ü", "ű", "v", "w", "x", "y", "z"];  
	    const lettersData: string[] = []; 
	    authors.forEach(({ id, createdAt }) => { 
		    alphabet.forEach((letter) => { 
			    lettersData.push(`(${id}, '${letter}', '${createdAt}', '${createdAt}', 0)`); 
			 }); 
		}); 
		if (lettersData.length) { 
		   await execute(db, `INSERT INTO Letters (authorId, letter, createdAt, updatedAt, count) VALUES ${lettersData.join(", ")}`);
		} 
	};
    
**Létrehozunk véletlenszerű üzeneteket, amiket a megfelelő Author-hoz társítunk az adatbázisban, és frissítjük a hozzájuk tartozó betűk darabszámait**

    const  insertMessages  =  async (db:  Database, authors: { id:  number; createdAt:  string }[], letterCountMap:  Map<string, number>):  Promise<void> => {
		const  fakeMessages:  string[] = [];
    
	    for (const  author  of  authors) {
		    const  randomMessageNumber  =  Math.floor(Math.random() * (20  -  1  +  1) +  1);
        
		    for (let  i  =  0; i  <  randomMessageNumber; i++) {
		        const  content  =  fakerHU.string.fromCharacters('aábcdeéfghiíjklmnoóöőpqrstuúüűvwxyz', { min:  4, max:  100 });
			    const  messageCreatedAt  =  fakerHU.date.past().toISOString();
			    fakeMessages.push(`(${author.id}, '${content}', '${messageCreatedAt}')`);
			    
			    for (const  letter  of  content) {
				    const  key  =  `${author.id}-${letter}`;
				    letterCountMap.set(key, (letterCountMap.get(key) ||  0) +  1);
			    }
			}
	   }
	   
	   if (fakeMessages.length) {
		   await  execute(db, `INSERT INTO Messages (authorId, message, createdAt) VALUES ${fakeMessages.join(", ")}`);
	   }
    };
    
    const  updateLetterCounters  =  async (db:  Database, letterCountMap:  Map<string, number>):  Promise<void> => {
	    const  updateLetterCounters:  string[] = [];
	    letterCountMap.forEach((count, key) => {
		    const [authorId, letter] =  key.split("-");
		    updateLetterCounters.push(`UPDATE Letters SET count = count + ${count} WHERE authorId = ${authorId} AND letter = '${letter}';`);
        });
    
	    if (updateLetterCounters.length) {
		    await  execute(db, updateLetterCounters.join(" "));
	    }
    };  
    
**Végül a fent defíniált funkciókat felhasználva feltöltjük az adatbázist**

    const fillDatabaseWithFakeData = async (db: Database): Promise<void> => { 
	    try { 
		    const fakeAuthors = createFakeAuthors(); 
			   await insertAuthors(db, fakeAuthors); 
			   const authors = await fetchAuthors(db); 
			   await insertLetters(db, authors); 
			   const letterCountMap = new Map<string, number>(); 
			   await insertMessages(db, authors, letterCountMap); 
			   await updateLetterCounters(db, letterCountMap); 
		} catch (error) { 
			   logger.error(error); } 
	};
			   
    export const runFaker = async () => { 
	    logger.info("Database filled with fake data."); 
	    await fillDatabaseWithFakeData(db); 
	};

**Ennek használatához külön scripteket hoztam létre a package.json fájlban**  

    "prodGenerateFakeDatabaseData": "node dist/scripts/production/generateFakeDatabaseData.js",
    "prodEmptyDatabase": "node dist/scripts/production/emptyDatabase.js",
    "playwright-prod": "npm run prodGenerateFakeDatabaseData && npx playwright test && npm run prodEmptyDatabase",

Ez garantálja, hogy a teszt előtt legyenek adatok, majd a teszt után törlődjenek ezek az adatok.
    
**A workflow, ami a githubra történő pusholás során fog lefutni, két job-ból áll**

    name: Fly Deploy 
    on: 
	  push: 
		branches: 
		  - production 
	jobs:

**Test job**
**Itt kerül felhasználásra a fent leírt hamis adatokkal történő tesztelés**
**Két különálló job-ot használok, mert így először biztos lehetek benne, hogy minden úgy fog működni, ahogy én szeretném, de kiküszöbölve azt, hogy az adatbázisomban a feltöltés-törlés miatt ne 1-től induljon az ID.**

    test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    with:
    node-version: lts/*
    - name: Install dependencies
    run: npm ci
    - name: Build the app
    run: npm run build
    - name: Start the app in the background
    env:
    DISCORD_TOKEN: ${{ secrets.DISCORD_TOKEN }}
    DISCORD_CLIENT_ID: ${{ secrets.DISCORD_CLIENT_ID }}
    GUILD_ID: ${{ secrets.GUILD_ID }}
    PORT: ${{ secrets.PORT }}
    LOG_LEVEL: ${{ secrets.LOG_LEVEL }}
    run: npm start &
    - name: Wait for the app to be ready
    run: npx wait-on http://localhost:3000
    - name: Install Playwright Browsers
    run: npx playwright install --with-deps
    - name: Run Playwright tests
    run: npm run playwright-prod
    - uses: actions/upload-artifact@v4
    if: ${{ cancelled() === false }}
    with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30

**Deploy a Fly.io-ra** 

    deploy:
    name: Deploy app
    needs: test
    runs-on: ubuntu-latest
    concurrency: deploy-group  # optional: ensure only one action runs at a time
    steps:
    - uses: actions/checkout@v4
    - uses: superfly/flyctl-actions/setup-flyctl@master
    - name: Set Fly.io secrets
    run: |
    flyctl secrets set \
    DISCORD_TOKEN=${{ secrets.DISCORD_TOKEN }} \
    DISCORD_CLIENT_ID=${{ secrets.DISCORD_CLIENT_ID }} \
    GUILD_ID=${{ secrets.GUILD_ID }} \
    PORT=${{ secrets.PORT }} \
    LOG_LEVEL=${{ secrets.LOG_LEVEL }}
    env:
    FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
    - run: flyctl deploy --remote-only
    env:
    FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

Így biztos lehetek abban, hogy a Fly.io-ra csak egy megfelelően működő verzió fog kikerülni. 
A szükséges **secret**-eket a github repo beállításai között tudjuk hozzáadni! 
Ezzel biztosítjuk, hogy publikusan semmilyen érzékeny információ nem kerül ki látható módon.  

**Összegzés** 

A projekt megvalósítása során rengeteget tanultam. Implementálás előtt mindent próbáltam előre átgondolni, és mindenre felkészülni, de sokszor bebizonyosodott, hogy ez szinte lehetetlen. Ez ismerős lehet nektek is. 

Többször belefutottam abba, hogy egy-egy komplett logikai részt kellett teljesen törölnöm, és elölről kezdenem. Bár emiatt úgy érzem, sokat fejlődtem, hiszen talán legtöbbet hibák megoldásával tanulunk, nem ez a jó út, mert értékes időt tudok ezáltal veszíteni, és ahogy nő a programunk, és nőnek a függőségek, a refaktorálás is egy rémálommá tud válni. 

Ennek kiküszöbölésére kellett volna használom a **TDD (Test-driver Development)** folyamatot, ami nagyban megkönnyíti a fejlesztési folyamatot. Őszintén be kell vallanom, hogy ennél a projektemnél ezt nem sikerült követnem. A következő projekt esetén ezt a technikát fogom szem előtt tartani, levonva a mostani folyamat tanulságait, és annak végén titeket is megismertetve vele! 

Ennek ellenére a program logikájának megalkotása, és törekvésem arra, hogy minél automatizáltabban működjenek a lépések, figyelve a hibalehetőségekre, sokat segítettek, hogy ismét lépjek egy fokot a lépcsőn, ami a kor elvárásainak megfelelő fejlesztők emeletére vezet.  

Amint láthatjátok, ha megfelelően kiokosítjuk magunkat, és megkeressük a megfelelő technológiákat, akkor egy ilyen elsőre teljesíthetetlennek tűnő feladatot is meg tudunk oldani.

Ti mit gondoltok, mit csinálnátok másképp?
---