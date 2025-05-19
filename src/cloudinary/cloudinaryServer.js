require('dotenv').config() // .env 파일 로드

const cloudinary = require('cloudinary').v2 // Cloudinary SDK
const express = require('express')
const app = express()

// Cloudinary API 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloud Name
  api_key: process.env.CLOUDINARY_API_KEY, // API Key
  api_secret: process.env.CLOUDINARY_API_SECRET, // API Secret
})

// 이미지 업로드 엔드포인트
app.post('/upload', (req, res) => {
  // Cloudinary에 이미지 업로드
  cloudinary.uploader.upload('path_to_image', function (result) {
    console.log(result)
    res.send(result)
  })
})

app.listen(5000, () => {
  console.log('Server is running on port 5000')
})
