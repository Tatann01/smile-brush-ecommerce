import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { quantity = 1, email } = req.body
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'SmileBrush - Revolutionary Dental Gadget',
                description: 'Advanced teeth brushing device with AI technology',
                images: [process.env.NEXT_PUBLIC_PRODUCT_IMAGE || 'https://via.placeholder.com/300']
              },
              unit_amount: 9999 // $99.99
            },
            quantity: quantity
          }
        ],
        mode: 'payment',
        customer_email: email,
        success_url: `${process.env.NEXTAUTH_URL}/success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/cancelled`,
        metadata: {
          email: email
        }
      })

      res.json({ id: session.id, url: session.url })
    } catch (err) {
      console.error('Stripe error:', err)
      res.status(500).json({ 
        statusCode: 500, 
        message: err.message 
      })
    }
  }
}
