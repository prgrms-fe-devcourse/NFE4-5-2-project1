import React, { useEffect, useState } from 'react';
import profile from '../../assets/images/profile.svg';
import whiteFootPrint from '../../assets/icons/footprintWhite.svg';
import { axiosInstance } from '../../api/axios';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'react-toastify';

interface PostCommentsProps {
  postId: string; // 게시물 id
  comments: commentsObj[]; // 게시물 댓글 배열
}
interface commentsObj {
  _id: string;
  comment: string;
  author: { fullName: string; image: string };
}

export default function PostComments({ postId, comments }: PostCommentsProps) {
  const userId = useAuthStore((state) => state.userId);
  const [comment, setComment] = useState('');
  const [commentList, setCommentList] = useState<commentsObj[]>(comments);
  const [userFullname, setUserFullname] = useState('');
  const [userImage, setUserImage] = useState('');

  // 댓글창에 입력되고있는 댓글
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  // 유저 정보 불러오기
  const fetchUserinfo = async () => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      const fullname = response.data.fullName;
      const image = response.data.image;
      setUserFullname(fullname);
      setUserImage(image);
      console.log('유저 정보 가져오기 성공:', fullname, image);
      return { fullname, image };
    } catch (error) {
      console.error('유저 정보 가져오기 실패:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axiosInstance.get(`/posts/${postId}`);

        if (userId) {
          const userInfo = await fetchUserinfo();
          if (userInfo) {
            setUserFullname(userInfo.fullname);
            setUserImage(userInfo.image);
          }
        }
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      }
    };

    fetchData(); // 함수 호출
  }, [userId, postId]);

  useEffect(() => {
    if (userFullname && userImage) {
      console.log('값이 변경됨!');
      console.log('userFullname:', userFullname);
      console.log('userImage:', userImage);
      // 여기서 이 값들을 이용해 뭔가 작업 가능
    }
  }, [userFullname, userImage]);

  // 댓글 등록 버튼
  const commentHandler = async (fullname: string, image: string) => {
    if (!comment.trim()) return;

    // 낙관적 업데이트 -> 임시 댓글 객체
    const fakeComment: commentsObj = {
      _id: 'temp-' + Date.now(),
      comment: comment,
      author: {
        fullName: fullname,
        image: image,
      },
    };
    console.log(fakeComment);

    // 일단 화면에 댓글 추가
    setCommentList((prev) => {
      const updated = [...prev, fakeComment];
      console.log(updated);
      console.log(commentList);
      return updated;
    });

    // 입력창 초기화
    setComment('');

    try {
      // 서버에 진짜 댓글 달기
      const response = await axiosInstance.post('/comments/create', {
        postId,
        comment,
      });
      // 내가 새로 작성한 댓글내용
      // const realComment: commentsObj = response.data.comment;
      console.log('진짜댓글의 객체:', response.data);

      // setCommentList((prev) =>
      //   prev.map((c) => (c._id === fakeComment._id ? realComment : c))
      // );

      // 성공 시 → 임시 댓글을 진짜 댓글로 교체
      // setCommentList((prev) =>
      //   prev.map((c) => (c.comment === fakeComment.comment ? realComment : c))
      // );
    } catch (error) {
      console.error('댓글 작성 실패:', error);

      // 실패 시 → 임시 댓글 제거
      setCommentList((prev) =>
        prev.filter((c) => c.comment !== fakeComment.comment)
      );

      toast('댓글 작성에 실패했어요. 다시 시도해 주세요.');
    }
  };
  console.log(commentList);
  return (
    <>
      <div className="overflow-auto max-h-[450px] mt-[20px] ">
        {commentList.map((comment) => (
          <div key={comment._id} className="flex items-center gap-3 mb-2">
            <img
              src={comment.author.image || profile} // fallback으로 로그인 유저 이미지 사용 가능
              alt="user"
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-[var(--color-post-text)]">
                {comment.author.fullName}
              </p>
              <p className="font-medium text-[14px] text-[var(--color-post-text)]">
                {comment.comment}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-[20px]  justify-between border-t-1 border-[var(--color-border)] pt-[10px]">
        <input
          type="text"
          className=" px-[10px] w-[500px] text-[var(--color-post-text)] focus:outline-[var(--color-lightGray-focus)]"
          placeholder="발자국 남기기"
          value={comment}
          onChange={changeHandler}
        />
        <button
          className="bg-[var(--color-main-skyBlue)] w-[60px] h-[50px] flex justify-center items-center rounded-xl hover:bg-[var(--color-main-skyBlue-hover)] active:bg-[var(--color-main-skyBlue-active)] border-none"
          onClick={async () => {
            const userInfo = await fetchUserinfo();
            if (userInfo) {
              commentHandler(userInfo.fullname, userInfo.image);
            }
          }}
        >
          <img
            src={whiteFootPrint}
            alt="footprint"
            className="w-[30px] h-[30px]"
          />
        </button>
      </div>
    </>
  );
}
