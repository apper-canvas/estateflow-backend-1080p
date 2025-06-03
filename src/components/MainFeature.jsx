import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import propertyService from '../services/api/propertyService'
import inquiryService from '../services/api/inquiryService'

const MainFeature = ({ properties = [] }) => {
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showListingForm, setShowListingForm] = useState(false)
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [listingForm, setListingForm] = useState({
    title: '',
    type: 'residential',
    listingType: 'sale',
    price: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
    amenities: []
  })
  const [loading, setLoading] = useState(false)
  const [mapView, setMapView] = useState(false)

  const popularAmenities = [
    'Swimming Pool', 'Gym', 'Parking', 'Balcony', 'Garden', 'Fireplace',
    'Air Conditioning', 'Dishwasher', 'Laundry', 'Security System'
  ]

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price || 0)
  }

  const handlePropertySelect = (property) => {
    setSelectedProperty(property)
    setShowModal(true)
  }

  const handleInquirySubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const inquiryData = {
        ...inquiryForm,
        propertyId: selectedProperty?.id,
        timestamp: new Date().toISOString()
      }

      await inquiryService.create(inquiryData)
      toast.success("Inquiry sent successfully! The agent will contact you soon.")
      setInquiryForm({ name: '', email: '', phone: '', message: '' })
      setShowModal(false)
    } catch (error) {
      toast.error("Failed to send inquiry. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleListingSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const propertyData = {
        ...listingForm,
        price: parseFloat(listingForm.price),
        bedrooms: parseInt(listingForm.bedrooms),
        bathrooms: parseInt(listingForm.bathrooms),
        area: parseInt(listingForm.area),
        coordinates: {
          lat: 40.7128 + (Math.random() - 0.5) * 0.1,
          lng: -74.0060 + (Math.random() - 0.5) * 0.1
        },
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
        ],
        agentId: 'agent-1'
      }

      await propertyService.create(propertyData)
      toast.success("Property listing created successfully!")
      setListingForm({
        title: '',
        type: 'residential',
        listingType: 'sale',
        price: '',
        address: { street: '', city: '', state: '', zipCode: '' },
        bedrooms: '',
        bathrooms: '',
        area: '',
        description: '',
        amenities: []
      })
      setShowListingForm(false)
    } catch (error) {
      toast.error("Failed to create listing. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleAmenity = (amenity) => {
    setListingForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const featuredProperties = properties.slice(0, 3)

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Hero Section with Featured Properties */}
      <motion.section
        className="relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 lg:p-12 text-white relative">
          <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <motion.h2
                  className="text-3xl lg:text-5xl font-bold mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  Find Your Perfect Home
                </motion.h2>
                <motion.p
                  className="text-lg lg:text-xl text-blue-100 mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Discover thousands of properties from trusted agents and owners. 
                  Your dream home is just a click away.
                </motion.p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    onClick={() => setShowListingForm(true)}
                    className="flex items-center justify-center px-8 py-4 bg-white text-primary hover:bg-blue-50 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
                    List Property
                  </motion.button>
                  <motion.button
                    onClick={() => setMapView(!mapView)}
                    className="flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-xl font-semibold transition-all duration-200 border border-white/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ApperIcon name="Map" className="h-5 w-5 mr-2" />
                    {mapView ? 'Hide Map' : 'View Map'}
                  </motion.button>
                </div>
              </div>

              {/* Quick Stats */}
              <motion.div
                className="grid grid-cols-2 gap-4 lg:gap-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30">
                  <div className="text-3xl lg:text-4xl font-bold mb-2">{properties.length}</div>
                  <div className="text-blue-100">Properties</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30">
                  <div className="text-3xl lg:text-4xl font-bold mb-2">
                    {properties.filter(p => p?.listingType === 'sale').length}
                  </div>
                  <div className="text-blue-100">For Sale</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30">
                  <div className="text-3xl lg:text-4xl font-bold mb-2">
                    {properties.filter(p => p?.listingType === 'rent').length}
                  </div>
                  <div className="text-blue-100">For Rent</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30">
                  <div className="text-3xl lg:text-4xl font-bold mb-2">
                    {properties.filter(p => p?.type === 'commercial').length}
                  </div>
                  <div className="text-blue-100">Commercial</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Map View */}
      <AnimatePresence>
        {mapView && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-surface-800 rounded-3xl shadow-property p-6 lg:p-8 border border-surface-200/50 dark:border-surface-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl lg:text-2xl font-bold text-surface-900 dark:text-surface-100">
                  Property Locations
                </h3>
                <button
                  onClick={() => setMapView(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="h-5 w-5 text-surface-500" />
                </button>
              </div>
              
              {/* Mock Map */}
              <div className="relative h-64 lg:h-96 bg-gradient-to-br from-blue-100 to-green-100 dark:from-surface-700 dark:to-surface-600 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <ApperIcon name="MapPin" className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="text-surface-600 dark:text-surface-400 text-lg">
                      Interactive Map Coming Soon
                    </p>
                    <p className="text-surface-500 dark:text-surface-500 text-sm mt-2">
                      {properties.length} properties plotted across the city
                    </p>
                  </div>
                </div>
                
                {/* Mock Property Markers */}
                {featuredProperties.map((property, index) => (
                  <motion.div
                    key={property?.id || index}
                    className="absolute bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform"
                    style={{
                      left: `${20 + (index * 25)}%`,
                      top: `${30 + (index * 15)}%`
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    onClick={() => handlePropertySelect(property)}
                    whileHover={{ scale: 1.2 }}
                  >
                    {index + 1}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-surface-100">
              Featured Properties
            </h3>
            <ApperIcon name="Star" className="h-6 w-6 text-secondary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property?.id || index}
                className="property-card-hover bg-white dark:bg-surface-800 rounded-3xl shadow-property overflow-hidden border border-surface-200/50 dark:border-surface-700/50 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => handlePropertySelect(property)}
                whileHover={{ y: -5 }}
              >
                <div className="relative">
                  <img
                    src={property?.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'}
                    alt={property?.title || 'Property'}
                    className="w-full h-48 lg:h-56 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-secondary text-white rounded-full text-xs font-semibold">
                      Featured
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      property?.listingType === 'sale' 
                        ? 'bg-accent text-white' 
                        : 'bg-secondary text-white'
                    }`}>
                      For {property?.listingType === 'sale' ? 'Sale' : 'Rent'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2 line-clamp-2">
                    {property?.title || 'Untitled Property'}
                  </h4>
                  
                  <div className="flex items-center text-surface-600 dark:text-surface-400 mb-4">
                    <ApperIcon name="MapPin" className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {property?.address?.city || ''}, {property?.address?.state || ''}
                    </span>
                  </div>

                  <div className="text-2xl font-bold text-primary mb-4">
                    {formatPrice(property?.price)}
                    {property?.listingType === 'rent' && 
                      <span className="text-sm font-normal text-surface-500">/month</span>
                    }
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-surface-600 dark:text-surface-400">
                        <ApperIcon name="Bed" className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property?.bedrooms || 0}</span>
                      </div>
                      <div className="flex items-center text-surface-600 dark:text-surface-400">
                        <ApperIcon name="Bath" className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property?.bathrooms || 0}</span>
                      </div>
                    </div>
                    <ApperIcon name="ArrowRight" className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Property Detail Modal */}
      <AnimatePresence>
        {showModal && selectedProperty && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-surface-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedProperty?.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'}
                  alt={selectedProperty?.title || 'Property'}
                  className="w-full h-64 lg:h-80 object-cover rounded-t-3xl"
                />
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                >
                  <ApperIcon name="X" className="h-5 w-5 text-surface-900" />
                </button>
              </div>

              <div className="p-6 lg:p-8">
                <h3 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-4">
                  {selectedProperty?.title || 'Untitled Property'}
                </h3>

                <div className="flex items-center text-surface-600 dark:text-surface-400 mb-6">
                  <ApperIcon name="MapPin" className="h-5 w-5 mr-2" />
                  <span>
                    {selectedProperty?.address?.street || ''}, {selectedProperty?.address?.city || ''}, {selectedProperty?.address?.state || ''}
                  </span>
                </div>

                <div className="text-3xl font-bold text-primary mb-6">
                  {formatPrice(selectedProperty?.price)}
                  {selectedProperty?.listingType === 'rent' && 
                    <span className="text-sm font-normal text-surface-500">/month</span>
                  }
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
                    <ApperIcon name="Bed" className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-surface-900 dark:text-surface-100">{selectedProperty?.bedrooms || 0}</div>
                    <div className="text-sm text-surface-600 dark:text-surface-400">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
                    <ApperIcon name="Bath" className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-surface-900 dark:text-surface-100">{selectedProperty?.bathrooms || 0}</div>
                    <div className="text-sm text-surface-600 dark:text-surface-400">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
                    <ApperIcon name="Maximize" className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-surface-900 dark:text-surface-100">{selectedProperty?.area?.toLocaleString() || 0}</div>
                    <div className="text-sm text-surface-600 dark:text-surface-400">Sq Ft</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-3">Description</h4>
                  <p className="text-surface-600 dark:text-surface-400 leading-relaxed">
                    {selectedProperty?.description || 'No description available.'}
                  </p>
                </div>

                {selectedProperty?.amenities && selectedProperty.amenities.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-3">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProperty.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Form */}
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                    Contact Agent
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100"
                    />
                  </div>
                  
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100"
                  />
                  
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm(prev => ({ ...prev, message: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100 resize-none"
                  />
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-primary hover:bg-primary-dark disabled:bg-surface-400 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <ApperIcon name="Send" className="h-5 w-5 mr-2" />
                    )}
                    {loading ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Listing Form Modal */}
      <AnimatePresence>
        {showListingForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowListingForm(false)}
          >
            <motion.div
              className="bg-white dark:bg-surface-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 p-6 lg:p-8 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-surface-100">
                    Create New Listing
                  </h3>
                  <button
                    onClick={() => setShowListingForm(false)}
                    className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full transition-colors"
                  >
                    <ApperIcon name="X" className="h-6 w-6 text-surface-500" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleListingSubmit} className="p-6 lg:p-8 space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Property Title"
                      value={listingForm.title}
                      onChange={(e) => setListingForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100"
                    />
                    <select
                      value={listingForm.type}
                      onChange={(e) => setListingForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100"
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                    </select>
                    <select
                      value={listingForm.listingType}
                      onChange={(e) => setListingForm(prev => ({ ...prev, listingType: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100"
                    >
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Price"
                      value={listingForm.price}
                      onChange={(e) => setListingForm(prev => ({ ...prev, price: e.target.value }))}
                      required
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                    Address
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={listingForm.address.street}
                      onChange={(e) => setListingForm(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, street: e.target.value }
                      }))}
                      required
                      className="md:col-span-2 w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={listingForm.address.city}
                      onChange={(e) => setListingForm(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, city: e.target.value }
                      }))}
                      required
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={listingForm.address.state}
                      onChange={(e) => setListingForm(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, state: e.target.value }
                      }))}
                      required
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100"
                    />
                  </div>
                </div>

                {/* Property Details */}
                <div>
                  <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                    Property Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="number"
                      placeholder="Bedrooms"
                      value={listingForm.bedrooms}
                      onChange={(e) => setListingForm(prev => ({ ...prev, bedrooms: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100"
                    />
                    <input
                      type="number"
                      placeholder="Bathrooms"
                      value={listingForm.bathrooms}
                      onChange={(e) => setListingForm(prev => ({ ...prev, bathrooms: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100"
                    />
                    <input
                      type="number"
                      placeholder="Area (sqft)"
                      value={listingForm.area}
                      onChange={(e) => setListingForm(prev => ({ ...prev, area: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                    Description
                  </h4>
                  <textarea
                    placeholder="Describe your property..."
                    rows={4}
                    value={listingForm.description}
                    onChange={(e) => setListingForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl focus:border-primary dark:focus:border-primary text-surface-900 dark:text-surface-100 resize-none"
                  />
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
                    Amenities
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {popularAmenities.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          listingForm.amenities.includes(amenity)
                            ? 'bg-primary text-white'
                            : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-surface-200 dark:border-surface-700">
                  <button
                    type="button"
                    onClick={() => setShowListingForm(false)}
                    className="px-6 py-3 bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300 rounded-xl font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-primary hover:bg-primary-dark disabled:bg-surface-400 text-white rounded-xl font-semibold transition-all duration-200 flex items-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
                    )}
                    {loading ? 'Creating...' : 'Create Listing'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature