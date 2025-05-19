import { create } from 'zustand';
import { axiosInstance } from '../api/axios';

// 각 채널 id값, 해당 채널에 부여된 color값, 해당 채널 이름, 주소 params에 해당하는 to
type ChannelItemType = {
  id: string;
  name: string;
  to: string;
  color: string;
  colorLight: string;
  colorDark: string;
};

type ChannelStore = {
  channels: ChannelItemType[];
  fetchChannels: () => Promise<void>;
};

export const useChannelItemStore = create<ChannelStore>((set) => ({
  channels: [],
  fetchChannels: async () => {
    const result = await axiosInstance.get('/channels');

    const menuItems = result.data.map((channel: Channel, index: number) => {
      let cName = '';
      let cColor = '';
      let cColorLight = '';
      let cColorDark = '';
      let cTo = '';

      // api에 등록 된 채널명에 맞게 기타 정보 설정.. 여기에 없는 채널이 들어오면 기본 값은 들어가도록 설정
      switch (channel.name) {
        case 'MysteryCode':
          cName = '이거 왜 되지?';
          cColorLight = '#10215C';
          cColorDark = '#19A9BE';
          cColor = '#10215C';
          cTo = '/channel/1';
          break;
        case 'DeskSetup':
          cName = '이거 왜 안 쓰지?';
          cColorLight = '#3380DE';
          cColorDark = '#3380DE';
          cColor = '#3380DE';

          cTo = '/channel/2';
          break;
        case 'Vote':
          cName = '골라봐';
          cColorLight = '#60A7F7';
          cColorDark = '#9E68E9';

          cColor = '#60A7F7';
          cTo = '/channel/3';
          break;
        default:
          cName = channel.name;
          cColor = `#${Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, '0')}`;
          cTo = `/channel/${index}`;
      }

      return {
        id: channel._id,
        name: cName,
        to: cTo,
        color: cColor,
        colorLight: cColorLight,
        colorDark: cColorDark,
      };
    });
    set({ channels: menuItems });
  },
}));
