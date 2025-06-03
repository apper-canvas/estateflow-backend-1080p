import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import propertyService from '../services/api/propertyService'

const Home = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [propertyType, setPropertyType] = useState('all')
  const [darkMode, setDarkMode] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true)
      try {
        const result = await propertyService.getAll()
        setProperties(result || [])
      } catch (err) {
        setError(err.message)
        toast.error("Failed to load properties")
      } finally {
        setLoading(false)
      }
    }
    loadProperties()
  }, [])

  // Filter properties based on search criteria
  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchTerm === '' || 
      property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property?.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property?.address?.state?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = propertyType === 'all' || property?.type === propertyType
    
    const matchesPrice = (!priceRange.min || property?.price >= parseInt(priceRange.min)) &&
                        (!priceRange.max || property?.price <= parseInt(priceRange.max))
    
    return matchesSearch && matchesType && matchesPrice
  })

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price || 0)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
}

  const handleViewDetails = (property) => {
    setSelectedProperty(property)
    setShowModal(true)
    toast.info(`Viewing details for ${property?.title || 'property'}`)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedProperty(null)
  }

  // Property Detail Modal Component
  const PropertyDetailModal = ({ property, isOpen, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    if (!isOpen || !property) return null

    const images = property.images || ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80']
    
    const nextImage = () => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-surface-900 bg-opacity-75" onClick={onClose}></div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative inline-block w-full max-w-4xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-surface-800 shadow-xl rounded-3xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-surface-700/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-surface-600 transition-all duration-200"
            >
              <ApperIcon name="X" className="h-5 w-5 text-surface-700 dark:text-surface-300" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden">
                  <img
                    src={images[currentImageIndex]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 dark:bg-surface-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-surface-700 transition-all duration-200"
                      >
                        <ApperIcon name="ChevronLeft" className="h-4 w-4 text-surface-700 dark:text-surface-300" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 dark:bg-surface-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-surface-700 transition-all duration-200"
                      >
                        <ApperIcon name="ChevronRight" className="h-4 w-4 text-surface-700 dark:text-surface-300" />
                      </button>
                    </>
                  )}
                </div>
                
                {images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden ${
                          index === currentImageIndex ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${property.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      property.listingType === 'sale' 
                        ? 'bg-accent text-white' 
                        : 'bg-secondary text-white'
                    }`}>
                      For {property.listingType === 'sale' ? 'Sale' : 'Rent'}
                    </span>
                    <span className="px-3 py-1 bg-surface-100 dark:bg-surface-700 rounded-full text-xs font-semibold text-surface-700 dark:text-surface-300">
                      {property.type === 'residential' ? 'Residential' : 'Commercial'}
                    </span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-surface-600 dark:text-surface-400 mb-4">
                    <ApperIcon name="MapPin" className="h-4 w-4 mr-2" />
                    <span>{property.address?.street}, {property.address?.city}, {property.address?.state} {property.address?.zipCode}</span>
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-primary">
                    {formatPrice(property.price)}
                    {property.listingType === 'rent' && 
                      <span className="text-lg font-normal text-surface-500">/month</span>
                    }
                  </div>
                </div>

                {/* Property Specs */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
                    <ApperIcon name="Bed" className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-lg font-bold text-surface-900 dark:text-surface-100">{property.bedrooms}</div>
                    <div className="text-sm text-surface-600 dark:text-surface-400">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
                    <ApperIcon name="Bath" className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-lg font-bold text-surface-900 dark:text-surface-100">{property.bathrooms}</div>
                    <div className="text-sm text-surface-600 dark:text-surface-400">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
                    <ApperIcon name="Maximize" className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-lg font-bold text-surface-900 dark:text-surface-100">{property.area?.toLocaleString()}</div>
                    <div className="text-sm text-surface-600 dark:text-surface-400">Sq Ft</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-3">Description</h3>
                  <p className="text-surface-600 dark:text-surface-400 leading-relaxed">
                    {property.description || 'Beautiful property in a prime location with modern amenities and excellent accessibility. Perfect for families looking for comfort and convenience.'}
                  </p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-3">Features & Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(property.features || ['Parking', 'Garden', 'Modern Kitchen', 'Air Conditioning', 'Security System', 'Balcony']).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <ApperIcon name="Check" className="h-4 w-4 text-accent" />
                        <span className="text-sm text-surface-700 dark:text-surface-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-3">Contact Agent</h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-surface-900 dark:text-surface-100">
                        {property.agent?.name || 'Real Estate Agent'}
                      </div>
                      <div className="text-sm text-surface-600 dark:text-surface-400">
                        {property.agent?.phone || '(555) 123-4567'}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex-1 px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all duration-200 font-semibold">
                      <ApperIcon name="Phone" className="h-4 w-4 mr-2 inline" />
                      Call
                    </button>
                    <button className="flex-1 px-4 py-3 bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300 rounded-xl transition-all duration-200 font-semibold">
                      <ApperIcon name="Mail" className="h-4 w-4 mr-2 inline" />
                      Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertTriangle" className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-surface-900 mb-2">Something went wrong</h1>
          <p className="text-surface-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-surface-200/50 dark:border-surface-700/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                <ApperIcon name="Building2" className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                EstateFlow
              </h1>
            </motion.div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 lg:p-3 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-200"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="h-5 w-5 lg:h-6 lg:w-6 text-surface-700 dark:text-surface-300" 
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Search and Filters */}
        <motion.div
          className="mb-8 lg:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white dark:bg-surface-800 rounded-3xl shadow-property p-6 lg:p-8 border border-surface-200/50 dark:border-surface-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                  Search Properties
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by location, title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 lg:py-4 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100 placeholder-surface-500 dark:placeholder-surface-400"
                  />
                  <ApperIcon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-3 lg:py-4 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100"
                >
                  <option value="all">All Types</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div className="flex items-end space-x-2">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="flex items-center justify-center w-full px-4 py-3 lg:py-4 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  <ApperIcon name={viewMode === 'grid' ? "List" : "Grid3X3"} className="h-5 w-5 mr-2" />
                  {viewMode === 'grid' ? 'List' : 'Grid'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="$ 0"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100 placeholder-surface-500 dark:placeholder-surface-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="$ 1,000,000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100 placeholder-surface-500 dark:placeholder-surface-400"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Feature Component */}
        <MainFeature properties={filteredProperties} />

        {/* Properties Grid/List */}
        <motion.div
          className="mt-12 lg:mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-surface-100">
              {filteredProperties.length} Properties Found
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={
                  viewMode === 'grid'
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
                    : "space-y-6"
                }
              >
                {filteredProperties.length === 0 ? (
                  <div className="col-span-full text-center py-16">
                    <ApperIcon name="Search" className="h-16 w-16 text-surface-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-surface-700 dark:text-surface-300 mb-2">
                      No properties found
                    </h3>
                    <p className="text-surface-500 dark:text-surface-400">
                      Try adjusting your search criteria
                    </p>
                  </div>
                ) : (
                  filteredProperties.map((property, index) => (
                    <motion.div
                      key={property?.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`property-card-hover bg-white dark:bg-surface-800 rounded-3xl shadow-property overflow-hidden border border-surface-200/50 dark:border-surface-700/50 ${
                        viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                      }`}
                    >
                      <div className={`relative ${viewMode === 'list' ? 'md:w-1/3' : ''}`}>
                        <img
                          src={property?.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'}
                          alt={property?.title || 'Property'}
                          className={`w-full object-cover ${viewMode === 'list' ? 'h-48 md:h-full' : 'h-48 lg:h-56'}`}
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            property?.listingType === 'sale' 
                              ? 'bg-accent text-white' 
                              : 'bg-secondary text-white'
                          }`}>
                            For {property?.listingType === 'sale' ? 'Sale' : 'Rent'}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-surface-900">
                            {property?.type === 'residential' ? 'Residential' : 'Commercial'}
                          </span>
                        </div>
                      </div>

                      <div className={`p-6 lg:p-8 ${viewMode === 'list' ? 'md:w-2/3 flex-1' : ''}`}>
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg lg:text-xl font-bold text-surface-900 dark:text-surface-100 line-clamp-2">
                            {property?.title || 'Untitled Property'}
                          </h3>
                        </div>

                        <div className="flex items-center text-surface-600 dark:text-surface-400 mb-4">
                          <ApperIcon name="MapPin" className="h-4 w-4 mr-2" />
                          <span className="text-sm">
                            {property?.address?.street || ''}, {property?.address?.city || ''}, {property?.address?.state || ''}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="text-2xl lg:text-3xl font-bold text-primary">
                            {formatPrice(property?.price)}
                            {property?.listingType === 'rent' && 
                              <span className="text-sm font-normal text-surface-500">/month</span>
                            }
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 lg:space-x-6 mb-6">
                          <div className="flex items-center text-surface-600 dark:text-surface-400">
                            <ApperIcon name="Bed" className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">{property?.bedrooms || 0} bed</span>
                          </div>
                          <div className="flex items-center text-surface-600 dark:text-surface-400">
                            <ApperIcon name="Bath" className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">{property?.bathrooms || 0} bath</span>
                          </div>
                          <div className="flex items-center text-surface-600 dark:text-surface-400">
                            <ApperIcon name="Maximize" className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">{property?.area?.toLocaleString() || 0} sqft</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <button className="flex items-center px-4 py-2 bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-xl transition-all duration-200">
                            <ApperIcon name="Heart" className="h-4 w-4 mr-2 text-surface-600 dark:text-surface-400" />
                            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Save</span>
                          </button>
<button 
                            onClick={() => handleViewDetails(property)}
                            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all duration-200 font-semibold"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          )}
</motion.div>
      </main>
      
      {/* Property Detail Modal */}
      <PropertyDetailModal 
        property={selectedProperty}
        isOpen={showModal}
        onClose={closeModal}
      />
    </div>
  )
}

export default Home