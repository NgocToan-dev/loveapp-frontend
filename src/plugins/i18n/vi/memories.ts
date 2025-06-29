export default {
  title: 'Kỷ niệm của chúng ta',
  subtitle: 'Lưu giữ những khoảnh khắc đẹp bên nhau',
  
  create: {
    title: 'Tạo kỷ niệm mới',
    button: 'Thêm kỷ niệm'
  },

  form: {
    title: 'Tiêu đề kỷ niệm',
    description: 'Mô tả ngắn',
    descriptionPlaceholder: 'Mô tả ngắn gọn về kỷ niệm này...',
    titlePlaceholder: 'Nhập tiêu đề đẹp cho kỷ niệm này...',
    createTitle: 'Tạo kỷ niệm mới',
    editTitle: 'Chỉnh sửa kỷ niệm',
    content: 'Nội dung chi tiết',
    contentPlaceholder: 'Mô tả chi tiết khoảnh khắc đặc biệt này...',
    date: 'Ngày tháng',
    location: 'Địa điểm',
    locationPlaceholder: 'Điều này xảy ra ở đâu?',
    photos: 'Hình ảnh',
    images: 'Hình ảnh',
    dragImages: 'Kéo thả hình ảnh vào đây hoặc nhấp để chọn',
    selectImages: 'Chọn hình ảnh',
    tags: 'Thẻ',
    tagsPlaceholder: 'Thêm thẻ và nhấn Enter...',
    selectTag: 'Chọn thẻ có sẵn',
    customTagPlaceholder: 'Hoặc nhập thẻ tùy chỉnh...',
    mood: 'Tâm trạng',
    weather: 'Thời tiết',
    private: 'Kỷ niệm riêng tư',
    privateDesc: 'Chỉ bạn và người yêu có thể xem kỷ niệm này'
  },

  moods: {
    happy: 'Vui vẻ',
    love: 'Yêu thương',
    romantic: 'Lãng mạn',
    excited: 'Phấn khích',
    peaceful: 'Bình yên',
    nostalgic: 'Hoài niệm',
    grateful: 'Biết ơn'
  },

  weather: {
    sunny: 'Nắng',
    cloudy: 'Có mây', 
    rainy: 'Mưa',
    snowy: 'Tuyết',
    windy: 'Gió'
  },

  tags: {
    anniversary: 'Kỷ niệm',
    date: 'Hẹn hò',
    travel: 'Du lịch',
    food: 'Ẩm thực',
    family: 'Gia đình',
    friends: 'Bạn bè',
    celebration: 'Kỷ niệm',
    milestone: 'Cột mốc',
    gift: 'Quà tặng',
    surprise: 'Bất ngờ',
    adventure: 'Phiêu lưu',
    home: 'Ở nhà'
  },

  actions: {
    create: 'Tạo kỷ niệm',
    createFirst: 'Tạo kỷ niệm đầu tiên',
    edit: 'Chỉnh sửa',
    delete: 'Xóa kỷ niệm',
    addFavorite: 'Thêm vào yêu thích',
    removeFavorite: 'Bỏ yêu thích',
    favorite: 'Yêu thích',
    favorited: 'Đã yêu thích',
    share: 'Chia sẻ',
    view: 'Xem chi tiết'
  },

  search: {
    placeholder: 'Tìm kiếm kỷ niệm...'
  },

  filters: {
    title: 'Bộ lọc',
    favorites: 'Yêu thích',
    private: 'Riêng tư',
    allMoods: 'Tất cả tâm trạng',
    mood: 'Tâm trạng',
    search: 'Tìm kiếm',
    activeFilters: 'Bộ lọc đang áp dụng',
    clearAll: 'Xóa tất cả bộ lọc',
    sortBy: 'Sắp xếp theo',
    newestFirst: 'Mới nhất trước',
    oldestFirst: 'Cũ nhất trước',
    titleAZ: 'Tiêu đề A-Z'
  },

  empty: {
    noMemories: 'Chưa có kỷ niệm nào',
    noMatches: 'Không tìm thấy kỷ niệm phù hợp',
    createFirst: 'Hãy tạo kỷ niệm đầu tiên của bạn để bắt đầu hành trình lưu giữ những khoảnh khắc đẹp!',
    tryAdjustingFilters: 'Hãy thử điều chỉnh bộ lọc để tìm thấy kỷ niệm bạn đang tìm kiếm.'
  },

  delete: {
    title: 'Xóa kỷ niệm',
    message: 'Bạn có chắc chắn muốn xóa kỷ niệm này? Hành động này không thể hoàn tác.',
    success: 'Đã xóa kỷ niệm thành công',
    error: 'Có lỗi xảy ra khi xóa kỷ niệm'
  },

  errors: {
    fetch_failed: 'Lỗi khi tải kỷ niệm',
    fetch_single_failed: 'Lỗi khi tải chi tiết kỷ niệm',
    create_failed: 'Lỗi khi tạo kỷ niệm',
    update_failed: 'Lỗi khi cập nhật kỷ niệm',
    delete_failed: 'Lỗi khi xóa kỷ niệm',
    search_failed: 'Lỗi khi tìm kiếm kỷ niệm',
    fetch_by_tag_failed: 'Lỗi khi tải kỷ niệm theo thẻ',
    fetch_timeline_failed: 'Lỗi khi tải dòng thời gian'
  },

  success: {
    created: 'Tạo kỷ niệm thành công!',
    updated: 'Cập nhật kỷ niệm thành công!',
    deleted: 'Xóa kỷ niệm thành công!'
  },

  timeline: {
    title: 'Dòng thời gian kỷ niệm',
    filter: 'Lọc theo',
    sortBy: 'Sắp xếp theo',
    newest: 'Mới nhất',
    oldest: 'Cũ nhất',
    mostLiked: 'Yêu thích nhất'
  }
}
