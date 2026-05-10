import axios from 'axios'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const event = req.body
    
    try {
      // KI FO PEMAN RESEWI
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        
        const discordPayment = {
          content: `💰 **NOUVO PEMAN!**`,
          embeds: [
            {
              title: 'Payment Received - SmileBrush',
              color: 3066993,
              fields: [
                {
                  name: '💳 Amount',
                  value: `$${(session.amount_total / 100).toFixed(2)}`,
                  inline: true
                },
                {
                  name: '📧 Email',
                  value: session.customer_email || 'Unknown',
                  inline: true
                },
                {
                  name: '🆔 Session ID',
                  value: session.id,
                  inline: false
                },
                {
                  name: '⏰ Time',
                  value: new Date().toLocaleString('fr-FR'),
                  inline: true
                },
                {
                  name: '✅ Status',
                  value: 'PAID',
                  inline: true
                }
              ],
              footer: {
                text: 'Stripe Payment System'
              },
              timestamp: new Date().toISOString()
            }
          ]
        }
        
        if (process.env.DISCORD_WEBHOOK_URL) {
          await axios.post(process.env.DISCORD_WEBHOOK_URL, discordPayment)
        }
      }
      
      res.status(200).json({ received: true })
      
    } catch (error) {
      console.error('Discord erè:', error)
      res.status(200).json({ received: true })
    }
  }
}
