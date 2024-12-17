const express = require('express')
const path = require('path')
const axios = require('axios')
const bodyParser = require("body-parser");

const port = process.env.PORT || 5006

const app = express()


app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'))


const data = { "orderServiceHostOrIpAddress": "santahacked-d65194df8a91.herokuapp.com"  ,  
"secretInput": "Plush123!"};

app.get('/api', async (req, res) => {
  try {
    console.log(data)
    // Send post request
    const response = await axios.post(
      'https://dec-2024-mini-challenge.csit-events.sg/api/gatekeeper/access', 
         data
      , {
        headers: {'Content-Type': 'application/json'}
      }
    );
    // Send the API's response back to the client
    res.json(response);
  } catch (error) {
    // Handle errors
    console.error('Error fetching data:', error);
    res.status(500).json({error});
  }
});


app.get('/', (req, res) => {
  res.send('Hello, Heroku!');
})


// Webhook listener route
app.post('/api/toyProductionKey', (req, res) => {
  try {
    // Log the incoming webhook payload
    console.log('Webhook received:', JSON.stringify(req.body));
    // Acknowledge receipt of the webhook
    res.status(200).send('Webhook received!' + JSON.stringify(req.body));
  } catch (error) {
    console.error('Error processing webhook:', error.message);
    res.status(500).send('Internal Server Error');
  }
})


const server = app.listen(port, () => {
  console.log(`Listening on ${port}`)
})

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: gracefully shutting down')
  if (server) {
    server.close(() => {
      console.log('HTTP server closed')
    })
  }
})