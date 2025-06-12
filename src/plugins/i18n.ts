import { createI18n } from 'vue-i18n'

// Vietnamese messages
const vi = {
  nav: {
    home: 'Trang chủ',
    memories: 'Kỷ niệm',
    messages: 'Tin nhắn',
    photos: 'Ảnh của chúng ta',
    about: 'Câu chuyện tình yêu',
    login: 'Đăng nhập'
  },
  home: {
    title: 'Chào mừng đến với LoveApp',
    subtitle: 'Không gian riêng cho tình yêu của chúng ta 💕',
    description: 'Ứng dụng được tạo ra dành riêng cho hai chúng ta - nơi lưu giữ những kỷ niệm đẹp, chia sẻ cảm xúc và xây dựng tình yêu mỗi ngày.',
    cta: {
      start: 'Khám phá không gian của chúng ta',
      howItWorks: 'Tính năng'
    },
    features: {
      title: 'Dành riêng cho chúng ta',
      subtitle: 'Một không gian riêng tư và ấm áp để nuôi dưỡng tình yêu của đôi ta',
      smartMatching: {
        title: 'Kỷ niệm chung',
        description: 'Lưu giữ và chia sẻ những khoảnh khắc đáng nhớ trong cuộc sống của đôi ta.'
      },
      safe: {
        title: 'Riêng tư & An toàn',
        description: 'Không gian hoàn toàn riêng tư chỉ dành cho hai chúng ta, an toàn và bảo mật tuyệt đối.'
      },
      meaningful: {
        title: 'Kết nối sâu sắc',
        description: 'Chia sẻ cảm xúc, suy nghĩ và xây dựng mối liên kết mạnh mẽ hơn mỗi ngày.'
      },
      premium: {
        title: 'Trải nghiệm đặc biệt',
        description: 'Được thiết kế đặc biệt cho tình yêu của đôi ta với những tính năng độc đáo và ý nghĩa.'
      }
    },
    stats: {
      title: 'Hành trình tình yêu của chúng ta',
      subtitle: 'Những con số đáng nhớ',
      happyCouples: 'Ngày bên nhau',
      activeUsers: 'Tin nhắn gửi nhau',
      successRate: 'Kỷ niệm lưu giữ',
      support: 'Yêu thương'
    },
    cta2: {
      title: 'Sẵn sàng bắt đầu?',
      subtitle: 'Hãy cùng nhau tạo nên những kỷ niệm đẹp và xây dựng tình yêu mỗi ngày',
      signUp: 'Bắt đầu ngay'
    }
  },
  about: {
    title: 'Câu chuyện tình yêu của chúng ta',
    subtitle: 'Nơi lưu giữ những kỷ niệm đẹp và xây dựng tình yêu mỗi ngày',
    story: {
      title: 'Hành trình của đôi ta',
      content1: 'LoveApp được tạo ra như một món quà đặc biệt dành riêng cho tình yêu của chúng ta. Đây không phải là một ứng dụng hẹn hò thông thường, mà là không gian riêng tư nơi chỉ có hai chúng ta.',
      content2: 'Mỗi tính năng được thiết kế để giúp đôi ta kết nối sâu sắc hơn, lưu giữ những khoảnh khắc đáng nhớ và chia sẻ cảm xúc một cách chân thành nhất. Từ những tin nhắn yêu thương đến những kỷ niệm đáng nhớ.',
      content3: 'Đây là nơi tình yêu của chúng ta được nuôi dưỡng và phát triển mỗi ngày. Một không gian an toàn, riêng tư và đầy ý nghĩa chỉ dành cho đôi ta.'
    },
    values: {
      title: 'Những điều đặc biệt',
      subtitle: 'Những gì làm nên sự độc đáo của không gian này',
      authentic: {
        title: 'Chân thành',
        description: 'Nơi chúng ta có thể chia sẻ những cảm xúc thật nhất mà không cần che giấu.'
      },
      safety: {
        title: 'Riêng tư',
        description: 'Hoàn toàn riêng tư, chỉ dành cho hai chúng ta mà thôi.'
      },
      inclusive: {
        title: 'Kết nối',
        description: 'Tạo ra sự kết nối sâu sắc và ý nghĩa giữa đôi ta.'
      },
      innovation: {
        title: 'Độc đáo',
        description: 'Được thiết kế riêng cho tình yêu đặc biệt của chúng ta.'
      }
    },
    team: {
      title: 'Về chúng ta',
      subtitle: 'Hai trái tim đã tìm thấy nhau',
      sarah: {
        name: 'Em yêu',
        role: '💕 Nửa kia của anh',
        bio: 'Người mang lại ý nghĩa cho cuộc sống và làm cho mỗi ngày đều trở nên đặc biệt.'
      },
      michael: {
        name: 'Anh yêu',
        role: '💕 Nửa kia của em',
        bio: 'Người bảo vệ, che chở và yêu thương em hết lòng trong suốt hành trình này.'
      },
      emily: {
        name: 'Tình yêu',
        role: '💕 Của đôi ta',
        bio: 'Sợi dây vô hình kết nối hai trái tim và tạo nên phép màu trong cuộc sống.'
      }
    },
    contact: {
      title: 'Liên lạc với nhau',
      subtitle: 'Luôn sẵn sàng lắng nghe và chia sẻ với nhau',
      support: 'Gửi tin nhắn yêu thương',
      faq: 'Câu hỏi dành cho nhau'
    }
  },
  common: {
    comingSoon: 'Sắp ra mắt',
    learnMore: 'Tìm hiểu thêm',
    getStarted: 'Bắt đầu',
    contactUs: 'Liên hệ chúng ta',
    copyright: '© {year} LoveApp - Không gian tình yêu riêng của chúng ta 💕'
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
    login: 'Login'
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
    subtitle: 'Where we preserve beautiful memories and build our love every day',
    story: {
      title: 'Our Journey',
      content1: 'LoveApp was created as a special gift exclusively for our love. This is not an ordinary dating app, but a private space where only the two of us exist.',
      content2: 'Every feature is designed to help us connect more deeply, preserve memorable moments and share emotions in the most sincere way. From loving messages to unforgettable memories.',
      content3: 'This is where our love is nurtured and grows every day. A safe, private and meaningful space created just for us two.'
    },
    values: {
      title: 'What Makes It Special',
      subtitle: 'What makes this space unique',
      authentic: {
        title: 'Genuine',
        description: 'Where we can share our truest emotions without hiding anything.'
      },
      safety: {
        title: 'Private',
        description: 'Completely private, just for the two of us and no one else.'
      },
      inclusive: {
        title: 'Connection',
        description: 'Creating deep and meaningful connection between us.'
      },
      innovation: {
        title: 'Unique',
        description: 'Specially designed for our special love.'
      }
    },
    team: {
      title: 'About Us',
      subtitle: 'Two hearts that found each other',
      sarah: {
        name: 'My Love',
        role: '💕 My Other Half',
        bio: 'The one who brings meaning to life and makes every day special.'
      },
      michael: {
        name: 'My Darling',
        role: '💕 Your Other Half',
        bio: 'The one who protects, cares for and loves you wholeheartedly throughout this journey.'
      },
      emily: {
        name: 'Love',
        role: '💕 Of Both of Us',
        bio: 'The invisible thread that connects two hearts and creates magic in life.'
      }
    },
    contact: {
      title: 'Stay Connected',
      subtitle: 'Always ready to listen and share with each other',
      support: 'Send Love Messages',
      faq: 'Questions for Each Other'
    }
  },
  common: {
    comingSoon: 'Coming Soon',
    learnMore: 'Learn More',
    getStarted: 'Get Started',
    contactUs: 'Contact Us',
    copyright: '© {year} LoveApp - Our Private Love Space 💕'
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