// ============================
// BOT DE DISCORD LISTO PARA RAILWAY
// ============================

const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require("discord.js");
const express = require("express");

// ============================
// Manejo de errores críticos
// ============================
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

console.log("Index cargado, iniciando bot...");

// ============================
// Servidor web para keep-alive
// ============================
const app = express();
app.get("/", (req, res) => res.send("Bot activo"));
app.listen(process.env.PORT || 3000, () =>
    console.log("Servidor web encendido")
);

// ============================
// Configuración del bot
// ============================
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

// ============================
// Evento READY
// ============================
client.once("ready", () => {
    console.log("Bot listo");
    client.user.setActivity("TWITCH TAVYUXX", { type: 2 });
});

// ============================
// Bienvenida de nuevos miembros
// ============================
client.on("guildMemberAdd", (member) => {
    const canal = member.guild.channels.cache.get("1438975648180863198");
    if (!canal) return console.log("Canal de bienvenida no encontrado");

    const embed = new EmbedBuilder()
        .setTitle("👋 Bienvenido al server de Tavyuxx")
        .setDescription(`Nos alegra tenerte aquí, ${member}!`)
        .setColor("#B100FF")
        .setImage("https://i.imgur.com/t4obNhs.png");

    canal.send({ embeds: [embed] }).catch(console.error);
});

// ============================
// Comandos con prefijo
// ============================
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

        message.channel.send({ embeds: [embed] }).catch(console.error);
    }
});

// ============================
// Login del bot
// ============================
if (!process.env.TOKEN) {
    console.error("❌ TOKEN no encontrado en variables de entorno");
    process.exit(1);
}

client.login(process.env.TOKEN).catch(console.error);
