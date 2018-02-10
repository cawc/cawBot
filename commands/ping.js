exports.run = (client, message, args, config) => {
    message.react('🏓').catch(console.error);
}