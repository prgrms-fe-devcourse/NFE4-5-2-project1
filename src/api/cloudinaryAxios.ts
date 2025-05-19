import axios from 'axios'

export const cloudinaryAxiosInstance = axios.create({
  baseURL: 'https://api.cloudinary.com/v1_1/dwfwehbv2/image/upload',
  headers: {
    'Content-Type': 'multipart/form-data', // 멀티파트 데이터 전송
  },
})
