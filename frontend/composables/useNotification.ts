export type NotificationType = 'success' | 'error' | 'info'

interface Notification {
  id: string
  message: string
  type: NotificationType
  duration?: number
}

export const useNotification = () => {
  const notifications = useState<Notification[]>('notifications', () => [])
  const show = (message: string, type: NotificationType = 'success', duration: number = 5000) => {
    const id = Date.now().toString()
    notifications.value.push({
      id,
      message,
      type,
      duration,
    })

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  const remove = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clear = () => {
    notifications.value = []
  }

  return {
    notifications: readonly(notifications),
    show,
    remove,
    clear,
  }
}

