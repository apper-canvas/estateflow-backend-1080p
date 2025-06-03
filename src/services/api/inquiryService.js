import inquiryData from '../mockData/inquiry.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let inquiries = [...inquiryData]

const inquiryService = {
  async getAll() {
    await delay(300)
    return [...inquiries]
  },

  async getById(id) {
    await delay(250)
    const inquiry = inquiries.find(i => i.id === id)
    if (!inquiry) {
      throw new Error('Inquiry not found')
    }
    return { ...inquiry }
  },

  async create(inquiryData) {
    await delay(400)
    const newInquiry = {
      ...inquiryData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    }
    inquiries.push(newInquiry)
    return { ...newInquiry }
  },

  async update(id, updates) {
    await delay(350)
    const index = inquiries.findIndex(i => i.id === id)
    if (index === -1) {
      throw new Error('Inquiry not found')
    }
    
    inquiries[index] = {
      ...inquiries[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return { ...inquiries[index] }
  },

  async delete(id) {
    await delay(300)
    const index = inquiries.findIndex(i => i.id === id)
    if (index === -1) {
      throw new Error('Inquiry not found')
    }
    
    const deletedInquiry = inquiries.splice(index, 1)[0]
    return { ...deletedInquiry }
  },

  async getByPropertyId(propertyId) {
    await delay(300)
    return inquiries.filter(i => i.propertyId === propertyId)
  },

  async getByUserId(userId) {
    await delay(300)
    return inquiries.filter(i => i.userId === userId)
  }
}

export default inquiryService