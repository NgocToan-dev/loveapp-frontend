import { ref, computed } from 'vue'
import { useAuth } from './useAuth'
import { useMemories } from './useMemories'
import { useReminders } from './useReminders'
import { useCouple } from './useCouple'
import { getDaysBetween } from '@/utils/helpers'

export const useStatistics = () => {
  const { user } = useAuth()
  const memoriesStore = useMemories()
  const remindersStore = useReminders()
  const { coupleConnection } = useCouple()

  // Computed statistics
  const memoriesCount = computed(() => memoriesStore.memories.value.length)
  
  const remindersCount = computed(() => remindersStore.reminders.length)
  
  const pendingRemindersCount = computed(() => 
    remindersStore.reminders.filter((r: any) => r.isCompleted === false).length
  )
  
  const completedRemindersCount = computed(() => 
    remindersStore.reminders.filter((r: any) => r.isCompleted === true).length
  )
  
  const daysTogethger = computed(() => {
    if (!coupleConnection.value?.relationshipStart) return 0
    return getDaysBetween(new Date(coupleConnection.value.relationshipStart), new Date())
  })
  
  const upcomingReminders = computed(() => {
    const today = new Date()
    const upcoming = remindersStore.reminders.filter((r: any) => {
      const reminderDate = new Date(r.reminderDate)
      const diffTime = reminderDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays >= 0 && diffDays <= 7 && !r.isCompleted
    })
    return upcoming.sort((a: any, b: any) => new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime())
  })
  
  const thisMonthMemories = computed(() => {
    const today = new Date()
    const thisMonth = today.getMonth()
    const thisYear = today.getFullYear()
    
    return memoriesStore.memories.value.filter((m: any) => {
      const memoryDate = new Date(m.createdAt)
      return memoryDate.getMonth() === thisMonth && memoryDate.getFullYear() === thisYear
    }).length
  })
  
  const recentActivity = computed(() => {
    const activities: Array<{
      id: string
      type: 'memory' | 'reminder'
      title: string
      date: string
      description?: string
    }> = []
    // Add recent memories
    memoriesStore.memories.value
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .forEach((memory: any) => {
        activities.push({
          id: memory.id,
          type: 'memory',
          title: memory.title,
          date: memory.createdAt,
          description: memory.content
        })
      })
    
    // Add recent reminders
    remindersStore.reminders
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .forEach((reminder: any) => {
        activities.push({
          id: reminder.id,
          type: 'reminder',
          title: reminder.title,
          date: reminder.createdAt,
          description: reminder.description
        })
      })
    
    // Sort by date and return top 5
    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  })

  // Greeting based on time
  const greeting = computed(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'morning'
    if (hour < 17) return 'afternoon'
    if (hour < 21) return 'evening'
    return 'night'
  })

  return {
    memoriesCount,
    remindersCount,
    pendingRemindersCount,
    completedRemindersCount,
    daysTogethger,
    upcomingReminders,
    thisMonthMemories,
    recentActivity,
    greeting
  }
}
