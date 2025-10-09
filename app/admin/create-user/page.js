'use client'

import { useState } from 'react'
import { User, Mail, Lock, Building, Calendar, Phone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function CreateUserPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    dept: '',
    year: '',
    contact_number: '',
    role: 'user',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Failed to create user')
      }

      setMessage(`User created successfully! ID: ${result.user_id}`)
      setMessageType('success')

      // Reset form
      setFormData({
        email: '',
        password: '',
        full_name: '',
        dept: '',
        year: '',
        contact_number: '',
        role: 'user'
      })
    } catch (err) {
      setMessage(err.message)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const InputField = ({ icon: Icon, type, name, placeholder, required = false, value, onChange }) => (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white
                   transition-all duration-200 hover:bg-white hover:border-gray-300"
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New User</h1>
          <p className="text-gray-600">Add a new member to your organization</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-px bg-gradient-to-r from-gray-200 to-transparent flex-1"></div>
                <span className="text-sm font-medium text-gray-500 bg-white px-3">Personal Details</span>
                <div className="h-px bg-gradient-to-l from-gray-200 to-transparent flex-1"></div>
              </div>
              
              <InputField
                icon={User}
                type="text"
                name="full_name"
                placeholder="Full Name"
                required={true}
                value={formData.full_name}
                onChange={handleChange}
              />
              
              <InputField
                icon={Mail}
                type="email"
                name="email"
                placeholder="Email Address"
                required={true}
                value={formData.email}
                onChange={handleChange}
              />
              
              <InputField
                icon={Lock}
                type="password"
                name="password"
                placeholder="Password"
                required={true}
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Academic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-px bg-gradient-to-r from-gray-200 to-transparent flex-1"></div>
                <span className="text-sm font-medium text-gray-500 bg-white px-3">Academic Info</span>
                <div className="h-px bg-gradient-to-l from-gray-200 to-transparent flex-1"></div>
              </div>
              
              <InputField
                icon={Building}
                type="text"
                name="dept"
                placeholder="Department"
                value={formData.dept}
                onChange={handleChange}
              />
              
              <InputField
                icon={Calendar}
                type="text"
                name="year"
                placeholder="Academic Year"
                value={formData.year}
                onChange={handleChange}
              />
              
              <InputField
                icon={Phone}
                type="tel"
                name="contact_number"
                placeholder="Phone Number"
                value={formData.contact_number}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                         text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl
                         transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed 
                         disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating User...</span>
                </>
              ) : (
                <>
                  <User className="h-5 w-5" />
                  <span>Create User</span>
                </>
              )}
            </button>
          </form>

          {/* Message Display */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl border ${
              messageType === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            } flex items-start space-x-3`}>
              {messageType === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="text-sm font-medium">{message}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help? <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  )
}