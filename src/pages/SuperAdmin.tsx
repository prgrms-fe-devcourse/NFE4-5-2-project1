import deleteIcon from '../assets/icons/deleteIcon.png';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../api/axios';
import { toast } from 'react-toastify';

interface Channel {
  id: string;
  name: string;
}

export default function SuperAdmin() {
  //채널 목록 불러오기
  const [channels, setChannels] = useState<Channel[]>([]);

  //한글 두번쳐지는거 방지용
  const [isComposing, setIsComposing] = useState(false);

  // 채널 생성 상태
  const [isCreating, setIsCreating] = useState(false);
  const [ChannelName, setChannelName] = useState('');

  const getChannel = async () => {
    const { data } = await axiosInstance.get(`channels`);
    //필요한 id,name 추출
    const simplified = data.map((channel: { _id: string; name: string }) => ({
      id: channel._id,
      name: channel.name,
    }));
    setChannels(simplified);
  };

  // 채널 생성
  const createChannel = async () => {
    if (!ChannelName.trim()) {
      toast('채널 이름을 입력하세요.');
      return;
    }

    try {
      await axiosInstance.post('/channels/create', {
        name: ChannelName,
        authRequired: true,
      });
      toast.success('채널 생성 완료');
      setChannelName('');
      setIsCreating(false);
      getChannel();
    } catch (error) {
      console.error('채널 생성 실패:', error);
      toast.error('채널 생성 실패');
    }
  };

  const deleteChannel = async (channelId: String) => {
    try {
      const res = await axiosInstance.delete('/channels/delete', {
        data: {
          id: channelId,
        },
      });
      console.log('채널 삭제 성공:', res.data);
      toast.success('채널 삭제 완료');
      getChannel();
    } catch (error) {
      console.log('채널 삭제 실패:', error);
      toast.error('채널 삭제 실패');
    }
  };

  useEffect(() => {
    getChannel();
  }, []);

  return (
    <>
      <>
        <div className="ml-[130px] mt-[50px] text-[var(--color-auth-text)]">
          <section className="mb-[100px]">
            <h1 className="font-bold text-[32px] mb-[40px]">채널 관리</h1>
            <div className="flex">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className="w-[150px] h-[55px] border rounded-[10px] border-[var(--color-auth-channel-border)] text-[15px] font-semibold  items-center flex justify-center mr-[10px] relative"
                >
                  {channel.name}
                  <img
                    src={deleteIcon}
                    alt="deleteIcon"
                    className="absolute right-[-10px] top-[-10px] cursor-pointer hover:scale-[1.3]"
                    onClick={() => deleteChannel(channel.id)}
                  />
                </div>
              ))}

              {isCreating ? (
                <input
                  type="text"
                  autoFocus
                  value={ChannelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  onCompositionStart={() => setIsComposing(true)} // 한글 두번방지용
                  onCompositionEnd={() => setIsComposing(false)} // 한글 두번방지용
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (!isComposing) {
                        createChannel();
                      }
                    } else if (e.key === 'Escape') {
                      setIsCreating(false);
                      setChannelName('');
                    }
                  }}
                  className="w-[150px] h-[55px] border rounded-[10px] border-[#0F172A] text-[15px] font-semibold px-[10px] mr-[10px]"
                  placeholder="채널 이름 입력"
                />
              ) : (
                <div
                  onClick={() => setIsCreating(true)}
                  className="w-[150px] h-[55px] rounded-[10px]  bg-[#60B5FF] text-[#FCFDFF] text-[15px] font-semibold flex items-center justify-center mr-[10px] cursor-pointer transition-all duration-150 hover:scale-[1.1] hover:bg-[var(--color-main-blue-hover)]"
                >
                  채널 생성
                </div>
              )}
            </div>
          </section>
        </div>
      </>
    </>
  );
}
