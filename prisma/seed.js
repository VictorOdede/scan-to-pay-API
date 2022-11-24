const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const userData = [
  {
    businessName: 'MY BUSINESS',
    email: 'mybusiness1@mail.com',
    phone: '0716305157',
    tillNumber: '789987',
    password: 'password'
  },

  {
    businessName: 'L.A CUSTOMS',
    email: 'business2@mail.com',
    phone: '0716305157',
    tillNumber: '789987',
    password: 'password'
  }
]

const testBranches = [ 
{
  branchName: "L.A Customs 1",
  businessEmail: "business2@mail.com",

},

{
  branchName: "L.A Customs 2",
  businessEmail: "business2@mail.com",

},

{
  branchName: "L.A Customs 3",
  businessEmail: "business2@mail.com",

},

]

const testPayers = [
  {
    phone: "0712345677"
  },
  {
    phone: "0712345676"
  },
  {
    phone: "0712345675"
  },
  {
    phone: "0712345674"
  },
  {
    phone: "0712345673"
  },
  {
    phone: "0712345672"
  },
  {
    phone: "0712345671"
  }
]

const testTransactions = [
  

  {
    amount: "4500",
    senderNumber: "0712345677",
    recepientEmail: "business2@mail.com", 
    branchId: "1dadb5fc-7737-4cb6-87a2-8abbd204f89b"
  },

  {
    amount: "6000",
    senderNumber: "0712345676",
    recepientEmail: "business2@mail.com", 
    branchId: "1dadb5fc-7737-4cb6-87a2-8abbd204f89b"
  },

  {
    amount: "6500",
    senderNumber: "0712345675",
    recepientEmail: "business2@mail.com", 
    branchId: "07793173-08da-4a9b-b72a-a9fae34423f4"
  },

  {
    amount: "300",
    senderNumber: "0712345674",
    recepientEmail: "business2@mail.com", 
    branchId: "07793173-08da-4a9b-b72a-a9fae34423f4"
  },

  {
    amount: "2500",
    senderNumber: "0712345675",
    recepientEmail: "business2@mail.com", 
    branchId: "07793173-08da-4a9b-b72a-a9fae34423f4"
  },

  {
    amount: "3500",
    senderNumber: "0712345673",
    recepientEmail: "business2@mail.com", 
    branchId: "232ea405-6e6b-40da-a216-06ea1186361f"
  },

  {
    amount: "8000",
    senderNumber: "0712345672",
    recepientEmail: "business2@mail.com", 
    branchId: "232ea405-6e6b-40da-a216-06ea1186361f"
  },

  {
    amount: "7500",
    senderNumber: "0712345671",
    recepientEmail: "business2@mail.com", 
    branchId: "232ea405-6e6b-40da-a216-06ea1186361f"
  },



  
]


async function main() {
  
  for (let u of userData) {
    let user = await prisma.business.create({
      data: u
    })
    console.log(`created user with id: ${user.id}`)
  }


  for (let v of testBranches) {
    var myBranch = await prisma.branch.create({
      data: v
    })
    console.log(`created a branch with id: ${myBranch.id}`)
  }


  for ( let w of testPayers) {
    var myPayer = await prisma.payer.create({ 
      data: w
    })

    console.log(`created a payer with id: ${myPayer.id}`)
  }

  for ( let w of testTransactions) {
    var myTransaction = await prisma.transaction.create({
      data: w
    })
  }

  
}

main()
  .catch(err => {
    console.error(err)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
