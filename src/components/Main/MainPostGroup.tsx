import { useEffect, useState, useOptimistic, startTransition } from "react";
import MainPostList from "./MainPostList";
import axios from "axios";
import { KBONewsTypes, Post } from "../../types/postType";
import MainTitle from "./MainTitle";
import { useNewAndHotPostStore } from "../../stores/newAndHotPostStore";

const NEW_POST_API_URL = import.meta.env.VITE_API_NEW_POST;
const HOT_POST_API_URL = import.meta.env.VITE_API_HOT_POST;
const KBO_NEWS_API_URL = import.meta.env.VITE_API_NEWS;

const SkeletonPost = () => (
  <div className="animate-pulse space-y-3 p-3">
    <div className="h-5 dark:bg-gray-500 bg-gray-200 rounded w-3/4"></div>
  </div>
);

const SkeletonList = ({
  title,
  color = "#FF9500",
  count = 8,
}: {
  title: string;
  color?: string;
  count?: number;
}) => (
  <div className="">
    <div className="">
      <MainTitle title={title} color={color} />
    </div>
    <div className="mt-10">
      {[...Array(count)].map((_, index) => (
        <SkeletonPost key={index} />
      ))}
    </div>
  </div>
);

export default function MainPostGroup() {
  const { setNewPostList, setHotPostList, getNewPostList, getHotPostList } =
    useNewAndHotPostStore();
  const [isLoading, setIsLoading] = useState(true);
  const [newPost, setNewPost] = useState<Post[]>([]);
  const [hotPost, setHotPost] = useState<Post[]>([]);
  const [kboNews, setKboNews] = useState<KBONewsTypes[]>([]);

  const [optimisticNewPost, updateOptimisticNewPost] = useOptimistic(
    newPost,
    (_, newPost: Post[]) => newPost
  );

  const [optimisticHotPost, updateOptimisticHotPost] = useOptimistic(
    hotPost,
    (_, hotPost: Post[]) => hotPost
  );

  const [optimisticKboNews, updateOptimisticKboNews] = useOptimistic(
    kboNews,
    (_, kboNews: KBONewsTypes[]) => kboNews
  );

  const fetchNewPost = async () => {
    try {
      const res = await axios.get(NEW_POST_API_URL);
      if (res.status === 200) {
        startTransition(() => {
          updateOptimisticNewPost(res.data);
        });
        setNewPost(res.data);
        setNewPostList(res.data);
      } else {
        setNewPost(getNewPostList());
        console.error("Error fetching new post:", res.status);
      }
    } catch (error) {
      console.error("Error fetching new post:", error);
    }
  };

  const fetchHotPost = async () => {
    try {
      const res = await axios.get(HOT_POST_API_URL);
      if (res.status === 200) {
        startTransition(() => {
          updateOptimisticHotPost(res.data);
        });
        setHotPost(res.data);
        setHotPostList(res.data);
      } else {
        setHotPost(getHotPostList());
        console.error("Error fetching hot post:", res.status);
      }
    } catch (error) {
      console.error("Error fetching hot post:", error);
    }
  };

  const fetchKboNews = async () => {
    try {
      const res = await axios.get(KBO_NEWS_API_URL);
      if (res.status === 200) {
        startTransition(() => {
          updateOptimisticKboNews(res.data.row);
        });
        setKboNews(res.data.row);
      } else {
        console.error("Error fetching kbo news:", res.status);
      }
    } catch (error) {
      console.error("Error fetching kbo news:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchNewPost(), fetchHotPost(), fetchKboNews()]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="col-span-1">
          <SkeletonList title="인기글" />
        </div>
        <div className="col-span-1">
          <SkeletonList title="최신글" />
        </div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <SkeletonList title="주요 소식" color="#0033A0" count={5} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="col-span-1">
        <MainPostList title="인기글" list={optimisticHotPost} />
      </div>
      <div className="col-span-1">
        <MainPostList title="최신글" list={optimisticNewPost} />
      </div>
      <div className="col-span-1 sm:col-span-2 lg:col-span-1">
        {optimisticKboNews.length !== 0 && (
          <MainPostList
            title="주요 소식"
            listId="news"
            list={optimisticKboNews}
          />
        )}
      </div>
    </>
  );
}
