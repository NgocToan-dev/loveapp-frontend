export default {
  title: 'Important Reminders',
  subtitle: 'Never forget special dates',
  description: 'Manage and track important events in your relationship',
  
  create: {
    title: 'Create New Reminder',
    button: 'Add Reminder'
  },

  edit: {
    title: 'Edit reminder'
  },

  form: {
    title: 'Reminder Title',
    title_placeholder: 'Enter reminder title...',
    description: 'Description',
    description_placeholder: 'Add detailed description...',
    date: 'Date',
    time: 'Time',
    type: 'Reminder type',
    is_recurring: 'Recurring reminder',
    recurring_type: 'Recurring pattern',
    dateTime: 'Date & Time',
    repeat: 'Repeat',
    priority: 'Priority',
    category: 'Category',
    notification: 'Notification'
  },

  types: {
    anniversary: 'Anniversary',
    birthday: 'Birthday',
    date: 'Date',
    custom: 'Custom'
  },

  recurring: {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly'
  },

  repeat: {
    none: 'No repeat',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    custom: 'Custom'
  },

  priority: {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent'
  },

  categories: {
    anniversary: 'Anniversary',
    birthday: 'Birthday',
    date: 'Date',
    gift: 'Gift',
    travel: 'Travel',
    health: 'Health',
    work: 'Work',
    other: 'Other'
  },

  status: {
    upcoming: 'Upcoming',
    today: 'Today',
    overdue: 'Overdue',
    completed: 'Completed'
  },

  stats: {
    total: 'Total',
    completed: 'Completed',
    upcoming: 'Upcoming',
    overdue: 'Overdue'
  },

  filter: {
    all: 'All',
    active: 'Active',
    completed: 'Completed',
    overdue: 'Overdue',
    upcoming: 'Upcoming',
    type: 'Type'
  },

  sections: {
    overdue: 'Overdue',
    upcoming: 'Upcoming',
    all: 'All reminders'
  },

  no_connection_title: 'Connect with your partner',
  no_connection_message: 'You need to connect with your partner to create shared reminders.',
  no_reminders_title: 'No reminders yet',
  no_reminders_message: 'Create your first reminder to never miss special moments!',
  create_first: 'Create first reminder',
  
  search_placeholder: 'Search reminders...',
  
  overdue_section: 'Overdue reminders',
  upcoming_section: 'Upcoming reminders',
  all_section: 'All reminders',

  mark_complete: 'Mark as complete',
  mark_incomplete: 'Mark as incomplete',
  snooze: 'Snooze',
  snooze_reminder: 'Snooze reminder',
  snooze_description: 'Choose when to be reminded again:',
  custom_snooze: 'Custom time',
  snooze_until_date: 'Snooze until date',
  snooze_until_time: 'Snooze until time',

  snooze_options: {
    '15_minutes': '15 minutes',
    '1_hour': '1 hour',
    '4_hours': '4 hours',
    '1_day': '1 day'
  },

  created_by: 'Created by',
  
  confirm_delete: 'Confirm delete',
  delete_warning: 'Are you sure you want to delete this reminder?',

  validation: {
    date_future: 'Date must be in the future'
  },

  errors: {
    fetch_failed: 'Failed to load reminders',
    fetch_single_failed: 'Failed to load reminder details',
    create_failed: 'Failed to create reminder',
    update_failed: 'Failed to update reminder',
    delete_failed: 'Failed to delete reminder',
    complete_failed: 'Failed to mark as complete',
    incomplete_failed: 'Failed to mark as incomplete',
    fetch_upcoming_failed: 'Failed to load upcoming reminders',
    fetch_overdue_failed: 'Failed to load overdue reminders',
    fetch_by_type_failed: 'Failed to load reminders by type',
    search_failed: 'Failed to search reminders',
    snooze_failed: 'Failed to snooze reminder'
  },

  actions: {
    complete: 'Complete',
    snooze: 'Snooze',
    edit: 'Edit',
    delete: 'Delete'
  }
}
