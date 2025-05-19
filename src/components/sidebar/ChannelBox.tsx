import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useChannelItemStore } from '../../stores/channelStore';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';

export default function ChannelBox({ theme }: { theme: Theme }) {
  const pathName = useLocation().pathname;

  const { channels, fetchChannels } = useChannelItemStore();
  const params = useParams();
  const [channelParams, setchannelParams] = useState(params.channelId);

  const navigate = useNavigate();

  // 채널 정보 가져오기
  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  // 주소의 param값 확인해서 어떤 채널인지 state에 저장
  useEffect(() => {
    setchannelParams(params.channelId);
  }, [params]);

  return (
    <>
      <div
        className={`w-[291px] h-[211px] rounded-[10px] pt-5 shadow-md font-semibold ${
          dark(theme)
            ? 'bg-[#2d2d2d] text-[#ffffff]'
            : 'bg-[#ffffff] text-[#111111]'
        }`}
      >
        <h2
          className={`text-[20px] font-medium ml-7 mb-[14px] ${
            dark(theme) ? 'text-[#acacac]' : 'text-[#595956]'
          }`}
        >
          Channel
        </h2>
        <ul className='space-y-[13px]'>
          {channels.map((item) => (
            <li key={item.id}>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.to);
                }}
                to={item.to}
                className='flex items-start  ml-7 group'
              >
                <span
                  className={`w-1 h-8 rounded-sm mr-[7px]`}
                  style={{
                    backgroundColor: dark(theme)
                      ? item.colorDark
                      : item.colorLight,
                  }}
                ></span>
                <span className='font-noto font-[18px] pt-1 relative z-1'>
                  {item.name}
                  <span
                    // 주소 param값이 해당 채널과 동일하면 해당 채널에 css 효과
                    className={twMerge(
                      `block w-0 h-3/7 opacity-30 absolute left-0 bottom-0 -z-1 group-hover:w-full duration-300 ease-out`,
                      channelParams === item.to.split('/')[2] && 'w-full'
                    )}
                    style={{
                      backgroundColor: dark(theme)
                        ? item.colorDark
                        : item.colorLight,
                      width: pathName === item.to ? '100%' : '',
                    }}
                  ></span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
