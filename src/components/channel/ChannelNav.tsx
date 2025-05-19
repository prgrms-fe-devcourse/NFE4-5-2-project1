import { useEffect, useState } from 'react';
import ChannelList from './ChannelList';
import Post from './Post';
import { axiosInstance } from '../../api/axios';

interface Channel {
  _id: string;
  name: string;
}

interface ChannelNavProps {
  channels: Channel[];
}

interface Post {
  _id: string;
  title: string; // JSON string 형태
  createdAt: string;
  likes: any[];
  comments: any[];
  author: {
    _id: string;
    fullName: string;
    image: string;
  };
  image: string;
}

export default function ChannelNav({ channels }: ChannelNavProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  // 필터 조건 상태
  const [filters, setFilters] = useState<{ cost?: number; location?: string }>(
    {}
  );

  // 필터링 함수
  const handleFilterChange = (newFilters: {
    cost?: number;
    location?: string;
  }) => {
    setFilters(newFilters);
  };

  // 필터된 게시글
  const filteredPosts = posts.filter((post) => {
    try {
      const parsedTitle = JSON.parse(post.title);

      // 비용 필터 (해당 금액 이상)
      if (filters.cost !== undefined && parsedTitle.cost !== undefined) {
        if (parsedTitle.cost > filters.cost) return false;
      }

      // 장소 필터 (부분 문자열 포함)
      const locationFilter = filters.location;
      if (locationFilter && Array.isArray(parsedTitle.locations)) {
        const match = parsedTitle.locations.some((loc: string) =>
          loc.includes(locationFilter)
        );
        if (!match) return false;
      }

      return true;
    } catch (error) {
      console.error('게시글 title 파싱 실패:', post.title);
      return false;
    }
  });

  // 채널 게시글 불러오기
  const showChannel = async (channelId: string) => {
    try {
      const res = await axiosInstance.get(`/posts/channel/${channelId}`);
      setPosts(res.data);
      setSelectedChannel(channelId);
    } catch (error) {
      console.error('채널 게시글을 불러오지 못했습니다.', error);
    }
  };

  // 1박2일 채널 자동 선택
  useEffect(() => {
    if (channels.length > 0) {
      const defaultChannel = channels.find(
        (channel) => channel.name === '1박2일'
      );
      if (defaultChannel) {
        showChannel(defaultChannel._id);
      }
    }
  }, [channels]);

  return (
    <>
      {/* 채널 선택 + 필터 UI */}
      <ChannelList
        channels={channels}
        onSelect={showChannel}
        selectedChannelId={selectedChannel}
        onFilterChange={handleFilterChange} // ✅ 필터 변경 함수 전달
      />

      {/* 필터링된 게시글 출력 */}
      <div className="flex-col items-center justify-center">
        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">게시글이 없습니다.</p>
        ) : (
          filteredPosts.map((post) => <Post key={post._id} post={post} />)
        )}
      </div>
    </>
  );
}
