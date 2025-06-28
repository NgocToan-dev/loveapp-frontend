export default {
  title: 'Lời nhắc quan trọng',
  subtitle: 'Không bao giờ quên những ngày đặc biệt',
  description: 'Quản lý và theo dõi những sự kiện quan trọng trong mối quan hệ của bạn',
  
  create: {
    title: 'Tạo lời nhắc mới',
    button: 'Thêm nhắc nhở'
  },

  edit: {
    title: 'Chỉnh sửa lời nhắc'
  },

  form: {
    title: 'Tiêu đề nhắc nhở',
    title_placeholder: 'Nhập tiêu đề lời nhắc...',
    description: 'Mô tả',
    description_placeholder: 'Thêm mô tả chi tiết...',
    date: 'Ngày',
    time: 'Giờ',
    type: 'Loại lời nhắc',
    is_recurring: 'Lặp lại định kỳ',
    recurring_type: 'Kiểu lặp lại',
    dateTime: 'Thời gian nhắc',
    repeat: 'Lặp lại',
    priority: 'Độ ưu tiên',
    category: 'Danh mục',
    notification: 'Thông báo'
  },

  types: {
    anniversary: 'Kỷ niệm',
    birthday: 'Sinh nhật',
    date: 'Hẹn hò',
    custom: 'Tùy chỉnh'
  },

  recurring: {
    daily: 'Hàng ngày',
    weekly: 'Hàng tuần',
    monthly: 'Hàng tháng',
    yearly: 'Hàng năm'
  },

  repeat: {
    none: 'Không lặp',
    daily: 'Hàng ngày',
    weekly: 'Hàng tuần',
    monthly: 'Hàng tháng',
    yearly: 'Hàng năm',
    custom: 'Tùy chỉnh'
  },

  priority: {
    low: 'Thấp',
    medium: 'Trung bình',
    high: 'Cao',
    urgent: 'Khẩn cấp'
  },

  categories: {
    anniversary: 'Kỷ niệm',
    birthday: 'Sinh nhật',
    date: 'Hẹn hò',
    gift: 'Quà tặng',
    travel: 'Du lịch',
    health: 'Sức khỏe',
    work: 'Công việc',
    other: 'Khác'
  },

  status: {
    upcoming: 'Sắp tới',
    today: 'Hôm nay',
    overdue: 'Quá hạn',
    completed: 'Hoàn thành'
  },

  stats: {
    total: 'Tổng số',
    completed: 'Đã hoàn thành',
    upcoming: 'Sắp tới',
    overdue: 'Quá hạn'
  },

  filter: {
    all: 'Tất cả',
    active: 'Đang hoạt động',
    completed: 'Đã hoàn thành',
    overdue: 'Quá hạn',
    upcoming: 'Sắp tới',
    type: 'Loại'
  },

  sections: {
    overdue: 'Quá hạn',
    upcoming: 'Sắp tới',
    all: 'Tất cả lời nhắc'
  },

  no_connection_title: 'Kết nối với người yêu',
  no_connection_message: 'Bạn cần kết nối với người yêu để tạo lời nhắc chung.',
  no_reminders_title: 'Chưa có lời nhắc nào',
  no_reminders_message: 'Hãy tạo lời nhắc đầu tiên để không bỏ lỡ những ngày đặc biệt!',
  create_first: 'Tạo lời nhắc đầu tiên',
  
  search_placeholder: 'Tìm kiếm lời nhắc...',
  
  overdue_section: 'Lời nhắc quá hạn',
  upcoming_section: 'Lời nhắc sắp tới',
  all_section: 'Tất cả lời nhắc',

  mark_complete: 'Đánh dấu hoàn thành',
  mark_incomplete: 'Đánh dấu chưa hoàn thành',
  snooze: 'Hoãn lại',
  snooze_reminder: 'Hoãn lời nhắc',
  snooze_description: 'Chọn thời gian để được nhắc lại:',
  custom_snooze: 'Thời gian tùy chỉnh',
  snooze_until_date: 'Hoãn đến ngày',
  snooze_until_time: 'Hoãn đến giờ',

  snooze_options: {
    '15_minutes': '15 phút',
    '1_hour': '1 giờ',
    '4_hours': '4 giờ',
    '1_day': '1 ngày'
  },

  created_by: 'Tạo bởi',
  
  confirm_delete: 'Xác nhận xóa',
  delete_warning: 'Bạn có chắc chắn muốn xóa lời nhắc này?',

  validation: {
    date_future: 'Ngày phải trong tương lai'
  },

  errors: {
    fetch_failed: 'Không thể tải danh sách lời nhắc',
    fetch_single_failed: 'Không thể tải chi tiết lời nhắc',
    create_failed: 'Không thể tạo lời nhắc',
    update_failed: 'Không thể cập nhật lời nhắc',
    delete_failed: 'Không thể xóa lời nhắc',
    mark_completed_failed: 'Không thể đánh dấu hoàn thành',
    mark_incomplete_failed: 'Không thể đánh dấu chưa hoàn thành',
    fetch_upcoming_failed: 'Không thể tải lời nhắc sắp tới',
    fetch_overdue_failed: 'Không thể tải lời nhắc quá hạn',
    fetch_by_type_failed: 'Không thể tải lời nhắc theo loại',
    search_failed: 'Không thể tìm kiếm lời nhắc',
    snooze_failed: 'Không thể hoãn lời nhắc'
  },

  success: {
    created: 'Tạo lời nhắc thành công!',
    updated: 'Cập nhật lời nhắc thành công!',
    deleted: 'Xóa lời nhắc thành công!',
    marked_completed: 'Đánh dấu hoàn thành thành công!',
    marked_incomplete: 'Đánh dấu chưa hoàn thành thành công!'
  },

  actions: {
    complete: 'Hoàn thành',
    snooze: 'Hoãn',
    edit: 'Chỉnh sửa',
    delete: 'Xóa'
  }
}
