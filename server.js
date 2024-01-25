// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const express = require('express');
const app = express();
const cors = require('cors');
// Use CORS middleware
app.use(cors());

app.use(express.static('public'));

app.use(express.json());

const YOUR_URL = process.env.YOUR_URL;

app.post('/create-checkout-session/standard', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: process.env.STANDARD_PRICE,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${YOUR_URL}?success=true`,
    cancel_url: `${YOUR_URL}?canceled=true`,
  });

  res.redirect(303, session.url);
});

app.post('/create-checkout-session/premium', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: process.env.PREMIUM_PRICE,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${YOUR_URL}?success=true`,
    cancel_url: `${YOUR_URL}?canceled=true`,
  });

  res.redirect(303, session.url);
});

app.get('/products', async (req, res) => {
  try {
    const products = await stripe.products.list();
    const prices = await stripe.prices.list();

    const productsWithPrices = products.data.map(product => {
      const price = prices.data.find(price => price.product === product.id);
      return {
        id: product.id,
        name: product.name,
        price: price ? price.unit_amount : 0, // Assuming price is in cents
        priceId: price ? price.id : null, // Adding the price_id to the response
      };
    });

    console.log('Products with prices:', productsWithPrices);
    res.json(productsWithPrices);
  } catch (error) {
    console.error('Error fetching products from Stripe:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(4242, () => console.log('Running on port 4242'));