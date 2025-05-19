# TripUs (여행 동행 / 정보 공유를 위한 커뮤니티 서비스)

![image](https://github.com/user-attachments/assets/0b2fc27d-9337-4302-9cf6-f62a72b8c406)


## 프로젝트 개요

혼자 여행을 준비하고 떠나는 일이 부담스럽게 느껴지는 사용자들에게 여행 동행자를 쉽게 찾고, 함께한 여정의 추억을 나눌 수 있는 공간이 필요하다 생각했습니다.
TripUs는 여행 동행자를 구하는 사람들에게 여행 취향이나 일정이 맞는 사람을 쉽게 찾을 수 있는 커뮤니티입니다. 동행원 모집 게시글을 통해 동행 조건에 맞는 크루를 모집할 수 있습니다.
댓글, 좋아요, 채팅을 통해 사용자들 간에 실시간으로 소통할 수 있는 플랫폼을 제공합니다.

## 프로젝트 기간

2025.4.25 ~ 2025.5.19

## 기술 스택

<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">
<img src="https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white">

## 디렉토리 구조

```bash
📦public                    # 정적 파일
📦src
 ┣ 📂apis                   # API 호출 관련 함수
 ┣ 📂assets                 # 정적 리소스 (이미지, JSON 등)
 ┃ ┣ 📂data
 ┃ ┣ 📂images
 ┣ 📂components             # 공통 및 기능별 UI 컴포넌트
 ┃ ┣ 📂commons              # 공용 컴포넌트
 ┃ ┗ 📂features
 ┃ ┃ ┣ 📂home                   # 메인 홈페이지
 ┃ ┃ ┣ 📂message                # 메시지
 ┃ ┃ ┣ 📂notification           # 알림
 ┃ ┃ ┣ 📂post                   # 게시글 작성 및 수정
 ┃ ┃ ┣ 📂postDetail             # 게시글 상세 페이지
 ┃ ┃ ┣ 📂profile                # 유저 프로필
 ┃ ┗ ┗ 📂user                   # 유저 목록
 ┃
 ┣ 📂constants              # 상수 정의
 ┣ 📂context                # React Context
 ┣ 📂css                    # CSS 파일
 ┣ 📂hooks                  # 커스텀 훅
 ┣ 📂layouts                # 레이아웃 컴포넌트
 ┣ 📂pages                  # 라우트 페이지
 ┣ 📂store                  # zustand 전역 상태 관리
 ┣ 📂types                  # 타입 정의
 ┣ 📂utils                  # 유틸 함수
 ┣ 📜App.tsx
 ┣ 📜main.tsx
 ┗ 📜vite-env.d.ts
```

## 팀원 소개

<div align="center">

  <table>
    <tr>
      <td align="center" style="border:1px solid #ccc; border-radius:10px; padding:10px; width:140px;">
        <img src="https://github.com/run3go.png" width="100px;" style="border-radius:50%;" alt="run3go"/><br />
        <b>박정수</b><br />
        <a href="https://github.com/run3go">@run3go</a>
        <span>Frontend</span>
      </td>
      <td align="center" style="border:1px solid #ccc; border-radius:10px; padding:10px; width:140px;">
        <img src="https://github.com/amykoomj.png" width="100px;" style="border-radius:50%;" alt="amykoomj"/><br />
        <b>구민지</b><br />
        <a href="https://github.com/amykoomj">@amykoomj</a>
        <span>Frontend</span>
      </td>
      <td align="center" style="border:1px solid #ccc; border-radius:10px; padding:10px; width:140px;">
        <img src="https://github.com/jieun22222.png" width="100px;" style="border-radius:50%;" alt="jieun22222"/><br />
        <b>송지은</b><br />
        <a href="https://github.com/jieun22222">@jieun22222</a>
        <span>Frontend</span>
      </td>
      <td align="center" style="border:1px solid #ccc; border-radius:10px; padding:10px; width:140px;">
        <img src="https://github.com/KwonTaeHun00.png" width="100px;" style="border-radius:50%;" alt="KwonTaeHun00"/><br />
        <b>권태훈</b><br />
        <a href="https://github.com/KwonTaeHun00">@KwonTaeHun00</a>
        <span>Frontend</span>
      </td>
      <td align="center" style="border:1px solid #ccc; border-radius:10px; padding:10px; width:140px;">
        <img src="https://github.com/seoyeoxxlee.png" width="100px;" style="border-radius:50%;" alt="seoyeoxxlee"/><br />
        <b>이서영</b><br />
        <a href="https://github.com/seoyeoxxlee">@seoyeoxxlee</a>
        <span>Frontend</span>
      </td>
    </tr>
  </table>

</div>

##
