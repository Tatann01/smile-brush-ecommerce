import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI)

export default async function handler(req, res) {
  try {
    await client.connect()
    const db = client.db('smile_brush')
    const users = db.collection('users')
    
    // RESEVWA TOU CLIENTS
    const clients = await users.find({}).toArray()
    
    res.status(200).json({
      success: true,
      clients: clients,
      totalClients: clients.length,
      activeClients: clients.filter(c => c.tokenStatus === 'active').length
    })
    
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: error.message })
  } finally {
    await client.close()
  }
}
