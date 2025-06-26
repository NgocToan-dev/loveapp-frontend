// TypeScript declarations for vue-i18n
export interface LocaleMessage {
  common: {
    buttons: {
      save: string
      cancel: string
      delete: string
      edit: string
      create: string
      publish: string
      close: string
      confirm: string
      back: string
      next: string
      submit: string
      upload: string
    }
    status: {
      loading: string
      saving: string
      success: string
      error: string
      noData: string
      empty: string
    }
    validation: {
      required: string
      email: string
      minLength: string
      maxLength: string
      passwordMatch: string
    }
  }
  navigation: {
    home: string
    blog: string
    memories: string
    reminders: string
    timeline: string
    profile: string
    settings: string
  }
  home: {
    title: string
    subtitle: string
    welcome: string
    connectionPrompt: string
    sendInvitation: string
    exploreFeatures: string
    startJourney: string
    viewBlog: string
    dashboard: {
      title: string
      subtitle: string
    }
    stats: {
      memories: string
      days: string
      daysTogetherLabel: string
      photos: string
      posts: string
      blogPosts: string
      reminders: string
    }
    recentMemories: {
      title: string
      viewAll: string
    }
    quickActions: {
      title: string
      subtitle: string
      addMemory: string
      addMemoryDesc: string
      writeBlog: string
      writeBlogDesc: string
      setReminder: string
      setReminderDesc: string
    }
    upcomingReminders: {
      title: string
      viewAll: string
    }
    connectModal: {
      title: string
      description: string
      emailLabel: string
      emailPlaceholder: string
      messageLabel: string
      messagePlaceholder: string
      sendInvite: string
      inviteSent: string
      inviteError: string
    }
    empty: {
      memories: string
      reminders: string
      photos: string
    }
    actions: {
      viewDetails: string
      addToFavorites: string
      removeFromFavorites: string
      share: string
      edit: string
      delete: string
    }
    quote: string
  }
  blog: {
    title: string
    subtitle: string
    createPost: string
    noPosts: string
    firstPost: string
    editor: {
      title: string
      editTitle: string
      toolbar: {
        bold: string
        italic: string
        underline: string
        link: string
        image: string
        quote: string
        list: string
        heading: string
      }
    }
    form: {
      title: string
      content: string
      coverImage: string
      tags: string
      category: string
      draft: string
      published: string
    }
    categories: {
      love: string
      life: string
      travel: string
      food: string
      memories: string
      thoughts: string
    }
    actions: {
      read: string
      edit: string
      delete: string
      share: string
      like: string
      comment: string
    }
  }
  memories: {
    title: string
    subtitle: string
    create: {
      title: string
      button: string
    }
    form: {
      title: string
      description: string
      date: string
      location: string
      photos: string
      mood: string
      weather: string
      tags: string
    }
    moods: {
      happy: string
      romantic: string
      excited: string
      peaceful: string
      nostalgic: string
      grateful: string
    }
    weather: {
      sunny: string
      cloudy: string
      rainy: string
      snowy: string
      windy: string
    }
    timeline: {
      title: string
      filter: string
      sortBy: string
      newest: string
      oldest: string
      mostLiked: string
    }
    actions: {
      view: string
      edit: string
      delete: string
      favorite: string
      share: string
    }
  }
  reminders: {
    title: string
    subtitle: string
    create: {
      title: string
      button: string
    }
    form: {
      title: string
      description: string
      dateTime: string
      repeat: string
      priority: string
      category: string
      notification: string
    }
    repeat: {
      none: string
      daily: string
      weekly: string
      monthly: string
      yearly: string
      custom: string
    }
    priority: {
      low: string
      medium: string
      high: string
      urgent: string
    }
    categories: {
      anniversary: string
      birthday: string
      date: string
      gift: string
      travel: string
      health: string
      work: string
      other: string
    }
    status: {
      upcoming: string
      today: string
      overdue: string
      completed: string
    }
    actions: {
      complete: string
      snooze: string
      edit: string
      delete: string
    }
  }
}

declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends LocaleMessage {}
}
