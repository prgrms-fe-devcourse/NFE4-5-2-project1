import menuIcon from '../../assets/images/menu/menu-icon.svg';
import menuIconWhite from '../../assets/images/menu/menu-icon-white.svg';
import userImg from '../../assets/images/header/user-img.svg';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Link, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import CheckDeleteModal from './CheckDeleteModal';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';
import getElapsedTime from '../../utils/getDatetime';

// updateReloadTrigger 타입 추가
interface CommentListItemProps extends Comment {
  updateReloadTrigger: () => void;
  theme: Theme;
}

export default function CommentListItem({
  _id,
  comment,
  author,
  createdAt,
  updateReloadTrigger,
  theme,
}: CommentListItemProps) {
  const params = useParams();
  const channel = params.channelId;

  // 로그인한 사용자 정보 받아오기
  const user = useAuthStore((state) => state.user);

  // 삭제 모달을 나타내는 div 요소
  const modalRef = useRef<HTMLDivElement | null>(null);

  // 해당 댓글 작성자 여부 상태
  const [isUser, setIsUser] = useState(false);
  // 삭제 모달 상태
  const [isOpen, setIsOpen] = useState(false);
  const clickMenuHandler = () => {
    setIsOpen(!isOpen);
  };
  // 삭제할 건지 한 번 더 물어보는 모달 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 코드 블록 스타일 적용하기
  const editCodeStyle = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const codes = doc.querySelectorAll('pre');
    const codeStr = '<span>&lt;/&gt;</span>';
    codes.forEach((code) => {
      code.style.backgroundColor = dark(theme) ? '#1e1e1e' : '#ececec';
      code.style.color = dark(theme) ? '#ffffff' : '#111111';
      code.style.padding = '20px';
      code.style.paddingTop = '2px';
      code.style.marginTop = '10px';
      code.style.marginBottom = '10px';
      code.style.borderRadius = '8px';
      code.innerHTML = codeStr + '<br/><br/>' + code.innerHTML;

      const span = code.querySelector('span');
      span!.style.fontSize = '12px';
      span!.style.opacity = '30%';
      span!.style.marginLeft = '-10px';
    });

    return doc.body.innerHTML;
  };

  // 로그인한 사용자가 해당 댓글 작성자인지 확인
  const checkCommentUser = useCallback(() => {
    if (author._id === user?._id) {
      setIsUser(true);
    }
  }, [author._id, user?._id]);

  // 삭제 버튼 클릭 시, 삭제할 건지 한 번 더 물어보는 모달 띄우기
  const clickDeleteHandler = () => {
    setIsDeleteModalOpen(true);
  };

  // 삭제할 건지 한 번 더 물어보는 모달 닫기
  const closeDeleteModalHanlder = () => {
    setIsDeleteModalOpen(false);
  };

  // 삭제 모달 닫기
  const closeHandler = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (user) {
      checkCommentUser();
    }
  }, [user, checkCommentUser]);

  // 삭제 모달 밖 영역 클릭 시, 모달 닫기
  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeHandler();
      }
    };

    window.addEventListener('mousedown', clickHandler);
    return () => window.removeEventListener('mousedown', clickHandler);
  }, [modalRef]);

  return (
    <>
      <div
        className={`h-auto rounded-[5px] border border-[#b4b4b4] mx-7 mb-[30px] relative ${
          dark(theme)
            ? 'bg-[#2d2d2d] text-[#ffffff]'
            : 'bg-[#ffffff] text-[#111111]'
        }`}
      >
        <div className="flex justify-between pt-2.5">
          <div className="flex items-center gap-3 pl-4 pt-1">
            <Link
              to={`/profile`}
              state={{ userid: author?._id }}
              className="flex items-center gap-2"
            >
              <img
                src={author.image ? author.image : userImg}
                alt="사용자"
                className="w-9 h-9 rounded-full"
              />
              <span className="text-[13px] font-semibold">
                {author.fullName}
              </span>
            </Link>
            <span className="text-[11px] opacity-60 font-light">
              {getElapsedTime(createdAt)}
            </span>
          </div>
          {/* 로그인한 사용자 id 값과 해당 댓글 작성자 id 값이 일치할 경우 */}
          {isUser && (
            <>
              <div
                onClick={clickMenuHandler}
                className="w-9 h-9 pr-2.5 cursor-pointer"
              >
                <img src={dark(theme) ? menuIconWhite : menuIcon} />
              </div>
              {isOpen && (
                <div
                  className={`flex justify-center items-center text-[12px] text-[#FF0404] rounded-[2px] w-[91px] h-[34px]  cursor-pointer absolute top-8 right-4 ${
                    dark(theme)
                      ? 'bg-[#2d2d2d] border border-white/40'
                      : 'border border-[#e5e5e5]'
                  }`}
                  onClick={clickDeleteHandler}
                  ref={modalRef}
                >
                  삭제하기
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col">
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                editCodeStyle(JSON.parse(comment).content)
              ),
            }}
            className="py-[11px] px-4 text-sm font-normal"
          />
        </div>
        <div className="flex justify-end items-center gap-1.5 px-4 pb-3"></div>
      </div>
      {isDeleteModalOpen && (
        <CheckDeleteModal
          type="COMMENT"
          channel={String(channel)}
          _id={_id}
          closeDeleteModalHanlder={closeDeleteModalHanlder}
          theme={theme}
          updateReloadTrigger={updateReloadTrigger}
        />
      )}
    </>
  );
}
