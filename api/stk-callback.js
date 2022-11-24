const { PrismaClient } = require('@prisma/client')
const { formatMpesaStkObject } = require('./format-stk')
const { sendMessage } = require('./send-sms')
const { transactionStatus } = require('./transactionStatus')
const { paymentsTotal } = require('./paymentsTotal')

const prisma = new PrismaClient()

const mpesaStkCallback = async (data, businessID) => {
  // Destructure data variables
  let { ResultCode, CheckoutRequestID, MerchantRequestID } =
    data.Body.stkCallback

  // Check if payment is successful
  if (ResultCode === 0) {
    const status = await transactionStatus(CheckoutRequestID)
    console.log(status)

    // Format mpesaStk webhook data
    const mpesaObj = await formatMpesaStkObject({ data })
    console.log(mpesaObj)

    const { Amount, PhoneNumber, MpesaReceiptNumber } = mpesaObj

    const amount_str = Amount.toString()
    const phone_str = `${PhoneNumber}`

    //mutate prisma db
    const newTransaction = await prisma.transaction.create({
      data: {
        amount: amount_str,
        senderNumber: phone_str,
        recepientID: businessID,
        transactionID: MpesaReceiptNumber,
        success: true
      }
    })
    console.log(newTransaction)

    //get recepient phone number
    const recepientData = await prisma.business.findUnique({
      where: {
        id: businessID
      },
      select: {
        phone: true
      }
    })

    const bizPhone = recepientData.phone

    const recepientPhone = '+254' + bizPhone.slice(1)

    // get current total
    const myTotal = await paymentsTotal(businessID)

    // send confirmation SMS to business
    await sendMessage(recepientPhone, amount_str, phone_str, myTotal, MpesaReceiptNumber)

    return mpesaObj
  }
}

module.exports = { mpesaStkCallback }
