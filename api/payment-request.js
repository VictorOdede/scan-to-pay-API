const { tokenRequest } = require('./token-request')
const { mpesaRequest } = require('./mpesa-request')


// Use async function to allow time to resolve token and stk-push request
async function paymentRequest(sent_amount, sender_number, account_name) {
  const apiKey = process.env.MPESA_KEY
  const apiSecret = process.env.MPESA_SECRET

  // Wait for token to resolve
  const newToken = await tokenRequest(apiKey, apiSecret)

  // Call the mpesa payment request and pass the access token
  const myRequest = await mpesaRequest(
    newToken,
    sent_amount,
    sender_number,
    account_name
  )

  // console.log(myRequest)

}

module.exports = { paymentRequest }
