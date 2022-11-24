const AfricasTalking = require('africastalking')


const credentials = {
  apiKey: process.env.API_KEY,
  username: process.env.USERNAME
}

// Initialize Africa's Talking
const africastalking = AfricasTalking(credentials)

async function sendMessage(recepient, sentAmount, senderNumber, currentTotal, mpesaID) {
  // Send message
  console.log(recepient)

  try {
    const result = await africastalking.SMS.send({
      to: recepient, // recepient phone number in string with +254 prefix
      message: `Transaction ${mpesaID} was successful. You have received KSH.${sentAmount} from ${senderNumber}. Your current total is KSH.${currentTotal}`
    })
    console.log(result)
  } catch (err) {
    console.error(err)
  }
}

module.exports = { sendMessage }
