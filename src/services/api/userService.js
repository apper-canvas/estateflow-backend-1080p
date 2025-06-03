import userData from '../mockData/user.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let users = [...userData]

const userService = {
  async getAll() {
    await delay(300)
    return [...users]
  },

  async getById(id) {
    await delay(250)
    const user = users.find(u => u.id === id)
    if (!user) {
      throw new Error('User not found')
    }
    return { ...user }
  },

  async create(userData) {
    await delay(400)
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      savedProperties: [],
      listings: []
    }
    users.push(newUser)
    return { ...newUser }
  },

  async update(id, updates) {
    await delay(350)
    const index = users.findIndex(u => u.id === id)
    if (index === -1) {
      throw new Error('User not found')
    }
    
    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return { ...users[index] }
  },

  async delete(id) {
    await delay(300)
    const index = users.findIndex(u => u.id === id)
    if (index === -1) {
      throw new Error('User not found')
    }
    
    const deletedUser = users.splice(index, 1)[0]
    return { ...deletedUser }
  },

  async saveProperty(userId, propertyId) {
    await delay(250)
    const user = users.find(u => u.id === userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    if (!user.savedProperties.includes(propertyId)) {
      user.savedProperties.push(propertyId)
    }
    
    return { ...user }
  },

  async unsaveProperty(userId, propertyId) {
    await delay(250)
    const user = users.find(u => u.id === userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    user.savedProperties = user.savedProperties.filter(id => id !== propertyId)
    return { ...user }
  }
}

export default userService