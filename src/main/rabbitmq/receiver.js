// /*
//  * npm install amqplib
//  */
// var amqp = require('amqplib/callback_api')
//
// const url = 'amqp://localhost'
// const queueName = 'PB_QUEUE'
//
// import Sqlite3 from '../database'
//
// async function receiveQueueMessage () {
//   return new Promise(function(succ, fail) {
//     amqp.connect(url, function(err, connect) {
//       if (err) {
//         console.log(err)
//         fail(err)
//       }
//       connect.createConfirmChannel(function(err, channel) {
//         if (err) {
//           console.log(err)
//           fail(err)
//         }
//
//         channel.assertQueue(queueName, {durable: true}, function(err) {
//         //prefetch를 설정해두면 큐에서 최대 10개만 가져감.
//         // channel.prefetch(10)
//         // channel.consume(queueName, function(msg) {
//       	// 	console.log(" [x] Received %s", msg.content.toString())
//         //   var receiveMsg = JSON.parse(msg.content.toString())
//         //   if (receiveMsg.type === 'insert') {
//         //     await Sqlite3.INSERT(receiveMsg.sql, receiveMsg.args)
//         //   } else if (receiveMsg.type === 'alterTable') {
//         //     await Sqlite3.ALTER_TABLE(receiveMsg.sql, receiveMsg.args, receiveMsg.table, receiveMsg.column)
//         //   }
//       	// 	//Ack 메세지를 보내야 큐에서 제거함
//       	// 	channel.ack(msg)
//       	// 	//channel.nack(msg)
//         // }, {
//         //     //noAck: true 이면 queue에서 데이터를 가져간다음 Ack를 바로 반환함으로 가져가자마자 queue에서 지워버림, ack를 받았을 경우만 큐에서 제거하기 위해 false로 설정
//         //     noAck: false
//         // })
//
//           let recevieMessage = function() {
//             channel.get(queueName, {}, function(err, message) {
//               if (err) {
//                 log.info(err)
//                 fail(err)
//
//               } else if(message) {
//                 log.info(message.content.toString())
//
//                 var receiveMsg = JSON.parse(message.content.toString())
//                 if (receiveMsg.type === 'insert') {
//                   Sqlite3.INSERT(receiveMsg.sql, receiveMsg.args).then(function(res) {
//                     channel.ack(message)
//                   }).catch(function(err) {
//                     log.info(err)
//                   })
//                 } else if (receiveMsg.type === 'alterTable') {
//                   Sqlite3.ALTER_TABLE(receiveMsg.sql, receiveMsg.args,
//                     receiveMsg.table, receiveMsg.column).then(function(res) {
//                     channel.ack(message)
//                   }).catch(function(err) {
//                     log.info(err)
//                   })
//                 } else {
//                   channel.ack(message)
//                 }
//
//                 setTimeout(recevieMessage, 1000)
//               } else {
//                 log.info('NO MESSAGE')
//                 channel.close()
//                 connect.close()
//                 succ({
//                   isEnd: true,
//                   message: 'NO MESSAGE'
//                 })
//                 // setTimeout(recevieMessage, 1000)
//               }
//             })
//           }
//           recevieMessage()
//         })
//       })
//     })
//   })
// }
//
// export default {
//   async receiveQueueMessage () {
//     return await receiveQueueMessage()
//   }
// }
