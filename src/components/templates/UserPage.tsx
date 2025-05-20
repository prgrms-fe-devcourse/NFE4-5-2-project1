// src/pages/UserPage.tsx
import User from '../molecules/User';
import { useEffect, useState } from 'react';
import { getUserById } from '../../api/users';
import CommunityCard from '../molecules/CommunityCard';
import { getPostsByAuthor, getPostsByChannel } from '../../api/posts';
import { Link, Navigate, useLocation } from 'react-router-dom';
import QuestionCard from '../molecules/QuestionCard';
import { followUser, unfollowUser } from '../../api/follow';
import FloatingButton from '../atoms/FloatingButton';
import { createNotification } from '../../api/notifications';

// 변경: ChatWindow import 추가
import ChatWindow from '../organisms/ChatWindow'; // 변경: 채팅창 컴포넌트
// 변경: Conversation 타입 import 추가
import type { Conversation } from '../organisms/ChatList'; // 변경: 대화 타입
import { getAuthUser } from '../../api/auth';
import { useLoginStore } from '../../stores/loginStore';

// import PostCard from '../molecules/PostCard';
import { useMemo } from 'react';
import CommentCard from '../molecules/CommentCard';
import { AnimatePresence } from 'framer-motion';
import UserSkeleton from '../molecules/UserSleleton';
import CommunityCardSkeleton from '../molecules/CommunityCardSkeleton';

interface CommentItem {
  post: string;
  comment: string;
  _id: string;
}

export default function UserPage() {
  const [userInvalid, setUserInvalid] = useState(false);
  const [myInfo, setMyInfo] = useState<User | null>(); // 사용자 정보
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  const refetch = useLoginStore((state) => state.refetch);

  const [userDataLoading, setUserDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);
  const [channelPosts, setChannelPosts] = useState<Post[]>([]);
  const [channelError, setChannelError] = useState<string | null>(null);

  const [followCount, setFollowCount] = useState<number>(0);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [relationId, setRelationId] = useState<string | null>(null);

  const [commentData, setCommentData] = useState<
    { postId: string; comment: string; postTitle: string; commentId: string }[]
  >([]);

  const location = useLocation();
  // "/id", "/id/question", "/id/comments", "/id/liked"
  const parts = location.pathname.split('/');
  const id = parts[1];

  // 로그인 유저 id
  const loginUserId = localStorage.getItem('myId');
  // 로그인 유저와 path id 값 비교
  const isMe = loginUserId === id;

  //질문게시글 필터링
  const questionPosts = useMemo(
    () =>
      posts.filter(
        (post) =>
          post.channel.name === 'solved' || post.channel.name === 'unsolved',
      ),
    [posts],
  );

  // 변경: 채팅창 열림 상태 및 초기 대화 저장용 state 추가
  const [chatOpen, setChatOpen] = useState(false); // 변경: 채팅창 열림 상태
  const [initialConv, setInitialConv] = useState<Conversation | null>(null); // 변경: 초기 대화 저장 상태

  // 변경: "채팅 보내기" 버튼 클릭 시 호출할 핸들러 추가
  const handleStartChat = () => {
    if (!userData) return;
    // 1) Conversation 객체: chatRoomId를 곧바로 상대방 ID로 사용
    const conv: Conversation = {
      chatRoomId: id, // userId를 chatId로
      partner: {
        _id: userData._id,
        fullName: userData.fullName,
        image: userData.image, // 프로필 이미지
        status: userData.isOnline ? 'online' : 'offline',
      },
      lastMessage: { timestamp: Date.now() },
      unreadCount: 0,
    };
    // 2) 초기 대화 세팅 & ChatWindow 열기
    setInitialConv(conv);
    setChatOpen(true);
  };

  useEffect(() => {
    const getMyInfo = async () => {
      setMyInfo(await getAuthUser());
    };
    getMyInfo();
  }, [isLoggedIn, refetch]);

  useEffect(() => {
    async function loadUserData() {
      try {
        const data = await getUserById(id);
        //유효하지 않은 값 (role: SuperAdmin, !data_id)
        const notValid = data.role === 'SuperAdmin' || !data._id;

        if (notValid) {
          setUserInvalid(true);
          setUserDataLoading(false);
          return;
        }
        setUserData(data);
        setFollowerCount(data.followers.length ?? 0);
        setFollowCount(data.following.length ?? 0);

        const postsData = await getPostsByAuthor(id);
        setPosts(postsData);
      } catch (error: unknown) {
        if (error instanceof Error) setError(error.message);
      } finally {
        setUserDataLoading(false);
      }
    }
    loadUserData();
  }, [id, refetch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });

    async function postsOfEachChannel() {
      try {
        const [daily, develop, employ, recruit] = await Promise.all([
          getPostsByChannel('681d9fee7ffa911fa118e4b5'),
          getPostsByChannel('681da0077ffa911fa118e4ba'),
          getPostsByChannel('681da0247ffa911fa118e4be'),
          getPostsByChannel('681da0307ffa911fa118e4c2'),
        ]);
        const all = [...daily, ...develop, ...employ, ...recruit];
        const filtered = all.filter(
          (p) => p.author !== null || p.author !== '',
        );
        setChannelPosts(filtered);
      } catch (err) {
        console.error('게시물 로드 실패', err);
        setChannelError(
          '채널 게시물을 불러오는 중 네트워크 오류가 발생했습니다.',
        );
      }
    }
    postsOfEachChannel();
  }, []);

  useEffect(() => {
    if (userData && id) {
      const already = userData.followers.some((rel) => rel.user === id);
      setIsFollowing(already);
    }
  }, [userData, id]);

  //내가 단 댓글 가져오기
  useEffect(() => {
    if (!userData?.comments.length) {
      setCommentData([]);
      return;
    }

    const comments = userData.comments as unknown as CommentItem[];
    const allPosts = [...channelPosts, ...questionPosts];
    const combined = comments.map((c) => {
      const post = allPosts.find((p) => p._id === c.post);
      let titleText = '제목없음';
      if (post) {
        try {
          const parsed = JSON.parse(post.title);
          titleText = parsed.title ?? '제목없음';
        } catch {
          titleText = post.title;
        }
      }
      return {
        postId: c.post,
        postTitle: titleText,
        comment: c.comment,
        commentId: c._id,
      };
    });
    setCommentData(combined);
  }, [userData?.comments, channelPosts, questionPosts]);

  //[Follow]userData가 로드될 때 존재하는 팔로우 관계 찾아서 relationId 세팅
  // loginUserId : 로그인한 유저 id
  // userData: path id 값에서 가져온 useData

  useEffect(() => {
    if (!userData || !loginUserId) return;
    const followRel = userData.followers.find(
      (rel) => rel.follower === loginUserId,
    );
    setRelationId(followRel?._id ?? null);
    setIsFollowing(!!followRel);
  }, [userData, loginUserId]);

  //[Follow]relationId 가 바뀔 때마다 isFollowing 갱신
  useEffect(() => {
    setIsFollowing(relationId !== null);
  }, [relationId]);

  // 내 좋아요가 달린 포스트 필터링
  const likedPosts = channelPosts.filter((post) =>
    post.likes.some((like) => like.user === id),
  );
  const communityLiked = likedPosts.filter(
    (c) =>
      c.channel._id === '681d9fee7ffa911fa118e4b5' ||
      c.channel._id === '681da0077ffa911fa118e4ba' ||
      c.channel._id === '681da0247ffa911fa118e4be' ||
      c.channel._id === '681da0307ffa911fa118e4c2',
  );
  const questionLiked = likedPosts.filter(
    (q) => q.channel.name === 'solved' || q.channel.name === 'unsolved',
  );

  // 댓글 커뮤니티/질문 포스트 필터링
  const communityComments = commentData.filter((data) =>
    channelPosts.some((p) => p._id === data.postId),
  );
  const fileteredQuestionComments = commentData.filter((data) =>
    questionPosts.some((p) => p._id === data.postId),
  );
  //follow 핸들
  const handleFollow = async () => {
    try {
      if (relationId) {
        await unfollowUser(relationId);
        setFollowerCount((count) => count - 1);
        setRelationId(null);
      } else {
        const newRel = await followUser(id);
        await createNotification({
          notificationType: 'FOLLOW',
          notificationTypeId: newRel._id,
          userId: id,
        });
        setFollowerCount((count) => count + 1);
        setRelationId(newRel._id);
      }
      // setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error(err);
    }
  };

  if (userInvalid) return <Navigate to="*" replace />;
  if (error) return <Navigate to="*" replace />;
  // if (id === 'user') return <div>탈퇴한 회원입니다.</div>;
  if (channelError) return <div>{channelError}</div>;
  // if (myInfo?._id === '') return <Navigate to="*" />;
  return (
    <>
      {userDataLoading ? (
        <>
          <UserSkeleton />
        </>
      ) : (
        <>
          {!parts[2] && (
            <User
              name={userData!.fullName}
              followCount={followCount}
              followerCount={followerCount}
              imgUrl={userData!.image}
              email={userData!.email}
              techStack={
                userData!.username
                  ? (JSON.parse(userData!.username).tags ?? [])
                  : []
              }
              introduction={
                userData!.username
                  ? (JSON.parse(userData!.username).introduction ?? '')
                  : ''
              }
              github={
                userData!.username
                  ? (JSON.parse(userData!.username).github ?? '')
                  : ''
              }
              velog={
                userData!.username
                  ? (JSON.parse(userData!.username).velog ?? '')
                  : ''
              }
              homepage={
                userData!.username
                  ? (JSON.parse(userData!.username).homepage ?? '')
                  : ''
              }
              isMe={isMe}
              isLogin={isLoggedIn}
              isFollowing={isFollowing}
              followHandler={handleFollow}
            />
          )}
        </>
      )}

      {/* 내가 쓴 글 */}
      {userDataLoading ? (
        <div className="dark:text-dark-text mx-auto mb-[20px] flex w-[1128px] flex-wrap justify-start gap-4 pt-[17px]">
          {[...Array(8)].map((_, index) => (
            <CommunityCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          {!parts[2] && (
            <div className="dark:text-dark-text mx-auto mb-[20px] flex w-[1128px] flex-wrap justify-start gap-4 pt-[17px]">
              {posts.length === 0 ? (
                <div>아직 작성된 게시글이 없습니다.</div>
              ) : (
                posts
                  .filter(
                    (p) =>
                      p.channel._id === '681d9fee7ffa911fa118e4b5' ||
                      p.channel._id === '681da0077ffa911fa118e4ba' ||
                      p.channel._id === '681da0307ffa911fa118e4c2' ||
                      p.channel._id === '681da0247ffa911fa118e4be',
                  )
                  .map((post) => {
                    const like = myInfo?.likes?.find(
                      (like) => like.post === post._id,
                    );
                    const likeId = like ? like._id : null;

                    return (
                      <CommunityCard
                        key={post._id}
                        post={post}
                        likeId={likeId}
                      />
                    );
                  })
              )}
            </div>
          )}
        </>
      )}

      {/* 내가 한 질문 */}
      {parts[2] === 'question' && (
        <div className="dark:text-dark-text mb-[20px] flex w-[1128px] flex-col gap-4 pt-[22px]">
          {questionPosts.length === 0 ? (
            <div>아직 작성된 질문이 없습니다.</div>
          ) : (
            questionPosts.map((post) => {
              const like = myInfo?.likes?.find(
                (like) => like.post === post._id,
              );
              const likeId = like ? like._id : null;

              return (
                <QuestionCard key={post._id} post={post} likeId={likeId} />
              );
            })
          )}
        </div>
      )}

      {/* 내가 쓴 댓글  */}
      {parts[2] === 'comments' && (
        <div className="dark:text-dark-text mx-auto w-[1128px] pt-4 text-left">
          <p>
            커뮤니티
            <span className="text-[#3bb900]"> {communityComments.length}</span>
          </p>
        </div>
      )}
      {parts[2] === 'comments' && (
        <div className="nanum-gothic-regular dark:text-dark-text mx-auto flex w-[1128px] flex-wrap gap-[15px] pt-[5px]">
          {communityComments.length === 0 ? (
            <div>아직 댓글이 없습니다.</div>
          ) : (
            communityComments.map(({ postId, postTitle, comment }) => (
              <Link to={`/post/${postId}`} className="w-[100%]">
                <CommentCard title={postTitle} comment={comment}></CommentCard>
              </Link>
            ))
          )}
        </div>
      )}
      {parts[2] === 'comments' && (
        <div className="dark:text-dark-text mx-auto w-[1128px] pt-8 text-left">
          <p>
            질문{' '}
            <span className="text-[#3bb900]">
              {fileteredQuestionComments.length}
            </span>
          </p>
        </div>
      )}
      {parts[2] === 'comments' && (
        <div className="nanum-gothic-regular dark:text-dark-text mx-auto mb-[20px] flex w-[1128px] flex-wrap gap-[15px] pt-[5px]">
          {fileteredQuestionComments.length === 0 ? (
            <div>아직 댓글이 없습니다.</div>
          ) : (
            fileteredQuestionComments.map(({ postId, postTitle, comment }) => (
              <Link to={`/post/${postId}`} className="w-[100%]">
                <CommentCard title={postTitle} comment={comment}></CommentCard>
              </Link>
            ))
          )}
        </div>
      )}

      {/*  좋아요 누른 글 */}
      {parts[2] === 'liked' && (
        <div className="dark:text-dark-text mx-auto w-[1128px] pt-4 text-left">
          <p>
            커뮤니티{' '}
            <span className="text-[#3bb900]">{communityLiked.length}</span>
          </p>
        </div>
      )}
      {parts[2] === 'liked' && (
        <div className="nanum-gothic-regular dark:text-dark-text mx-auto flex w-[1128px] flex-wrap gap-[15px] pt-[5px]">
          {communityLiked.length === 0 ? (
            <div>아직 좋아요를 누른 글이 없습니다.</div>
          ) : (
            likedPosts.map((post) => {
              const like = myInfo?.likes?.find(
                (like) => like.post === post._id,
              );
              const likeId = like ? like._id : null;

              return (
                <CommunityCard key={post._id} post={post} likeId={likeId} />
              );
            })
          )}
        </div>
      )}
      {parts[2] === 'liked' && (
        <div className="dark:text-dark-text mx-auto w-[1128px] pt-4 text-left">
          <p className="justify-start pt-4">
            질문 <span className="text-[#3bb900]">{questionLiked.length}</span>
          </p>
        </div>
      )}
      {parts[2] === 'liked' && (
        <div className="nanum-gothic-regular dark:text-dark-text mx-auto mb-[20px] flex w-[1128px] flex-wrap gap-[15px] pt-[5px]">
          {questionLiked.length === 0 ? (
            <div>아직 좋아요를 누른 글이 없습니다.</div>
          ) : (
            questionLiked.map((post) => {
              const like = myInfo?.likes?.find(
                (like) => like.post === post._id,
              );
              const likeId = like ? like._id : null;

              return (
                <QuestionCard key={post._id} post={post} likeId={likeId} />
              );
            })
          )}
        </div>
      )}
      {!isMe && isLoggedIn && (
        <div
          className="fixed right-[10%] bottom-[5%] cursor-pointer"
          onClick={handleStartChat}
        >
          <FloatingButton buttonType="chat" />
        </div>
      )}
      <AnimatePresence>
        {/* 변경: 채팅창 모달 */}
        {chatOpen && initialConv && (
          <ChatWindow
            onClose={() => setChatOpen(false)} // 변경: 채팅창 닫기 핸들러
            initialConversation={initialConv} //바로 채팅창 보이게
          />
        )}
      </AnimatePresence>
    </>
  );
}
