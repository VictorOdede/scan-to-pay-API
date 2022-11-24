const { PrismaClient } = require('@prisma/client')
const express = require('express')
const prettyjson = require('prettyjson')
const { mpesaStkCallback } = require('./api/stk-callback')
const { paymentRequest } = require('./api/payment-request')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const { auth } = require('express-oauth2-jwt-bearer')


const checkJwt = auth({
  audience: 'https://lipa-api/',
  issuerBaseURL: 'https://lipa.eu.auth0.com/'
})

const prisma = new PrismaClient()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const port = process.env.PORT

let business_id;

/************************************************************************************************************************/

app.get('/', async(req,res) =>{
  res.send('Your server is running')
} )

/************************************************************************************************************************/

// create webhook endpoint to receive webhooks from Safaricom
app.post('/hooks/mpesa', async (req, res) => {
  console.log('---------Received M-Pesa webhook---------')

  // format and dump the request payload received from safaricom to the terminal
  // console.log(prettyjson.render(req.body, options))

  mpesaStkCallback(req.body, business_id)
  
  // respond to safaricom server with success message
  res.status(200).send()
})

/************************************************************************************************************************/


// enpoint for receiving payment request from client
app.post('/api/transaction', checkJwt, async (req, res) => {
  console.log('------------transaction is processing------------')

  // log the req data
  // console.log(prettyjson.render(req.body))

  const { myAmount, mySender, myBusiness } = req.body

  // call mpesa api & send response to client
  if (myAmount > 0) {
    paymentRequest(myAmount, mySender, myBusiness)
    res.status(200).send()
  } else {
    res.status(400).send()
  }
})

/************************************************************************************************************************/

// fetch businessID as a request param into pre-transaction url(QR code URL)
app.post('/:id', async(req, res) => {
  console.log('------------new transaction------------')

  // log the req data
  console.log(prettyjson.render(req.body))

  const { amountSent, sender, clientID } = req.body

  business_id = req.params.id

  const clientSecret = process.env.CLIENT_SECRET;

  const options = {
    method: 'post',
    url: 'https://lipa.eu.auth0.com/oauth/token',
    headers: {'content-type': 'application/json'},
    data: JSON.stringify({
        client_id: clientID,
        client_secret: clientSecret,
        audience: 'https://lipa-api/',
        grant_type: 'client_credentials'
    })
  }

  const myResponse = await axios(options)
  const accessToken = myResponse.data.access_token;
//   console.log(accessToken);

  // Fetch business name to pass to stk push 
  const business_name = await prisma.business.findUnique({
    where: {
      id: business_id
    },
    select: {
      businessName: true
    }
  })


  const options2 = 
  {
    method: 'post',
    url: 'https://lipa-api-ro6xg.ondigitalocean.app/api/transaction',
    headers: {"authorization": "Bearer " + accessToken},
    data: {
      myAmount: amountSent,
      mySender: sender,
      myBusiness: business_name.businessName
    }
  }

  // call mpesa api & send response to client
  if (amountSent > 0 && business_name) {
    await axios(options2)
    res.status(200).send()
  } else {
    res.status(400).send()
  }

} )


/************************************************************************************************************************/

// redirect to play store when a normal QR scanner is used to scan the Lipa QR code
app.get('/:id', (req, res) => {
    res.redirect('https://play.google.com/store/apps/details?id=com.slickvik99.lipa')
  })

/************************************************************************************************************************/

app.listen(port, () => {
    try {
      console.log(`Listening on port ${port}...`)
    } catch (err) {
      console.log(err)
    }
  })

  
