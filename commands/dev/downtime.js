const options = require('./../../config/options')

module.exports = {
    name: 'downtime',
    usage: 'downtime <time (minutes)>',
    aliases: [],
    description: 'Notify users when downtimes will occur.',
    category: 'dev',
    permissions: ['GOD'],
    dmCommand: true,
    args: true,
    run: function(msg, args) {
        const length =  Math.round(parseFloat(args[0]) * 60000)
        const startTime = Date.now() + length
        if(msg.client.downtime > 0) {
            msg.channel.sendMsgEmbed('Would you like to disable the current downtime message? Enter `yes` or `no`.')
            msg.channel.awaitMessages(m => (m.content.toLowerCase() == 'yes' || m.content.toLowerCase() == 'no') && m.author.id == msg.author.id, {max: 1, time: 30000 }).then(collected => {
                const message = collected.first().content.toLowerCase()
                if(message == 'yes') {
                    msg.client.downtime = -1
                    msg.channel.sendMsgEmbed('Downtime cancelled.')
                } else {
                    msg.channel.sendMsgEmbed('Downtime not cancelled.')
                }
            })
        } else if(!isNaN(length)) {
            msg.client.downtimeStart = startTime
            msg.client.setTimeout(() => {
                msg.client.emit('downtimeStart')
            }, length);
            msg.channel.sendMsgEmbed(`Downtime enabled for ${args[0]} minute(s).`)
        } else {
            msg.channel.sendMsgEmbed(`Invalid time, set time as a floating point value in minutes.`, 'Error!', options.colors.error)
        }
    }
  }