import { useEffect, useState } from "react";
import { Post } from "../features/community/types/Post";
import { axiosInstance } from "../apis/axiosInstance";

export default function usePostsByChannel(channelId: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get(`/posts/channel/${channelId}`);
        setPosts(response.data);
      } catch (e) {
        console.error("Failed to Fetch Data:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [channelId]);
  return { posts, setPosts, loading };
}
