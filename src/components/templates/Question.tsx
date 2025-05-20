import QuestionCard from '../molecules/QuestionCard';
import { getPostsByChannel } from '../../api/posts';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FloatingButton from '../atoms/FloatingButton';
import { getAuthUser } from '../../api/auth';
import { useLoginStore } from '../../stores/loginStore';
import { toast } from 'react-toastify';
import QuestionCardSkeleton from '../molecules/QuestionCardSkeleton';

export default function Question() {
  const location = useLocation(); // subChannel
  const [posts, setPosts] = useState<Post[]>([]); // 출력할 posts
  const [solved, setSolved] = useState<Post[]>([]); // 출력할 posts
  const [unsolved, setUnsolved] = useState<Post[]>([]); // 출력할 posts
  const [myInfo, setMyInfo] = useState<User | null>(); // 사용자 정보
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  const refetch = useLoginStore((state) => state.refetch);
  const [isLoading, setIsLoading] = useState(true);

  /* 최초 실행때 myInfo 저장 */
  useEffect(() => {
    const getMyInfo = async () => {
      setMyInfo(await getAuthUser());
    };
    getMyInfo();
  }, [isLoggedIn, refetch]);

  /* subChannel에 따라 fetch */
  useEffect(() => {
    /* 포스트 fetch 메소드 */
    const fetchPosts = async () => {
      setSolved(await getPostsByChannel('681da03c7ffa911fa118e4c6'));
      setUnsolved(await getPostsByChannel('681da0447ffa911fa118e4ca'));

      setIsLoading(false);
    };
    fetchPosts();

    switch (location.pathname) {
      case '/question': {
        setPosts(
          [...solved, ...unsolved].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
        break;
      }
      case '/question/unsolved': {
        setPosts(unsolved);
        break;
      }
      case '/question/solved': {
        setPosts(solved);
        break;
      }
    }
  }, [location.pathname, solved, unsolved]);

  return (
    <>
      <div className="wrapper card-list dark:text-dark-text">
        {isLoading ? (
          [...Array(5)].map((_, index) => <QuestionCardSkeleton key={index} />)
        ) : (
          <>
            {posts.length !== 0 ? (
              posts.map((post) => {
                const like = myInfo?.likes?.find(
                  (like) => like.post === post._id,
                );
                const likeId = like ? like._id : null;

                return (
                  <QuestionCard key={post._id} post={post} likeId={likeId} />
                );
              })
            ) : (
              <p className="nanum-gothic-regular text-base text-[#ababab]">
                앗! 아직 작성된 게시물이 없어요!
              </p>
            )}
          </>
        )}
      </div>
      {isLoggedIn ? (
        <>
          <Link to="/writer" className="fixed right-[10%] bottom-[5%]">
            <FloatingButton buttonType="write" />
          </Link>
        </>
      ) : (
        <>
          <div
            className="fixed right-[10%] bottom-[5%]"
            onClick={() => {
              toast.info('로그인 후에 이용해주세요.');
            }}
          >
            <FloatingButton buttonType="write" />
          </div>
        </>
      )}
    </>
  );
}
