const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const paymentsTotal = async businessID => {
  const merchantNumber = await prisma.business.findUnique({
    where: {
      id: businessID
    },
    select: {
      phone: true,
      transactions: {
        where: {
          paid: false
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  let myTransactions = merchantNumber.transactions

  const sumArray = myTransactions.map(x => {
    return parseInt(x.amount)
  })

  myTally = sumArray.reduce((a, b) => a + b, 0)
  console.log(myTally)

  return myTally.toString()
}

module.exports = { paymentsTotal }
