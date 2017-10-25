exports.run = (client, message, args, config) => {
    message.channel.send("pong!").catch(console.error);
}