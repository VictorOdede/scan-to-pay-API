const request = require('request')
const btoa = require('btoa')
const { format } = require('date-fns')
const { passkey, shortcode } = require('./env-variables')

const myUrl = process.env.URL
const passkey = process.env.PASSKEY
const shortcode = process.env.SHORTCODE
// create timestamp
function getTime() {
  let currentDate = format(new Date(), 'yMMddHHmmss')
  return currentDate
}

// create passcode
function getPass(businessShortcode, timestamp) {
  // const passKey = process.env.PASSKEY

  const pass_code = `${businessShortcode}${passkey}${timestamp}`

  // encode the passcode to base64
  const encodedPass = btoa(pass_code)
  return encodedPass
}

// pass variables to mpesa function send request to M-Pesa API
async function mpesaRequest(token, sent_amount, sender_number, account_name) {
  const shortCode = shortcode
  const transactionType1 = "CustomerPayBillOnline"
  const transactionType2 = "CustomerBuyGoodsOnline"
  const storeNumber = "7481234"
  const tillNumber = "9349783"
  const paybill="4087397"

  let timeNow = getTime()
  let myPass = getPass(paybill, timeNow)
  console.log(myPass)

  let options = {
    method: 'POST',
    url: 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      BusinessShortCode: paybill,
      Password: myPass,
      Timestamp: timeNow,
      TransactionType: transactionType1,
      Amount: sent_amount,
      PartyA: sender_number,
      PartyB: paybill,
      PhoneNumber: sender_number,
      CallBackURL: myUrl,
      AccountReference: account_name,
      TransactionDesc: `Ksh.${sent_amount} has been sent to ${account_name}`
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

module.exports = { mpesaRequest, getPass, getTime }
