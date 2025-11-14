const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require("discord.js");
const express = require("express");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

const PREFIX = "-TTV";

const app = express();
app.get("/", (req, res) => res.send("Bot activo"));
app.listen(3000, () => console.log("Servidor web encendido"));

client.once("clientReady", () => {
    console.log("Bot listo");
client.user.setActivity("TWITCH TAVYUXX", {

    type: 2
});

});

client.on("guildMemberAdd", (member) => {
    const canal = member.guild.channels.cache.get("1438975648180863198");

    if (!canal) return;

    const embed = new EmbedBuilder()
        .setTitle("👋 Bienvenido a el server de Tavyuxx")
        .setDescription(`Nos alegra tenerte aquí, ${member}!`)
        .setColor("#B100FF")
        .setImage("https://i.imgur.com/t4obNhs.png");

    canal.send({ embeds: [embed] });
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith(PREFIX)) {
        const texto = message.content.slice(PREFIX.length).trim();
        const archivo = message.attachments.first();

        const lineas = texto.split("\n");
        const titulo = lineas[0] || "SIN TÍTULO";
        const descripcion = lineas[1] || null;

        const embed = new EmbedBuilder()
            .setTitle(titulo)
            .setColor("#B100FF");

        if (descripcion) embed.setDescription(descripcion);
        if (archivo) embed.setImage(archivo.url);

        message.channel.send({ embeds: [embed] });
    }
});

client.login(process.env.TOKEN);

