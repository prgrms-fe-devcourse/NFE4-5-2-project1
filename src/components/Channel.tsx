import { useState, useEffect } from 'react';

import ChannelNav from '../components/channel/ChannelNav';
import { axiosInstance } from '../api/axios';

interface Channel {
  _id: string;
  name: string;
  description: string;
  authRequired: boolean;
}

export default function Channel() {
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    async function fetchChannels() {
      try {
        const res = await axiosInstance.get('/channels');
        setChannels(res.data);
      } catch (err) {
        console.error('채널 가져오기 실패:', err);
      }
    }

    fetchChannels();
  }, []);

  return (
    <>
      {/* 게시글 윗부분 */}
      <div className="flex justify-center">
        <div className="flex flex-col  max-w-[1200px] w-[full]">
          <ChannelNav channels={channels} />
        </div>
      </div>
    </>
  );
}
