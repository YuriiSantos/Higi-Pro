// Notification.js
import React, { useEffect } from 'react'

const Notification = ({ message, onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose()
            }, 3000) // A notificação ficará visível por 3 segundos

            return () => clearTimeout(timer)
        }
    }, [message, onClose])

    return (
        message && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
                {message}
            </div>
        )
    )
}

export default Notification
