import api from './index';

// 채널별 포스트
export const getPostsByChannel = (
  channelId: string,
  offset?: number,
  limit?: number,
) =>
  api
    .get(`/posts/channel/${channelId}`, { params: { offset, limit } })
    .then((res) => res.data);

// 작성자별 포스트
export const getPostsByAuthor = (
  authorId: string,
  offset?: number,
  limit?: number,
) =>
  api
    .get(`/posts/author/${authorId}`, { params: { offset, limit } })
    .then((res) => res.data);

// 포스트 생성 (FormData)
// title필드 하나만 보내고 거기서 제목과 본문을 같이 담는방식
// JSON.stringify로 두 값을 묶어서 보내고 가져올 때 JSON.parse 해서 분리하는 방식 이용해야함
// 예제코드
// 전송할 때 (createPost 래퍼 내부)
// const payload = JSON.stringify({
//   title: "글의 제목",
//   body: "이곳이 본문입니다."
// });
// form.append("title", payload);
// 조회 후 분리하기
// const post = await getPost(postId);
// post.title === '{"title":"글의 제목","body":"이곳이 본문입니다."}' 형태로 옴

// let parsed;
// try {
//   parsed = JSON.parse(post.title);
// } catch {
//   parsed = { title: post.title, body: "" };
// }

// console.log(parsed.title); // "글의 제목"
// console.log(parsed.body);  // "이곳이 본문입니다."

export const createPost = (
  title: string, // 제목
  body: string, // 내용
  channelId: string, //게시판 id
  tags?: string[], // 태그
  imageFile?: File, // 이미지
) => {
  // 제목+본문+태그를 합쳐 JSON 문자열로 만든다
  const payloadObj: { title: string; body: string; tags?: string[] } = {
    title,
    body,
  };
  if (tags !== undefined) {
    payloadObj.tags = tags;
  }
  const payload = JSON.stringify(payloadObj);

  const form = new FormData();
  form.append('title', payload);
  form.append('channelId', channelId);
  if (imageFile) {
    form.append('image', imageFile);
  }

  return api
    .post('/posts/create', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
};

// 포스트 상세
export const getPost = (postId: string) =>
  api.get(`/posts/${postId}`).then((res) => res.data);

// 포스트 수정 (FormData) → tags 필드 추가
export const updatePost = (
  postId: string,
  title: string,
  body: string,
  channelId: string,
  tags?: string[], // 선택
  imageFile?: File, // 선택
  imageToDeletePublicId?: string,
) => {
  // 제목+본문+태그를 합쳐 JSON 문자열로 만든다
  const payloadObj: { title: string; body: string; tags?: string[] } = {
    title,
    body,
  };
  if (tags !== undefined) {
    payloadObj.tags = tags;
  }
  const payload = JSON.stringify(payloadObj);

  const form = new FormData();
  form.append('postId', postId);
  form.append('title', payload);
  form.append('channelId', channelId);
  if (imageFile) {
    form.append('image', imageFile);
  }
  if (imageToDeletePublicId) {
    form.append('imageToDeletePublicId', imageToDeletePublicId);
  }

  return api
    .put('/posts/update', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
};
// 포스트 삭제
export const deletePost = (id: string) =>
  api.delete('/posts/delete', { data: { id } }).then((res) => res.data);
