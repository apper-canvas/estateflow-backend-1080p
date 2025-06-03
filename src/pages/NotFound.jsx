import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-blue-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900 flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-8"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <ApperIcon name="Home" className="h-24 w-24 text-primary mx-auto mb-4" />
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-surface-100 mb-4">
          Property Not Found
        </h2>
        <p className="text-surface-600 dark:text-surface-400 mb-8 text-lg">
          Looks like this property has been sold or moved to a new location.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="ArrowLeft" className="h-5 w-5 mr-2" />
          Back to Properties
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound