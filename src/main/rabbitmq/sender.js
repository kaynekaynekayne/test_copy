// /*
//  * npm install amqplib
//  */
// var amqp = require('amqplib/callback_api')
//
// const url = 'amqp://localhost'
// const queueName = 'PB_QUEUE'
//
// async function sendMessage (msg) {
//   return new Promise(function(succ, fail) {
//     amqp.connect(url, function(err, connect) {
//       if (err) {
//         console.log(err)
//         fail(err)
//       }
//       connect.createConfirmChannel(function(err, channel) {
//         if(err) {
//           console.log(err)
//           fail(err)
//         }
//
//         // mq다운 되어도 데이터 유지
//         channel.assertQueue(queueName, {
//           durable: true
//         })
//
//         console.log('send : ' + msg)
//         // persistent : 메세지 유지
//         channel.sendToQueue(queueName, Buffer.from(msg), { persistent: true })
//
//         channel.waitForConfirms(function(err) {
//           if (err) {
//             console.log(err)
//             fail(err)
//           } else {
//             channel.close()
//             connect.close()
//             succ('all message done')
//           }
//         })
//       })
//     })
//   })
// }
//
// function encode(doc) {
//   return Buffer.from(JSON.stringify(doc))
//   // return new Buffer(JSON.stringify(doc))
// }
//
// export default {
//   async sendMessage (msg) {
//     return await sendMessage(msg)
//   }
// }
