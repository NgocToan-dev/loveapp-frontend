import { createI18n } from 'vue-i18n'

// Vietnamese messages
const vi = {
  nav: {
    home: 'Trang chủ',
    memories: 'Kỷ niệm',
    messages: 'Tin nhắn',
    photos: 'Ảnh của chúng ta',
    about: 'Câu chuyện tình yêu',
    login: 'Đăng nhập',
    dashboard: 'Bảng điều khiển',
    files: 'Tệp tin',
    profile: 'Hồ sơ',
    logout: 'Đăng xuất'
  },
  home: {
    title: 'Chào mừng đến với LoveApp',
    subtitle: 'Không gian riêng tư cho tình yêu của chúng ta 💕',
    description: 'Một ứng dụng được tạo ra dành riêng cho hai chúng ta - nơi lưu giữ những kỷ niệm đẹp, chia sẻ cảm xúc và xây dựng tình yêu mỗi ngày.',
    cta: {
      start: 'Khám phá không gian của chúng ta',
      howItWorks: 'Tính năng'
    },
    features: {
      title: 'Được tạo ra chỉ dành cho chúng ta',
      subtitle: 'Một không gian riêng tư và ấm áp để nuôi dưỡng tình yêu',
      smartMatching: {
        title: 'Kỷ niệm chung',
        description: 'Lưu giữ và chia sẻ những khoảnh khắc đáng nhớ trong cuộc sống chung của chúng ta.'
      },
      safe: {
        title: 'Riêng tư & An toàn',
        description: 'Một không gian hoàn toàn riêng tư chỉ dành cho hai chúng ta, tuyệt đối an toàn và bảo mật.'
      },
      meaningful: {
        title: 'Kết nối sâu sắc',
        description: 'Chia sẻ cảm xúc, suy nghĩ và xây dựng mối liên kết mạnh mẽ hơn mỗi ngày.'
      },
      premium: {
        title: 'Trải nghiệm đặc biệt',
        description: 'Được thiết kế đặc biệt cho tình yêu của chúng ta với những tính năng độc đáo và ý nghĩa.'
      }
    },
    stats: {
      title: 'Hành trình tình yêu của chúng ta',
      subtitle: 'Những con số đáng nhớ',
      happyCouples: 'Ngày bên nhau',
      activeUsers: 'Tin nhắn đã chia sẻ',
      successRate: 'Kỷ niệm đã lưu',
      support: 'Tình yêu'
    },
    cta2: {
      title: 'Sẵn sàng bắt đầu?',
      subtitle: 'Hãy cùng nhau tạo ra những kỷ niệm đẹp và xây dựng tình yêu mỗi ngày',
      signUp: 'Bắt đầu ngay'
    }
  },
  about: {
    title: 'Câu chuyện tình yêu của chúng ta',
    subtitle: 'Nơi lưu giữ những khoảnh khắc đẹp nhất 💕',
    ourStory: {
      title: 'Câu chuyện của chúng ta',
      content: 'Đây là không gian riêng tư được tạo ra đặc biệt cho tình yêu của chúng ta. Nơi chúng ta có thể chia sẻ những khoảnh khắc đẹp, lưu giữ kỷ niệm và xây dựng tình yêu mỗi ngày.'
    },
    features: {
      title: 'Những tính năng đặc biệt',
      subtitle: 'Được thiết kế dành riêng cho chúng ta',
      memories: {
        title: 'Lưu giữ kỷ niệm',
        description: 'Lưu trữ những hình ảnh, video và ghi chú về những khoảnh khắc đẹp của chúng ta.'
      },
      messages: {
        title: 'Tin nhắn tình yêu',
        description: 'Gửi những lời nhắn ngọt ngào và chia sẻ cảm xúc mỗi ngày.'
      },
      timeline: {
        title: 'Dòng thời gian',
        description: 'Theo dõi hành trình tình yêu của chúng ta qua từng mốc thời gian.'
      },
      private: {
        title: 'Hoàn toàn riêng tư',
        description: 'Chỉ có chúng ta mới có thể truy cập và xem những nội dung này.'
      }
    },
    values: {
      title: 'Giá trị cốt lõi',
      subtitle: 'Những điều chúng ta tin tưởng',
      love: {
        title: 'Tình yêu chân thành',
        description: 'Tình yêu là nền tảng của mọi thứ chúng ta xây dựng.'
      },
      trust: {
        title: 'Tin tưởng tuyệt đối',
        description: 'Sự tin tưởng là chìa khóa cho một mối quan hệ bền vững.'
      },
      growth: {
        title: 'Cùng nhau phát triển',
        description: 'Chúng ta cùng nhau học hỏi và trưởng thành mỗi ngày.'
      },
      joy: {
        title: 'Niềm vui chia sẻ',
        description: 'Hạnh phúc được nhân đôi khi chúng ta chia sẻ với nhau.'
      }
    },
    contact: {
      title: 'Luôn kết nối',
      subtitle: 'Luôn sẵn sàng lắng nghe và chia sẻ với nhau',
      support: 'Gửi tin nhắn tình yêu',
      faq: 'Những câu hỏi dành cho nhau'
    }
  },
  files: {
    title: 'Quản lý tệp tin',
    subtitle: 'Lưu trữ và chia sẻ những kỷ niệm đẹp',
    upload: 'Tải lên',
    totalFiles: 'Tổng số tệp',
    images: 'Hình ảnh',
    videos: 'Video',
    audio: 'Âm thanh',
    documents: 'Tài liệu',
    totalSize: 'Dung lượng',
    search: 'Tìm kiếm tệp...',
    filterByType: 'Lọc theo loại',
    sortBy: 'Sắp xếp theo',
    allTypes: 'Tất cả loại',
    newestFirst: 'Mới nhất trước',
    oldestFirst: 'Cũ nhất trước',
    nameAZ: 'Tên A-Z',
    nameZA: 'Tên Z-A',
    largestFirst: 'Lớn nhất trước',
    smallestFirst: 'Nhỏ nhất trước',
    noFiles: 'Chưa có tệp nào',
    noFilesDescription: 'Hãy tải lên những kỷ niệm đẹp của chúng ta',
    uploadFirst: 'Tải lên tệp đầu tiên',
    loading: 'Đang tải...',
    uploadFiles: 'Tải lên tệp',
    dragAndDrop: 'Kéo và thả tệp vào đây',
    orClickToSelect: 'hoặc nhấp để chọn tệp',
    selectFiles: 'Chọn tệp',
    uploadProgress: 'Tiến trình tải lên',
    confirmDelete: 'Bạn có chắc muốn xóa "{name}"?'
  },
  memories: {
    title: 'Kỷ niệm của chúng ta',
    subtitle: 'Lưu giữ những khoảnh khắc đẹp nhất',
    create: 'Tạo kỷ niệm',
    totalMemories: 'Tổng kỷ niệm',
    daysTogether: 'Ngày bên nhau',
    photos: 'Hình ảnh',
    specialMoments: 'Khoảnh khắc đặc biệt',
    search: 'Tìm kiếm kỷ niệm...',
    category: 'Danh mục',
    sortBy: 'Sắp xếp theo',
    newestFirst: 'Mới nhất trước',
    oldestFirst: 'Cũ nhất trước',
    titleAZ: 'Tiêu đề A-Z',
    favorites: 'Yêu thích',
    noMemories: 'Chưa có kỷ niệm nào',
    noMemoriesDescription: 'Hãy tạo kỷ niệm đầu tiên của chúng ta',
    createFirst: 'Tạo kỷ niệm đầu tiên',
    loading: 'Đang tải...',
    editMemory: 'Chỉnh sửa kỷ niệm',
    createMemory: 'Tạo kỷ niệm mới',
    memoryTitle: 'Tiêu đề kỷ niệm',
    description: 'Mô tả',
    date: 'Ngày',
    markAsFavorite: 'Đánh dấu yêu thích',
    confirmDelete: 'Bạn có chắc muốn xóa kỷ niệm "{title}"?'
  },
  common: {
    comingSoon: 'Sắp ra mắt',
    learnMore: 'Tìm hiểu thêm',
    getStarted: 'Bắt đầu',
    contactUs: 'Liên hệ',
    copyright: '© {year} LoveApp - Không gian tình yêu riêng tư của chúng ta 💕',
    cancel: 'Hủy',
    save: 'Lưu',
    delete: 'Xóa',
    edit: 'Chỉnh sửa',
    view: 'Xem',
    download: 'Tải xuống',
    share: 'Chia sẻ'
  },
  theme: {
    toggleDark: 'Chuyển sang chế độ tối',
    toggleLight: 'Chuyển sang chế độ sáng'
  },
  auth: {
    login: {
      title: 'Đăng nhập',
      submit: 'Đăng nhập'
    },
    register: {
      title: 'Đăng ký',
      submit: 'Đăng ký'
    },
    email: 'Email',
    password: 'Mật khẩu',
    confirmPassword: 'Xác nhận mật khẩu',
    displayName: 'Tên hiển thị',
    rememberMe: 'Ghi nhớ đăng nhập',
    forgotPassword: 'Quên mật khẩu?',
    noAccount: 'Chưa có tài khoản?',
    hasAccount: 'Đã có tài khoản?',
    emailVerification: 'Xác thực email',
    resendVerification: 'Gửi lại email xác thực'
  },
  validation: {
    required: 'Trường này là bắt buộc',
    emailInvalid: 'Email không hợp lệ',
    passwordMinLength: 'Mật khẩu phải có ít nhất 6 ký tự',
    passwordMismatch: 'Mật khẩu không khớp'
  }
}

// English messages for comparison
const en = {
  nav: {
    home: 'Home',
    memories: 'Memories',
    messages: 'Messages',
    photos: 'Our Photos',
    about: 'Our Love Story',
    login: 'Login',
    dashboard: 'Dashboard',
    files: 'Files',
    profile: 'Profile',
    logout: 'Logout'
  },
  home: {
    title: 'Welcome to LoveApp',
    subtitle: 'Our Private Space for Love 💕',
    description: 'An app created exclusively for the two of us - where we preserve beautiful memories, share emotions, and build our love every day.',
    cta: {
      start: 'Explore Our Space',
      howItWorks: 'Features'
    },
    features: {
      title: 'Made Just for Us',
      subtitle: 'A private and warm space to nurture our love',
      smartMatching: {
        title: 'Shared Memories',
        description: 'Preserve and share the memorable moments in our life together.'
      },
      safe: {
        title: 'Private & Safe',
        description: 'A completely private space just for the two of us, absolutely safe and secure.'
      },
      meaningful: {
        title: 'Deep Connection',
        description: 'Share emotions, thoughts and build stronger bonds every day.'
      },
      premium: {
        title: 'Special Experience',
        description: 'Specially designed for our love with unique and meaningful features.'
      }
    },
    stats: {
      title: 'Our Love Journey',
      subtitle: 'Memorable numbers',
      happyCouples: 'Days Together',
      activeUsers: 'Messages Shared',
      successRate: 'Memories Saved',
      support: 'Love'
    },
    cta2: {
      title: 'Ready to Start?',
      subtitle: 'Let\'s create beautiful memories together and build our love every day',
      signUp: 'Start Now'
    }
  },
  about: {
    title: 'Our Love Story',
    subtitle: 'Where we keep our most beautiful moments 💕',
    ourStory: {
      title: 'Our Story',
      content: 'This is a private space created especially for our love. Where we can share beautiful moments, preserve memories and build our love every day.'
    },
    features: {
      title: 'Special Features',
      subtitle: 'Designed exclusively for us',
      memories: {
        title: 'Preserve Memories',
        description: 'Store photos, videos and notes about our beautiful moments.'
      },
      messages: {
        title: 'Love Messages',
        description: 'Send sweet messages and share emotions every day.'
      },
      timeline: {
        title: 'Timeline',
        description: 'Track our love journey through each milestone.'
      },
      private: {
        title: 'Completely Private',
        description: 'Only we can access and view this content.'
      }
    },
    values: {
      title: 'Core Values',
      subtitle: 'What we believe in',
      love: {
        title: 'True Love',
        description: 'Love is the foundation of everything we build.'
      },
      trust: {
        title: 'Absolute Trust',
        description: 'Trust is the key to a lasting relationship.'
      },
      growth: {
        title: 'Growing Together',
        description: 'We learn and grow together every day.'
      },
      joy: {
        title: 'Shared Joy',
        description: 'Happiness is doubled when we share it with each other.'
      }
    },
    contact: {
      title: 'Stay Connected',
      subtitle: 'Always ready to listen and share with each other',
      support: 'Send Love Messages',
      faq: 'Questions for Each Other'
    }
  },
  files: {
    title: 'File Management',
    subtitle: 'Store and share beautiful memories',
    upload: 'Upload',
    totalFiles: 'Total Files',
    images: 'Images',
    videos: 'Videos',
    audio: 'Audio',
    documents: 'Documents',
    totalSize: 'Total Size',
    search: 'Search files...',
    filterByType: 'Filter by type',
    sortBy: 'Sort by',
    allTypes: 'All types',
    newestFirst: 'Newest first',
    oldestFirst: 'Oldest first',
    nameAZ: 'Name A-Z',
    nameZA: 'Name Z-A',
    largestFirst: 'Largest first',
    smallestFirst: 'Smallest first',
    noFiles: 'No files yet',
    noFilesDescription: 'Upload our beautiful memories',
    uploadFirst: 'Upload first file',
    loading: 'Loading...',
    uploadFiles: 'Upload Files',
    dragAndDrop: 'Drag and drop files here',
    orClickToSelect: 'or click to select files',
    selectFiles: 'Select Files',
    uploadProgress: 'Upload Progress',
    confirmDelete: 'Are you sure you want to delete "{name}"?'
  },
      memories: {
      title: 'Our Memories',
      subtitle: 'Preserving our most beautiful moments',
      create: 'Create Memory',
      totalMemories: 'Total Memories',
      daysTogether: 'Days Together',
      photos: 'Photos',
      specialMoments: 'Special Moments',
      search: 'Search memories...',
      category: 'Category',
      sortBy: 'Sort by',
      newestFirst: 'Newest first',
      oldestFirst: 'Oldest first',
      titleAZ: 'Title A-Z',
      favorites: 'Favorites',
      noMemories: 'No memories yet',
      noMemoriesDescription: 'Create our first memory together',
      createFirst: 'Create first memory',
      loading: 'Loading...',
      editMemory: 'Edit Memory',
      createMemory: 'Create New Memory',
      memoryTitle: 'Memory Title',
      description: 'Description',
      date: 'Date',
      markAsFavorite: 'Mark as favorite',
      confirmDelete: 'Are you sure you want to delete memory "{title}"?'
    },
    common: {
      comingSoon: 'Coming Soon',
    learnMore: 'Learn More',
    getStarted: 'Get Started',
    contactUs: 'Contact Us',
    copyright: '© {year} LoveApp - Our Private Love Space 💕',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    download: 'Download',
    share: 'Share'
  },
  theme: {
    toggleDark: 'Switch to dark mode',
    toggleLight: 'Switch to light mode'
  },
  auth: {
    login: {
      title: 'Login',
      submit: 'Login'
    },
    register: {
      title: 'Register',
      submit: 'Register'
    },
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    displayName: 'Display Name',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    emailVerification: 'Email Verification',
    resendVerification: 'Resend verification email'
  },
  validation: {
    required: 'This field is required',
    emailInvalid: 'Invalid email format',
    passwordMinLength: 'Password must be at least 6 characters',
    passwordMismatch: 'Passwords do not match'
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'vi', // Default to Vietnamese
  fallbackLocale: 'en',
  messages: {
    vi,
    en
  }
})

export default i18n