# Sử dụng Nodejs image chính thức
FROM node:18

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json vào container
COPY package*.json ./

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng cho ứng dụng (ví dụ: 3000)
EXPOSE 3000

# Lệnh để chạy ứng dụng
CMD ["npm", "run", "dev"]