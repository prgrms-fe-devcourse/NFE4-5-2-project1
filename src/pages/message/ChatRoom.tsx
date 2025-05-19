import { useCallback, useEffect, useRef, useState } from 'react';
import ChatHeader from './ChatHeader';
import {
  getMessages,
  postMessages,
  putMessageSeen,
} from '../../api/message/message';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useAuthStore } from '../../stores/authStore';
import messageSendBtn from '../../assets/images/message/message-send-btn.svg';
import messageSendBtnWhite from '../../assets/images/message/message-send-btn-white.svg';
import userImage from '../../assets/images/profile/default-profile-img.jpg';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';

interface ChatRoomProps {
  user: User;
  onBack: () => void;
  onClose: () => void;
  theme: Theme;
}

// 한국어로 요일을 나타내기 위한 변환
dayjs.locale('ko');

export default function ChatRoom({
  user,
  onBack,
  onClose,
  theme,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  // 메시지 전송한 후, 화면을 리렌더링하기 위한 트리거
  const [reloadTrigger, setReloadTrigger] = useState(0);
  // 스크롤 아래로 내려가는 조건 상태
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 로그인한 사용자 정보 받아오기
  const loginUser = useAuthStore((state) => state.user);

  // 메시지 전송 후, 다음 줄로 넘어가면 스크롤도 따라가기 위한 div 요소
  const bottomRef = useRef<HTMLDivElement | null>(null);
  // 채팅방 들어오면 메시지 입력창에 포커스 되도록 하기 위한 input 요소
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 입력한 내용이 존재할 시 메시지 전송하기
  const handleSend = () => {
    if (newMessage.trim() === '') return;
    createNewMessage();
  };

  // 엔터 입력 시에도 메시지 전송하기
  let lastEnterTime = 0;
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 0.5초 이내 재입력 무시
      const now = Date.now();
      if (now - lastEnterTime < 500) return;

      lastEnterTime = now;

      e.preventDefault();
      handleSend();
    }
  };

  // 메시지 전송 시간 포맷 설정
  const getWriteDatetimeFormat = (createdAt: string) => {
    const date = dayjs(createdAt);
    return date.format('HH:mm');
  };

  // 메시지 전송하기
  const createNewMessage = async () => {
    try {
      await postMessages(newMessage, user._id);
      setReloadTrigger((reloadTrigger) => reloadTrigger + 1);
      setShouldScrollToBottom(true);

      setNewMessage('');
    } catch (e) {
      console.log(e instanceof Error && e.message);
    }
  };

  // 채팅방 입장 시 메시지 읽음 처리하기
  const readUserMessages = useCallback(async () => {
    try {
      await putMessageSeen(user._id);
    } catch (e) {
      console.log(e instanceof Error && e.message);
    }
  }, [user._id]);

  // 메시지 기록 가져오기
  const getUserMessages = useCallback(async () => {
    try {
      const { data } = await getMessages(user._id);
      setMessages(data);
      setShouldScrollToBottom(true);

      // 채팅방 들어오거나 메시지 전송 후, 메시지 입력창에 포커스
      inputRef.current?.focus();
      setIsLoading(false);
    } catch (e) {
      console.log(e instanceof Error && e.message);
    }
  }, [user._id]);

  // 상대방이 보내는 메시지 실시간으로 채팅방에 보여주고 읽음 처리하기
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await readUserMessages();
        const { data } = await getMessages(user._id);
        setMessages(data);
        setShouldScrollToBottom(false);
      } catch (e) {
        console.error(e instanceof Error ? e.message : e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [user._id, readUserMessages]);

  useEffect(() => {
    readUserMessages();
    getUserMessages();
  }, [reloadTrigger, getUserMessages, readUserMessages]);

  // 채팅방 들어왔을 때와 메시지 전송했을 때, 가장 최신 메시지를 화면에 보여주기
  useEffect(() => {
    if (bottomRef && shouldScrollToBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
      setShouldScrollToBottom(false);
    }
  }, [reloadTrigger, bottomRef, messages, shouldScrollToBottom]);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        userName={user.fullName}
        onBack={onBack}
        onClose={onClose}
        theme={theme}
      />

      {/* 대화 내용 */}
      {isLoading ? (
        <></>
      ) : (
        <>
          <div
            className={`flex-1 overflow-y-auto p-2 font-normal px-[16px] space-y-3 messageBox ${
              dark(theme) ? 'bg-[#2d2d2d] text-[#ffffff]' : 'text-[#111111]'
            }`}
          >
            {messages.map((msg, idx) => {
              const isMyMessage: boolean = msg.sender._id === loginUser?._id;

              const currentDate = dayjs(msg.createdAt).format('YYYY-MM-DD');
              const prevDate =
                idx > 0
                  ? dayjs(messages[idx - 1].createdAt).format('YYYY-MM-DD')
                  : null;
              const isNewDate = currentDate !== prevDate;

              return (
                <>
                  {isNewDate && (
                    <p className="text-center font-medium text-[13px] mt-[10px] mb-[30px]">
                      {dayjs(msg.createdAt).format('YYYY.MM.DD (dd)')}
                    </p>
                  )}

                  {isMyMessage ? (
                    <div key={msg._id} className="flex justify-end">
                      {/* 읽음 표시 + 시간 */}
                      <div className="flex flex-col justify-end items-end mr-2 text-[12px] font-normal">
                        {!msg.seen && (
                          <span
                            className={`font-semibold ${
                              dark(theme) ? 'text-[#ffffff]' : 'text-[#1E293B]'
                            }`}
                          >
                            1
                          </span>
                        )}
                        <span
                          className={` ${
                            dark(theme)
                              ? 'text-[#ffffff]/50'
                              : 'text-[#111111]/50'
                          }`}
                        >
                          {getWriteDatetimeFormat(msg.createdAt)}
                        </span>
                      </div>
                      {/* 메시지 내용 */}
                      <div
                        className={`text-[14px] p-2.5 rounded-b-[10px] rounded-tl-[10px] max-w-[300px] break-words pl-3 w-fit ${
                          dark(theme)
                            ? 'bg-[#a5d7db] text-[#111111]'
                            : 'bg-[#1E293B] text-white'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ) : (
                    <div key={msg._id} className="flex">
                      {/* 프로필 이미지 */}
                      <div className="">
                        <img
                          src={msg.sender.image ? msg.sender.image : userImage}
                          alt="상대 프로필"
                          className="w-[35px] h-[35px] rounded-[50%] border border-[#ddd]"
                        />
                      </div>
                      {/* 이름 + 메시지 내용 */}
                      <div className="flex flex-col ml-[5px] pt-1.5">
                        <div className="font-normal text-[12px] mb-[5px] ml-[2px] w-fit">
                          {msg.sender.fullName}
                        </div>
                        <div className="flex">
                          <div
                            className={`text-[14px] p-2.5 rounded-b-[10px] rounded-tr-[10px] max-w-[300px] break-words pl-3 w-fit ${
                              dark(theme)
                                ? 'bg-[#ffffff] text-[#111111]'
                                : 'bg-[#ECECEC] text-[#111111]'
                            }`}
                          >
                            {msg.message}
                          </div>
                          <div className="flex justify-end items-end ml-2 text-[12px] font-normal">
                            <span
                              className={` ${
                                dark(theme)
                                  ? 'text-[#ffffff]/50'
                                  : 'text-[#111111]/50'
                              }`}
                            >
                              {getWriteDatetimeFormat(msg.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })}
            <div ref={bottomRef}></div>
          </div>

          {/* 메시지 입력 */}
          <div
            className={`flex p-4 rounded-b-[5px] ${
              dark(theme)
                ? 'bg-[#2d2d2d] border-t border-t-white/40'
                : 'bg-[#ffffff] border-t border-t-[#DEDEDE]'
            }`}
          >
            <input
              type="text"
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full h-[50px] p-1 pl-[18px] rounded-[5px] bg-[#ECECEC] font-normal placeholder-[#898FA3] outline-none text-[14px] ${
                dark(theme) ? 'text-[#111111]' : ''
              }`}
              placeholder="메시지를 입력해주세요..."
            />
            <img
              src={`${dark(theme) ? messageSendBtnWhite : messageSendBtn}`}
              className="ml-[12px] w-[50px] h-[50px] rounded-[5px] cursor-pointer"
              onClick={handleSend}
            />
          </div>
        </>
      )}
    </div>
  );
}
