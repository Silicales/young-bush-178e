# Hướng dẫn thiết lập Google AdSense cho Tech Blog

## 🚀 Đã hoàn thành

### ✅ 1. Google AdSense Script
- Đã thêm script AdSense vào `src/components/BaseHead.astro`
- **Cần thay đổi**: Thay `ca-pub-XXXXXXXXXXXXXXXX` bằng Publisher ID thực của bạn

### ✅ 2. Vị trí quảng cáo
- **Trang chủ**: 2 vị trí (banner + rectangle)
- **Bài viết**: 2 vị trí (in-article + bottom)
- **Component**: `src/components/AdSense.astro` với nhiều tùy chọn

### ✅ 3. ads.txt file
- Đã tạo `public/ads.txt`
- **Cần thay đổi**: Thay `pub-XXXXXXXXXXXXXXXX` bằng Publisher ID thực

### ✅ 4. Nội dung tối ưu
- Thêm nội dung SEO-friendly
- Từ khóa liên quan đến công nghệ
- Cấu trúc nội dung phù hợp với AdSense

### ✅ 5. Legal pages
- Privacy Policy: `/privacy-policy`
- Terms of Service: `/terms-of-service`
- Links trong footer

## 🔧 Cần thực hiện

### 1. Đăng ký Google AdSense
1. Truy cập [Google AdSense](https://www.google.com/adsense/)
2. Đăng ký tài khoản với domain của bạn
3. Lấy Publisher ID (dạng: ca-pub-1234567890123456)

### 2. Cập nhật Publisher ID
Thay thế `ca-pub-XXXXXXXXXXXXXXXX` trong các file:
- `src/components/BaseHead.astro` (dòng 50)
- `public/ads.txt` (dòng 3)

### 3. Tạo Ad Units
1. Vào AdSense dashboard
2. Tạo các ad units mới:
   - **Banner**: 728x90 (leaderboard)
   - **Rectangle**: 300x250 (medium rectangle)
   - **In-article**: Auto ads
3. Lấy Ad Slot IDs và thay thế trong code

### 4. Cập nhật Ad Slot IDs
Thay thế các `adSlot` trong:
- `src/pages/index.astro` (dòng 72, 131)
- `src/layouts/BlogPost.astro` (dòng 83, 93)

## 📊 Vị trí quảng cáo

### Trang chủ
- **Banner**: Sau featured article section
- **Rectangle**: Sau recent posts section

### Bài viết
- **In-article**: Ngay sau tiêu đề bài viết
- **Bottom**: Cuối nội dung bài viết

## 🎯 Tối ưu hóa

### Nội dung
- ✅ Từ khóa công nghệ phù hợp
- ✅ Nội dung chất lượng cao
- ✅ Cấu trúc rõ ràng
- ✅ Mobile-friendly

### Technical
- ✅ Fast loading
- ✅ Responsive design
- ✅ SEO optimized
- ✅ Legal compliance

## 📈 Monitoring

### Google Analytics
- Đã thêm GA script (cần cập nhật Tracking ID)
- Thay `G-XXXXXXXXXX` bằng Tracking ID thực

### AdSense Reports
- Theo dõi CTR (Click Through Rate)
- RPM (Revenue Per Mille)
- Page views
- Ad impressions

## ⚠️ Lưu ý quan trọng

1. **Tuân thủ chính sách AdSense**:
   - Không click vào quảng cáo của chính mình
   - Không yêu cầu người khác click
   - Nội dung chất lượng cao

2. **Tối ưu hiệu suất**:
   - Test trên mobile và desktop
   - Kiểm tra tốc độ tải trang
   - Đảm bảo quảng cáo hiển thị đúng

3. **Backup**:
   - Lưu backup code trước khi thay đổi
   - Test trên staging environment

## 🚀 Deploy

Sau khi cập nhật tất cả IDs:
```bash
git add .
git commit -m "feat: Complete AdSense integration"
git push origin main
```

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra AdSense dashboard
2. Xem console browser để debug
3. Tham khảo [AdSense Help Center](https://support.google.com/adsense/)

---
*Cập nhật lần cuối: 23/12/2024*
