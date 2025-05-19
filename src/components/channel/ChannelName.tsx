import { twMerge } from 'tailwind-merge';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';

interface ChannelNameProps {
  channelId: string;
}

interface ChannelNameProps {
  channelId: string;
  theme: Theme;
}

export default function ChannelName({ channelId, theme }: ChannelNameProps) {
  const titleList = [
    { subtitle: '"이거 왜 되지?"', title: '미스터리 코드 공유 채널' },
    { subtitle: '"이거 왜 안 쓰지?"', title: '데스크 셋업 공유 채널' },
    { subtitle: '"골라봐"', title: '투표하다 보면 수다도 터지는 채널' },
  ];

  const textColor = dark(theme) ? 'text-[#ffffff]' : 'text-[#111111]';

  return (
    <div className="flex gap-3">
      <div
        className={twMerge(
          'h-15 w-1 bg-blue-500 rounded-sm ',
          channelId === '1' &&
            `${dark(theme) ? 'bg-[#19a9be]' : 'bg-[#10215c]'}`,
          channelId === '2' &&
            `${dark(theme) ? 'bg-[#3380de]' : 'bg-[#3380DE]'}`,
          channelId === '3' &&
            `${dark(theme) ? 'bg-[#9e68e9]' : 'bg-[#60A7F7]'}`
        )}
      />
      <div className="flex flex-col items-start self-center">
        <p className={twMerge('text-[17px] opacity-70', textColor)}>
          {titleList[Number(channelId) - 1].subtitle}
        </p>
        <p className={twMerge('text-[25px] font-bold', textColor)}>
          {titleList[Number(channelId) - 1].title}
        </p>
      </div>
    </div>
  );
}
