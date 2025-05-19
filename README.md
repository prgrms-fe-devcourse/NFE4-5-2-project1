# CodePop

![codepop](https://github.com/user-attachments/assets/caadaabc-ecd8-4fbd-a981-e776dcb154d9)

<br>

## 프로젝트 소개

- CodePop은 개발 지식과 일상을 함께 나누는 개발자 커뮤니티입니다.
- 개발에 대한 이야기를 가볍고 편하게 나눌 수 있는 공간을 지향합니다.
- 질문과 정보 공유 뿐 아니라 일상적인 소통도 환영합니다.
- 데스크 셋업 공유 콘텐츠로 관심 있는 주제를 자유롭게 이야기할 수 있습니다.
- 투표 기능을 통해 누구나 쉽게 참여하고 의견을 나눌 수 있습니다.

<br>

## 팀원 구성

|                              **박서영** <br>[@sduddla](https://github.com/sduddla)                               |                              **한유빈**<br>[@yubin121](https://github.com/yubin121)                              |                          **조소정**<br>[@chosojeong97](https://github.com/chosojeong97)                          |                           **김태연**<br>[@COMPOSEDKIM](https://github.com/COMPOSEDKIM)                           |                               **유강민**<br>[@dkawoindsa](https://github.com/dkawoindsa)                               |
| :--------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/user-attachments/assets/944342e5-da1b-40aa-8cb6-ac9239d9f122" height=150 width=150> | <img src="https://github.com/user-attachments/assets/b89b03dc-5ca5-461e-979a-9cc439e0d583" height=150 width=150> | <img src="https://github.com/user-attachments/assets/5b60a8c6-e2e4-4a97-8e92-ee33c56a2b33" height=150 width=150> | <img src="https://github.com/user-attachments/assets/e2117f41-b503-4d9e-9ff7-637dbaa78b0e" height=150 width=150> | <img src="https://github.com/user-attachments/assets/23ce4c1e-bc87-4dc8-ab79-ec6bff77ad6d" width="150" height="150" /> |
|                                                       팀장                                                       |                                                       팀원                                                       |                                                       팀원                                                       |                                                       팀원                                                       |                                                          팀원                                                          |

<br>

## 1. 개발 환경

| 구분             | 사용 기술                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 프론트엔드       | ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) |
| 협업 툴          | ![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) ![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)                                                                                                                                                                |
| 서비스 배포 환경 | ![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=%2300C7B7)                                                                                                                                                                                                                                                                                                                                                                         |
| 디자인           | ![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                   |

<br>

## 2. 폴더 구조

```bash
📦src
 ┣ 📂api
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📜login.ts
 ┃ ┃ ┗ 📜signup.ts
 ┃ ┣ 📂follow
 ┃ ┃ ┗ 📜follow.ts
 ┃ ┣ 📂memberbox
 ┃ ┃ ┗ 📜member.ts
 ┃ ┣ 📂message
 ┃ ┃ ┗ 📜message.ts
 ┃ ┣ 📂notification
 ┃ ┃ ┗ 📜notification.ts
 ┃ ┣ 📂post
 ┃ ┃ ┗ 📜post.ts
 ┃ ┣ 📂profileInfo
 ┃ ┃ ┗ 📜profile.ts
 ┃ ┣ 📂write
 ┃ ┃ ┗ 📜write.ts
 ┃ ┗ 📜axios.ts
 ┣ 📂assets
 ┃ ┗ 📂images
 ┣ 📂components
 ┃ ┣ 📂avatar
 ┃ ┃ ┗ 📜Avatar.tsx
 ┃ ┣ 📂btn
 ┃ ┃ ┣ 📜PostBtn.tsx
 ┃ ┃ ┗ 📜VoteBtn.tsx
 ┃ ┣ 📂channel
 ┃ ┃ ┗ 📜ChannelName.tsx
 ┃ ┣ 📂common
 ┃ ┃ ┣ 📜Button.tsx
 ┃ ┃ ┗ 📜Input.tsx
 ┃ ┣ 📂editor
 ┃ ┃ ┣ 📂extensions
 ┃ ┃ ┃ ┗ 📜CustomImage.ts
 ┃ ┃ ┣ 📜CommentEditor.tsx
 ┃ ┃ ┣ 📜CommentEditorToolbar.tsx
 ┃ ┃ ┣ 📜Editor.tsx
 ┃ ┃ ┗ 📜EditorToolbar.tsx
 ┃ ┣ 📂header
 ┃ ┃ ┗ 📜Header.tsx
 ┃ ┣ 📂icon
 ┃ ┃ ┣ 📜BoldIcon.tsx
 ┃ ┃ ┣ 📜CodeEditIcon.tsx
 ┃ ┃ ┣ 📜ImageIcon.tsx
 ┃ ┃ ┣ 📜ItalicIcon.tsx
 ┃ ┃ ┗ 📜VoteIcon.tsx
 ┃ ┣ 📂main-content
 ┃ ┃ ┣ 📜Banner.tsx
 ┃ ┃ ┣ 📜PopularPost.tsx
 ┃ ┃ ┗ 📜PopularPostCkeleton.tsx
 ┃ ┣ 📂notification
 ┃ ┃ ┗ 📜Notification.tsx
 ┃ ┣ 📂poll
 ┃ ┃ ┣ 📜PollCreater.tsx
 ┃ ┃ ┣ 📜PollOptionsView.tsx
 ┃ ┃ ┗ 📜PollOptionsVoteView.tsx
 ┃ ┣ 📂post
 ┃ ┃ ┣ 📜CheckDeleteModal.tsx
 ┃ ┃ ┣ 📜CommentListItem.tsx
 ┃ ┃ ┣ 📜DeletedUserModal.tsx
 ┃ ┃ ┣ 📜DropSort.tsx
 ┃ ┃ ┣ 📜NotLoginModal.tsx
 ┃ ┃ ┣ 📜PostDetailItem.tsx
 ┃ ┃ ┣ 📜PostDetailSkeleton.tsx
 ┃ ┃ ┣ 📜PostListItem.tsx
 ┃ ┃ ┣ 📜PostSkeleton.tsx
 ┃ ┃ ┣ 📜SearchPost.tsx
 ┃ ┃ ┗ 📜WriteCommentItem.tsx
 ┃ ┣ 📂reaction
 ┃ ┃ ┗ 📜LikeComment.tsx
 ┃ ┣ 📂sidebar
 ┃ ┃ ┣ 📜ChannelBox.tsx
 ┃ ┃ ┗ 📜MemberBox.tsx
 ┃ ┗ 📂toggle
 ┃ ┃ ┗ 📜DarkMode.tsx
 ┣ 📂css
 ┃ ┣ 📂layout
 ┃ ┃ ┗ 📜layout.css
 ┃ ┣ 📂main-content
 ┃ ┃ ┗ 📜main-content.css
 ┃ ┣ 📜editor.css
 ┃ ┣ 📜index.css
 ┃ ┗ 📜tailwind.css
 ┣ 📂layout
 ┃ ┗ 📜MainLayout.tsx
 ┣ 📂pages
 ┃ ┣ 📂login
 ┃ ┃ ┗ 📜Login.tsx
 ┃ ┣ 📂message
 ┃ ┃ ┣ 📜ChatHeader.tsx
 ┃ ┃ ┣ 📜ChatModal.tsx
 ┃ ┃ ┣ 📜ChatRoom.tsx
 ┃ ┃ ┗ 📜ChatUserList.tsx
 ┃ ┣ 📂profile
 ┃ ┃ ┣ 📂profile-edit
 ┃ ┃ ┃ ┣ 📜EditMenu.tsx
 ┃ ┃ ┃ ┣ 📜EditProfile.tsx
 ┃ ┃ ┃ ┣ 📜EditProfilePage.tsx
 ┃ ┃ ┃ ┗ 📜PhotoUploadModal.tsx
 ┃ ┃ ┣ 📜FollowMember.tsx
 ┃ ┃ ┣ 📜FollowModal.tsx
 ┃ ┃ ┣ 📜Profile.tsx
 ┃ ┃ ┣ 📜ProfileLeft.tsx
 ┃ ┃ ┣ 📜ProfilePage.tsx
 ┃ ┃ ┗ 📜ProfileRight.tsx
 ┃ ┣ 📂signup
 ┃ ┃ ┗ 📜SignUp.tsx
 ┃ ┣ 📂update
 ┃ ┃ ┣ 📜UpdateCodePost.tsx
 ┃ ┃ ┣ 📜UpdateSetPost.tsx
 ┃ ┃ ┗ 📜UpdateVotePost.tsx
 ┃ ┣ 📂write
 ┃ ┃ ┣ 📜CreateCodePost.tsx
 ┃ ┃ ┣ 📜CreateSetPost.tsx
 ┃ ┃ ┗ 📜CreateVotePost.tsx
 ┃ ┣ 📜Error.tsx
 ┃ ┣ 📜MainContent.tsx
 ┃ ┣ 📜PostDetail.tsx
 ┃ ┗ 📜PostList.tsx
 ┣ 📂route
 ┃ ┣ 📜UpdatePostRouter.tsx
 ┃ ┗ 📜WritePostRouter.tsx
 ┣ 📂stores
 ┃ ┣ 📜authStore.ts
 ┃ ┣ 📜channelStore.ts
 ┃ ┣ 📜messageStore.ts
 ┃ ┗ 📜postStore.ts
 ┣ 📂types
 ┃ ┣ 📜channelItem.d.ts
 ┃ ┣ 📜darkModeTypes.d.ts
 ┃ ┣ 📜notification.d.ts
 ┃ ┗ 📜user.d.ts
 ┣ 📂utils
 ┃ ┣ 📜changeMessageIcon.ts
 ┃ ┣ 📜darkModeUtils.ts
 ┃ ┣ 📜followHandlers.ts
 ┃ ┣ 📜getDatetime.ts
 ┃ ┣ 📜updateNewMessageCount.ts
 ┃ ┗ 📜validators.ts
 ┣ 📜App.tsx
 ┣ 📜main.tsx
 ┣ 📜swiper.d.ts
 ┗ 📜vite-env.d.ts

```

<br>

## 3. 역할 분담

**📌 공통**

- UI 제작

<br>

**🐶 박서영**

- 기능
  - 로그인 및 회원가입
  - 다크모드
- 프로젝트 일정 관리
- 와이어프레임 및 파비콘 제작
- README 및 기획서 문서 정리
- 발표 자료 제작 및 최종 발표 진행

<br>

**🐰 한유빈**

- 기능
  - 게시글 목록 구현
  - 게시글 검색, 정렬 기능 구현
  - 상세 게시글 구현
  - 좋아요, 댓글 기능 구현
  - 채팅방 구현
  - 실시간 메시지 알림 기능 구현

<br>

**🐮 조소정**

- 기능
  - 메인컨텐츠 배너 구현
  - 메인컨텐츠 탭 형식 인기글 기능 구현
  - 사이드바 멤버박스 유저 목록, 검색 기능 구현
  - 알림모달 구현, 개별알림 확인 기능 구현
  - 사이트 각 페이지 최소 반응형 적용

<br>

**😎 김태연**

- 기능
  - 프로필
  - 프로필 수정
  - 팔로잉 & 팔로워 리스트 표시
  - 팔로우 & 팔로우 취소 기능

<br>

**🥑 유강민**

- 기능
  - 게시글 작성 기능 개발
  - 게시글 수정 기능 개발
  - 투표 기능 개발

<br>

## 4. 개발 기간

- 전체 개발 기간 : 2025/4/25/금 ~ 2025/5/19/월

<br>

## 5. 주요 기능

### 5.1. 로그인

- 이메일 주소와 비밀번호를 입력하지 않고 로그인 버튼을 클릭할 경우, 필수 입력 항목임을 알리는 경고 문구가 표시됩니다.
- 입력한 이메일 또는 비밀번호가 기존 정보와 일치하지 않을 경우, "이메일 또는 비밀번호가 올바르지 않습니다."라는 경고 문구를 표시합니다.

https://github.com/user-attachments/assets/d90d5cfa-df17-427c-8ec0-f1a653bcc533

<br>

### 5.2. 회원가입

- 사용자 이름, 이메일 주소, 비밀번호, 비밀번호 확인을 입력받습니다.
- 각 입력값에 대해 실시간 유효성 검사가 이루어지며, 조건을 통과하지 못한 경우 경고 문구가 해당 입력창 하단에 표시됩니다.
- 비밀번호 확인 항목은 앞서 입력한 비밀번호와 일치하는 지 비교하여 검사합니다.
- 회원가입 버튼 클릭 시, 모든 항목의 유효성 검사를 통과한 경우 로그인 페이지로 이동합니다.

https://github.com/user-attachments/assets/6309050a-412c-4f69-8a6e-1b3e591e7a0d

<br>

### 5.3. 사이드바

- 사이드바 상단에는 각 채널들을 오갈 수 있는 채널박스가 있습니다.
- 사이드바 하단에는 관리자를 제외한 사용자들의 목록을 볼 수 있는 멤버 박스가 있습니다.
- 사용자들은 접속된 사용자들 우선으로 정렬됩니다.
- 사용자들의 이름, 이메일로 검색이 가능합니다.
- 멤버박스에는 회원의 프로필이미지, 이름, 이메일, 접속정보를 기본으로 알 수 있습니다.
- 로그인시 로그인한 본인의 프로필을 간략하게 볼 수 있고 사용자 목록에서 팔로우 여부를 추가로 알 수 있습니다.
- 회원들을 클릭하면 작은 모달이 나오고 프로필이동, 메시지 보내기를 선택할 수 있습니다.

https://github.com/user-attachments/assets/d8b8b29e-87e2-4c64-bfd1-f21d9ebf3a50

<br>

### 5.4. 메인 컨텐츠

- swiper 라이브러리를 사용한 이미지 슬라이더 배너가 있습니다.
- 각 채널들의 탭을 누르면 해당 채널의 인기순(좋아요가 많은 순 후순위로 댓글 순) 1,2 위를 보여줍니다.
- 인기글의 오른쪽 하단에 이미지, 투표는 작은 화면으로 변경하여 hover시 내용을 볼 수 있습니다.

https://github.com/user-attachments/assets/0b2f8e8d-3b04-4bd9-acac-a84902e7a200

<br>

### 5.5. 알림

- 포스트의 댓글, 좋아요, 유저들의 팔로우를 알림으로 알려줍니다.
- 새로운 알림은 아이콘에 숫자와 붉은 점으로 표시됩니다.
- 댓글, 좋아요 알림을 누르면 해당 글로 이동하며 팔로우 알림은 해당 유저의 프로필로 이동합니다.
- 전체읽기 버튼으로 한번에 알림을 읽음 처리 할 수 있습니다.

https://github.com/user-attachments/assets/51270402-10e5-4aaf-8c48-4da951041ddf

<br>

### 5.6. 프로필

#### [내 프로필]

- 활동 내역(포스트, 좋아요, 댓글)을 확인할 수 있습니다.
  - 제목 클릭 시 해당 글로, 채널명 클릭 시 해당 채널로 이동합니다.
- 팔로워 및 팔로잉 목록 확인 가능
  - 유저를 클릭하면 프로필 보기, 메시지 보내기, 팔로우/언팔로우가 가능합니다.
- 메시지 목록을 열어 상대방에게 메시지를 보낼 수 있습니다.

https://github.com/user-attachments/assets/012a3589-491e-40a5-983c-d430aa2c7466

#### [상대 프로필]

- 활동 내역(포스트, 좋아요, 댓글)을 확인할 수 있습니다.
  - 제목 클릭 시 해당 글로, 채널명 클릭 시 해당 채널로 이동합니다.
- 팔로워 및 팔로잉 목록 확인 가능
  - 유저를 클릭하면 프로필 보기, 메시지 보내기, 팔로우/언팔로우가 가능합니다.
- 직접 팔로우/언팔로우가 가능합니다.

https://github.com/user-attachments/assets/448cc407-6509-4471-b601-ceb2e27cae34

#### [프로필 수정]

- 이름, 비밀번호, 프로필 이미지, 커버 이미지를 변경할 수 있습니다.
  - 이름과 비밀번호가 유효한 형식이 아닐 경우, 경고 문구가 나타나며 수정이 제한됩니다.
  - 이미지 업로드는 드래그 앤 드롭 또는 파일 선택으로 가능합니다.
  - 업로드 시 미리보기가 제공되며, 삭제 시 기본 이미지로 변경됩니다.

https://github.com/user-attachments/assets/f794358b-a148-44fd-87d1-55840b409661

<br>

### 5.7. 게시글 생성

- 상단의 input 필드를 통해 게시글 제목을 입력할 수 있습니다.
- TipTap 라이브러리를 사용하여 텍스트 스타일 변화, 이미지 삽입, 코드블럭 및 투표 항목 생성 기능을 포함한 본문을 작성합니다.
- 사용자가 투표 생성 버튼을 눌러 투표 항목을 생성하면, 항목들이 보입니다.
- 이미지 버튼을 통해 파일을 선택하면 이미지가 보이고 삭제도 가능합니다.
- 제목과 본문이 비어 있을 경우 "완료" 버튼이 비활성화되며 제목과 본문 입력 후 "완료" 버튼 클릭 시 게시글 목록 페이지로 이동합니다.

https://github.com/user-attachments/assets/74481c20-14be-47c2-9705-46997767e598

<br>

### 5.8. 게시글 수정

- URL 파라미터로 전달된 postId를 기반으로 게시글 정보를 서버에서 조회합니다.
- 제목 및 본문의 텍스트를 수정할 수 있습니다.
- 기존에 등록된 투표 항목을 확인할 수 있습니다.
- 기존에 등록된 이미지를 삭제하거나, 새 이미지를 업로드할 수 있습니다.
- 작성 완료 후 "완료" 버튼을 클릭하면 서버로 수정된 데이터를 전송하고, 게시글 목록 페이지로 이동합니다.

https://github.com/user-attachments/assets/0f92d944-2eca-47fa-8619-1fcbb0953895

<br>

### 5.9. 투표

- 투표시 서버에 투표 요청을 보내고 결과를 반영합니다.
- 이미 선택한 항목을 한 번 더 클릭시 해당 투표를 삭제하여 투표를 취소합니다.
- 다른 항목 선택시 기존 투표를 삭제한 뒤 새로운 항목으로 다시 투표합니다.
- 각 항목의 투표 수 및 퍼센트를 계산하여 막대 형식으로 표시합니다.
- 전체 투표 수를 하단에 표시해 사용자가 투표 현황을 쉽게 파악할 수 있도록 구성되어 있습니다.

![vote](https://github.com/user-attachments/assets/899f7a9d-e8e9-490c-9696-217d27fb310f)

<br>

### 5.10. 채널

- 총 3개의 채널을 운영 중이며, 코드 리뷰, 데스크 셋업, 투표 채널이 있습니다.
- 각 채널에서는 원하는 내용을 검색할 수 있고, 최신순/인기순 정렬이 가능합니다.
- 스크롤을 아래로 내릴 시 Top 버튼이 생성되어 사용자가 원할 때 최상단으로 바로 이동 가능합니다.
- 상세 게시글 페이지로 이동하지 않고도 좋아요를 누를 수 있습니다.
- 댓글 클릭 시 상세 게시글 페이지로 이동하여 바로 댓글을 작성할 수 있도록 스크롤이 자동 조정됩니다.

https://github.com/user-attachments/assets/61cc4e2f-df17-42ce-99a8-49a4b0e762b6

<br>

### 5.11. 상세 게시글

- 각 채널에 따라 코드 블록이나 투표가 가능하며, 모든 채널에서 이미지를 볼 수 있습니다.
- 본인이 작성한 게시글이라면 수정 및 삭제 토글이 보입니다.
- 댓글을 작성할 수 있으며, 코드 리뷰 채널에서는 댓글로 코드 블록도 작성 가능합니다.
- 본인이 작성한 댓글이라면 삭제 토글이 보입니다.
- 좋아요를 누를 수 있습니다.

https://github.com/user-attachments/assets/208e7db7-17a3-4db0-9d3d-5e138a78457e

<br>

### 5.12. 메시지

- 안 읽은 메시지 개수의 총합을 헤더에서 실시간으로 확인 가능합니다.
- 메시지 기록이 있는 사용자들의 채팅 목록을 확인할 수 있습니다.
- 채팅 목록에서 사용자별 안 읽은 메시지 개수를 확인할 수 있습니다.
- 채팅방 입장 시 상대방이 보낸 메시지가 자동으로 읽음 처리됩니다.
- 채팅방에서 상대방과 나눈 메시지 기록 확인 및 실시간으로 메시지 전송이 가능합니다.
- 내가 보낸 메시지를 상대방이 읽으면 실시간으로 1 표시가 사라집니다.
- 멤버 박스에서 아직 메시지를 나눈 기록이 없는 사용자에게 메시지를 전송할 수 있습니다.

https://github.com/user-attachments/assets/08d1d066-363d-4db1-b42b-c74dc30b2194

<br>

### 5.13. 다크모드

- 사용자 설정에 따라 라이트/다크 테마 전환이 가능합니다.
- 다크모드 상태는 창을 닫았다가 다시 열어도 유지됩니다.

https://github.com/user-attachments/assets/62f8abe8-6de6-4a4f-9661-a89d6f93df61

<br>

## 6. 트러블 슈팅

**🐶 박서영**

초기에 다크모드 기능을 구현하는데 집중하면서, 관련 로직과 타입을 각 컴포넌트 내부에 중복 작성하는 방식으로 처리하였습니다. 이후 페이지 수가 늘어나면서 중복된 코드가 점점 많아지고 있다는 문제를 인식하게 되었습니다. 이를 개선하기 위해 각 컴포넌트에 반복 작성되던 다크모드 판별 조건을 공통 유틸 함수로 분리하고, 관련 타입 정의도 별도 파일로 이동하여 전체 구조를 정리하였습니다.

<br>

**🐰 한유빈**

댓글을 작성 및 삭제한 후에 바로 화면에 반영하고 싶어서 useEffect 의존성 배열에 api로 받아온 값이 저장된 상태 값을 넣어봤습니다. 이렇게 하면 처음에 api로 받아온 값을 상태 값에 저장하고 그 상태 값이 변경되면서 또 api가 호출되어서 받아온 값을 다시 상태 값에 저장하는 반복 문제가 발생했습니다. 그래서 처음에는 window.location.href를 이용하여 댓글을 작성하거나 삭제하면 강제로 새로고침을 하도록 만들었는데, 이렇게 하면 SPA의 이점이 사라지고 불필요한 전체 리렌더링이 발생하면서 성능도 저하되는 문제가 발생했습니다. 따라서 useEffect 의존성 배열에 트리거 값을 넣어놓고, 사용자가 댓글을 작성하거나 삭제할 때 그 트리거 값을 변경함으로써 변경이 감지될 때마다 해당 부분만 바뀌도록 수정했습니다. 이로 인해 사이트의 성능 및 사용자 경험이 개선되는 경험을 할 수 있었습니다.

<br>

**🐮 조소정**

알림창 관련 개발 중 개별 읽기 API가 없었습니다. 알림이 전체 읽기만 가능한건 어색하다고 판단하여 개별 읽기도 되도록 로직을 구현 했는데
실시간으로 추가되는 알림과 해당 알림의 댓글 좋아요가 삭제, 취소되면 알림도 삭제하는 등 고려해야 하는 상황이 많아서 개발하는데 복잡함을 느꼈습니다.
실제로 원하는대로 동작하지 않았고 구현하는데 있어서 어려움이 있었습니다.
그래서 기능의 시작부터 흐름을 하나하나 정리하며 리팩토링을 진행하면서 해결하였습니다.

<br>

**😎 김태연**

팔로잉 및 팔로워 정보를 불러오는 시간이 느려 렌더링이 지연되는 문제가 발생했습니다. 기존에는 팔로잉/팔로워 각각의 ID를 기반으로 개별 API를 여러 번 호출하는 방식이었지만, 이로 인해 성능 저하가 있었습니다. Batch API를 활용하면 효율적으로 데이터를 가져올 수 있다는 점을 확인했지만, 아직 구현되지 않은 상태였습니다.
이에 대한 우회 방법으로 전체 유저 데이터를 한 번에 받아온 뒤 클라이언트에서 필터링하는 방식을 적용했으며, 실제 측정 결과 기존 방식보다 약 3배 이상 빠른 응답 속도를 보였습니다. 결과적으로 전체 유저 데이터를 기반으로 필터링하는 방식이 더 효율적이어서 해당 방법을 채택하였습니다.

<br>

**🥑 유강민**

초기에 투표 기능에서 사용자는 버튼을 눌러도 UI에 아무 변화가 없어, 실제로 반영됐는지 알기 어려웠고 결과 확인을 위해 새로고침까지 해야 했습니다. 이는 서버 응답이 올 때까지 UI를 변경하지 않는 구조 때문이었습니다. 이를 개선하기 위해 Optimistic UI를 도입했습니다.
사용자가 투표하면 서버 응답 전에 UI를 먼저 업데이트하고, 실패 시 원래대로 롤백하는 방식입니다. 그 결과 즉각적인 피드백이 가능해졌고, UX가 눈에 띄게 개선되었습니다. 이번 경험을 통해 기능뿐 아니라 사용자 관점의 반응 속도와 에러 대응의 중요성을 배웠습니다.

<br>

## 7. 프로젝트 후기

**🐶 박서영**

정말 많은 것을 배울 수 있었던 3주였습니다. 정규 수업이 끝나자마자 바로 프로젝트에 들어가면서, 배운 내용을 활용해 코드 구현을 하거나 깃을 다루는 일이 쉽지만은 않았지만, 돌아보면 익숙해진 부분도 많았고, 어떤 점이 부족한 지도 분명히 알 수 있었던 시간이었습니다. 개인적으로 아쉬웠던 점은 구현에 집중하다 보니 협업 중 발생했던 문제 해결 과정을 체계적으로 기록하지 못한 부분입니다. 앞으로는 이런 경험도 꼼꼼히 정리하며 개발해야겠다는 다짐을 하게 되었습니다. 4월 말부터 5월 중순까지, 정말 치열하게 열심히 살았던 것 같고, 그만큼 값진 시간이었습니다. 다들 정말 고생 많으셨습니다!!!

<br>

**🐰 한유빈**

리액트와 타입스크립트를 배우고 난 후에 처음으로 시작한 프로젝트였기 때문에 나중에 다시 보면 부족한 점이 많을 수도 있지만, 주말과 밤 늦은 시간까지 함께 소통하며 팀원들과 열정을 불태웠기에 후회는 없습니다! 기능 구현을 하면서 여러 문제들을 맞닥뜨렸으나 서로 소통하고 해결하는 과정을 통해 많은 것을 배웠고, 이것을 기록함으로써 나중에 비슷한 문제가 발생했을 때 더 유연한 대처가 가능하도록 성장하게 되었습니다. 또한, 깃 브랜치 전략을 통해 협업하면서 그동안 어렵게만 느껴졌던 깃에 훨씬 익숙해질 수 있었습니다. 3주라는 기간 동안 다 같이 한 가지에 몰두하는 치열한 경험을 하였고, 이로 인해 우리들의 성취가 고스란히 담겨있는 값진 결과물을 얻을 수 있었습니다. 다들 정말 수고 많으셨고 앞으로도 함께 성장해나가고 싶습니다!

<br>

**🐮 조소정**

프로젝트 초반에는 아직 익숙하지 않은 React로 과연 다양한 기능을 구현할 수 있을지 많은 걱정이 있었습니다.
하지만 팀원들과 함께 주제 선정부터 디자인, 기능 구현까지 차근차근 진행해 나가면서 점차 완성도 높은 결과물이 만들어졌고, 그 과정을 통해 큰 뿌듯함과 성취감을 느낄 수 있었습니다.
개발 과정에서는 부족한 부분도 많았지만, 팀원들의 도움과 피드백 덕분에 React뿐만 아니라 API 설계, 협업 방식, axios, zustand, 웹 스토리지 활용 등 여러 기술에 대해 많이 배우는 시간이었습니다.
단순히 결과물을 만드는 데 그치지 않고, React에 대한 실질적인 경험과 함께 한 단계 성장 할 수 있었던 프로젝트였습니다.

<br>

**😎 김태연**

디자인부터 배포까지 팀원들과 힘을 합쳐 프로젝트를 성공적으로 마무리할 수 있어 정말 뿌듯했습니다. 1차 프로젝트에 비해 기간이 길고 중간중간 쉬는 날도 많아 자칫 나태해질 수 있었지만, 끝까지 집중하며 임하는 팀원들을 보며 저도 더 열심히 몰입할 수 있었습니다. 함께해 준 팀원들에게 진심으로 감사한 마음입니다.
다만, 한 가지 아쉬웠던 점은 맡은 기능에 집중하느라 다른 팀원들의 코드를 깊이 있게 살펴보지 못했다는 점입니다. 다양한 코드들을 참고했다면 더 재사용성 높고 효율적인 코드를 작성할 수 있었을 것 같아 아쉬움이 남습니다.
모두 고생 많으셨고, 앞으로도 함께 힘내며 좋은 결과 만들어가면 좋겠습니다!

<br>

**🥑 유강민**

이번 프로젝트에서는 게시물 생성 및 수정 기능을 맡아 구현했습니다. React를 활용한 첫 번째 프로젝트였던 만큼 부족한 점도 많았지만, 팀원들과 함께 문제를 공유하고 보완해 나가며 점점 나아지는 과정을 경험할 수 있었습니다. 특히, 상태 관리와 폼 처리, 그리고 컴포넌트 구조화를 고민하며 React 개발의 흐름을 처음으로 몸으로 익힐 수 있었던 값진 시간이었습니다. 무엇보다도 서로를 배려하며 협업했던 좋은 팀원들 덕분에 많이 배우고 성장할 수 있었습니다. 감사합니다!
