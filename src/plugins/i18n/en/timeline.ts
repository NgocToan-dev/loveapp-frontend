export default {
  title: 'Our Timeline',
  description: 'Rediscover the most beautiful moments in your love journey',
  filters: {
    all: 'All',
    memories: 'Memories',
    reminders: 'Reminders',
    blog: 'Blog',
    anniversaries: 'Anniversaries'
  },
  sortDesc: 'Newest first',
  sortAsc: 'Oldest first',
  empty: {
    title: 'No timeline items yet',
    description: 'Start creating beautiful memories, loving reminders and share your stories!',
    createMemory: 'Create memory',
    createReminder: 'Create reminder',
    createBlog: 'Write blog'
  },
  types: {
    memory: 'Memory',
    reminder: 'Reminder',
    blog: 'Blog',
    anniversary: 'Anniversary'
  },
  anniversary: {
    title: 'Love Anniversary',
    description: 'Another year together, love forever!'
  },
  today: 'Today',
  daysLeft: 'days left',
  imagePreview: 'View image',
  loadMore: 'Load more',
  actions: {
    view: 'View details',
    edit: 'Edit',
    delete: 'Delete'
  },
  errors: {
    fetchFailed: 'Failed to load timeline. Please try again later.',
    loadMoreFailed: 'Failed to load more data.'
  }
}
