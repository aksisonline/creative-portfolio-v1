/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          message: formData.get('message'),
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')
      
      setSubmitted(true)
      form.reset()
    } catch (error) {
      console.error('Submission error:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        {submitted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4"
          >
            <h2 className="text-2xl font-bold">Thank You!</h2>
            <p className="text-black/60">
              You can also reach me directly at{" "}
              <a href="mailto:hello@aksisonline.com" className="text-black underline">
                hello@aksisonline.com
              </a>
            </p>
          </motion.div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-12">Let&apos;s work together</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
              <motion.div className="space-y-2">
                <label className="text-xs tracking-wider text-black/40">NAME</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full bg-transparent border-b border-black/20 pb-2 focus:border-black outline-none transition-colors"
                />
              </motion.div>
              <motion.div className="space-y-2">
                <label className="text-xs tracking-wider text-black/40">PHONE NUMBER</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  className="w-full bg-transparent border-b border-black/20 pb-2 focus:border-black outline-none transition-colors"
                />
              </motion.div>
              <motion.div className="space-y-2">
                <label className="text-xs tracking-wider text-black/40">EMAIL</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-transparent border-b border-black/20 pb-2 focus:border-black outline-none transition-colors"
                />
              </motion.div>
              <motion.div className="space-y-2">
                <label className="text-xs tracking-wider text-black/40">MESSAGE</label>
                <textarea
                  name="message"
                  required
                  className="w-full bg-transparent border-b border-black/20 pb-2 focus:border-black outline-none transition-colors h-32"
                />
              </motion.div>
              <motion.button
                type="submit"
                className="w-full bg-black text-white py-4 text-sm tracking-widest hover:bg-black/90 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
              </motion.button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}

