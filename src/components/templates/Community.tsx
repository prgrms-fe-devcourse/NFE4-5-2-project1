import CommunityCard from '../molecules/CommunityCard';
import { getPostsByChannel } from '../../api/posts';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FloatingButton from '../atoms/FloatingButton';
import { getAuthUser } from '../../api/auth';
import { useLoginStore } from '../../stores/loginStore';
import CommunityCardSkeleton from '../molecules/CommunityCardSkeleton';
import { toast } from 'react-toastify';

export default function Community() {
  const location = useLocation(); // subChannel
  const [posts, setPosts] = useState<Post[]>([]); // 출력할 posts
  const [daily, setDaily] = useState<Post[]>([]);
  const [develop, setDevelop] = useState<Post[]>([]);
  const [employ, setEmploy] = useState<Post[]>([]);
  const [recruit, setRecruit] = useState<Post[]>([]);
  const [myInfo, setMyInfo] = useState<User | null>(); // 사용자 정보
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  const refetch = useLoginStore((state) => state.refetch);

  /* 최초 실행때 myInfo 저장, fetch Post */
  useEffect(() => {
    const getMyInfo = async () => {
      setMyInfo(await getAuthUser());
    };
    getMyInfo();

    const fetchPosts = async () => {
      setDaily(await getPostsByChannel('681d9fee7ffa911fa118e4b5'));
      setDevelop(await getPostsByChannel('681da0077ffa911fa118e4ba'));
      setEmploy(await getPostsByChannel('681da0247ffa911fa118e4be'));
      setRecruit(await getPostsByChannel('681da0307ffa911fa118e4c2'));

      setIsLoading(false);
    };
    fetchPosts();
  }, [isLoggedIn, refetch]);
  /* subChannel에 따라 fetch */
  useEffect(() => {
    switch (location.pathname) {
      case '/community': {
        setPosts(
          [...daily, ...develop, ...employ, ...recruit].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
        break;
      }
      case '/community/daily': {
        setPosts(daily);
        break;
      }
      case '/community/develop': {
        setPosts(develop);
        break;
      }
      case '/community/employ': {
        setPosts(employ);
        break;
      }
      case '/community/recruit': {
        setPosts(recruit);
        break;
      }
    }
  }, [location.pathname, daily, develop, employ, recruit]);

  return (
    <>
      <div className="wrapper card-list">
        {isLoading ? (
          [...Array(16)].map((_, index) => (
            <CommunityCardSkeleton key={index} />
          ))
        ) : (
          <>
            {posts.length !== 0 ? (
              posts.map((post) => {
                const like = myInfo?.likes?.find(
                  (like) => like.post === post._id,
                );
                const likeId = like ? like._id : null;

                return (
                  <CommunityCard key={post._id} post={post} likeId={likeId} />
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
