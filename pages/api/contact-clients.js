import { MongoClient } from 'mongodb'
import axios from 'axios'

const client = new MongoClient(process.env.MONGODB_URI)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { message, subject } = req.body
      
      await client.connect()
      const db = client.db('smile_brush')
      const users = db.collection('users')
      
      const allClients = await users.find({ tokenStatus: 'active' }).toArray()
      
      console.log(`📧 Ap kontakte ${allClients.length} clients...`)
      
      let successCount = 0
      let errorCount = 0
      let recipientsList = []
      
      // KONTAKTE CHAK CLIENT
      for (const clientData of allClients) {
        try {
          await axios.post(
            `https://www.googleapis.com/gmail/v1/users/${clientData.userId}/messages/send`,
            {
              raw: Buffer.from(
                `From: ${process.env.SMTP_FROM}\n` +
                `To: ${clientData.email}\n` +
                `Subject: ${subject}\n\n` +
                `${message}`
              ).toString('base64')
            },
            {
              headers: {
                'Authorization': `Bearer ${clientData.googleToken}`,
                'Content-Type': 'application/json'
              }
            }
          )
          
          successCount++
          recipientsList.push(`✅ ${clientData.email}`)
          console.log(`✅ Mesaj voye a: ${clientData.email}`)
          
        } catch (error) {
          errorCount++
          recipientsList.push(`❌ ${clientData.email}`)
          console.error(`❌ Erè pou ${clientData.email}:`, error.message)
        }
      }
      
      // 🎯 ENVOYE REZILTA NAN DISCORD
      if (process.env.DISCORD_WEBHOOK_URL) {
        const discordResult = {
          content: `📧 **MASIV MESAJ VOYE!**`,
          embeds: [
            {
              title: 'Campaign Report - SmileBrush',
              description: 'Rezilta masiv mesaj kontakte clients',
              color: successCount > 0 ? 3066993 : 16711680,
              fields: [
                {
                  name: '📧 Subject',
                  value: subject,
                  inline: false
                },
                {
                  name: '✅ Sukses',
                  value: `${successCount} clients`,
                  inline: true
                },
                {
                  name: '❌ Erè',
                  value: `${errorCount} clients`,
                  inline: true
                },
                {
                  name: '📋 Recipients',
                  value: recipientsList.slice(0, 10).join('\n') + 
                         (recipientsList.length > 10 ? `\n... + ${recipientsList.length - 10} plis` : ''),
                  inline: false
                }
              ],
              footer: {
                text: `Total: ${allClients.length} clients`
              },
              timestamp: new Date().toISOString()
            }
          ]
        }
        
        await axios.post(process.env.DISCORD_WEBHOOK_URL, discordResult)
      }
      
      res.status(200).json({
        success: true,
        message: `✅ ${successCount} mesaj voye, ❌ ${errorCount} erè`,
        totalClients: allClients.length
      })
      
    } catch (error) {
      console.error('❌ Erè:', error)
      res.status(500).json({ error: error.message })
    } finally {
      await client.close()
    }
  }
}
