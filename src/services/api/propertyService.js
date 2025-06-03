import propertyData from '../mockData/property.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let properties = [...propertyData]

const propertyService = {
  async getAll() {
    await delay(300)
    return [...properties]
  },

  async getById(id) {
    await delay(250)
    const property = properties.find(p => p.id === id)
    if (!property) {
      throw new Error('Property not found')
    }
    return { ...property }
  },

  async create(propertyData) {
    await delay(400)
    const newProperty = {
      ...propertyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    properties.push(newProperty)
    return { ...newProperty }
  },

  async update(id, updates) {
    await delay(350)
    const index = properties.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Property not found')
    }
    
    properties[index] = {
      ...properties[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return { ...properties[index] }
  },

  async delete(id) {
    await delay(300)
    const index = properties.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Property not found')
    }
    
    const deletedProperty = properties.splice(index, 1)[0]
    return { ...deletedProperty }
  },

  async searchProperties(filters = {}) {
    await delay(350)
    let filtered = [...properties]

    if (filters.location) {
      filtered = filtered.filter(p => 
        p.address.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        p.address.state.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= filters.minPrice)
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice)
    }

    if (filters.propertyType) {
      filtered = filtered.filter(p => p.type === filters.propertyType)
    }

    if (filters.listingType) {
      filtered = filtered.filter(p => p.listingType === filters.listingType)
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedrooms)
    }

    return filtered
  }
}

export default propertyService