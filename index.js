const { Client, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

// Prepare connection to OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI,
});
const openai = new OpenAIApi(configuration);

// Check for when a message on discord is sent
client.on('messageCreate', async function(message) {
  try {
    // Dont respond to yourself or other bots
    if (message.author.bot) return;
    // only send message in given channel
    if (message.channel.id !== process.env.CHANNEL_ID) return;

    const gptResponse = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: I'd like to cancel my subscription.\nAI:\n\
${message.author.username}: ${message.content}\n\`,
ChatGPT: `,
      temperature: 0.9,
      max_tokens: 100,
      stop: [],
    })

    message.reply(`${gptResponse.data.choices[0].text}`);
    return;

  } catch (err) {
    console.log(err)
  }
});

//Log the bot into Discord 
client.login(process.env.TOKEN);

//this makes sure the bot is online 24/7 if you are using repl to host your Discord Bot, you can remove this code if you want
client.on("ready", () => {
  console.log(`logged as ${client.user.username}!`);
})

const http = require("http");
http.createServer((_, res) => res.end("Uo#1428")).listen(8080)

setInterval(() => {
  if (!client || !client.user) {
    console.log("Client Not Login, Process Kill")
    process.kill(1);
  }
}, 5000);
