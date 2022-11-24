const request = require('request')
const { getTime, getPass } = require('./mpesa-request')
const { tokenRequest } = require('./token-request')


// check status of transaction if timeout expires
const apiKey = process.env.MPESA_KEY
const apiSecret = process.env.MPESA_SECRET
const shortCode = process.env.SHORTCODE

const transactionStatus = async checkoutID => {
  const timeNow = getTime()
  const myPass = getPass(shortCode, timeNow)

  // Wait for token to resolve
  const myToken = await tokenRequest(apiKey, apiSecret)

  const options = {
    method: 'POST',
    url: ' https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query ',
    headers: {
      Authorization: `Bearer ${myToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      BusinessShortCode: shortCode,
      CheckoutRequestID: checkoutID,
      Password: myPass,
      Timestamp: timeNow
    })
  }

  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) {
        console.log(error)
        reject(error)
      }
      resolve(body)
    })
  })
}

// const ID = "ws_CO_05042022171838580385"

// transactionStatus(ID).then((result)=>{
//     console.log(result)
// }).catch(error => console.log(error) )

module.exports = { transactionStatus }
