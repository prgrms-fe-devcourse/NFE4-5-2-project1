import { useEffect, useState } from 'react';
import { useChannelItemStore } from '../../stores/channelStore';
import { getPopularPostData } from '../../api/post/post';
import PostListItem from '../post/PostListItem';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';
import PopularPostCkeleton from './PopularPostCkeleton';

export default function PopularPost({ theme }: { theme: Theme }) {
  const { channels, fetchChannels } = useChannelItemStore();
  const [activeTab, setActiveTab] = useState(0);
  const [sortPopulars, setSortPopulars] = useState<Post[]>([]);
  const [isLoading, setLoading] = useState(true);

  const tabClickHandler = async (channelId: string, index: number) => {
    setLoading(true);
    setActiveTab(index);
    try {
      const data = await getPopularPostData(channelId);
      setSortPopulars(data.slice(0, 2));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  useEffect(() => {
    if (channels.length > 0) {
      tabClickHandler(channels[0].id, 0);
    }
  }, [channels]);

  return (
    <>
      <div
        className={`w-full rounded-[10px] px-[30px] py-[25px] pt-[20px] shadow-md ${
          dark(theme) ? 'bg-[#2d2d2d]' : 'bg-[#ffffff]'
        }`}
      >
        <h3
          className={`font-semibold  text-[20px] mb-[15px] ${
            dark(theme) ? 'text-[#acacaa]' : 'text-[#595956]'
          }`}
        >
          Popular Posts
        </h3>
        <ul className='flex relative gap-x-5 gap-y-2.5 mb-4.5 flex-wrap'>
          {channels.map((channel, index) => (
            <li
              key={`tab-${index}`}
              role='tab'
              aria-selected={activeTab === index}
              aria-controls={`panel-${index}`}
              id={`tab-${index}`}
            >
              <button
                className={`bg-[#E3E3E3] text-white rounded-[10px] w-[123px] h-[40px] text-[13px] cursor-pointer duration-300 font-semibold`}
                onClick={() => {
                  tabClickHandler(channel.id, index);
                }}
                style={{
                  backgroundColor:
                    activeTab === index
                      ? dark(theme)
                        ? index === 0
                          ? '#19A9BE'
                          : index === 1
                          ? '#3380DE'
                          : '#9E68E9'
                        : channel.colorLight
                      : dark(theme)
                      ? '#4B4B4B'
                      : '#E3E3E3',
                  color: activeTab === index ? '#fff' : '#6A6A6A',
                  fontWeight: activeTab === index ? 'bold' : 'normal',
                  boxShadow:
                    activeTab === index ? '0px 2px 3px rgba(0, 0, 0, 0.2)' : '',
                }}
              >
                {channel.name}
              </button>
            </li>
          ))}
        </ul>
        <div className={`${dark(theme) ? 'dark' : ''}`}>
          {channels.map((_, cIndex) => (
            <div
              className='tab-content flex gap-x-7 gap-y-5 flex-wrap min-h-[284px] relative'
              key={`panel-${cIndex}`}
              role='tabpanel'
              hidden={!(activeTab === cIndex)}
              aria-labelledby={`tab-${cIndex}`}
              id={`panel-${cIndex}`}
            >
              {isLoading ? (
                <PopularPostCkeleton theme={theme} />
              ) : sortPopulars.length == 0 ? (
                <p
                  className={`absolute left-1/2 bottom-4/7 -translate-x-1/2 text-sm  ${
                    dark(theme) ? 'text-[#ffffff]/50' : 'text-[#5c5c5c]'
                  }`}
                >
                  해당 채널에 게시글이 없습니다.
                </p>
              ) : (
                sortPopulars.map((popular, pIndex) => {
                  return (
                    <div
                      key={`popular-${pIndex}`}
                      className='basis-[calc(50%-0.875rem)] max-w-full tabConstentItem'
                    >
                      <PostListItem {...popular} theme={theme} />
                    </div>
                  );
                })
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
