import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';
import FollowerMember from './FollowMember';

interface FollowModal {
  isOpen: boolean;
  onClose: () => void;
  followData: {
    followers: Follow[];
    following: Follow[];
  };
  followType: 'following' | 'follower';
  targetUserId?: string;
  theme: Theme;
}

export default function ChatModal({ isOpen, onClose, followData, followType, targetUserId, theme }: FollowModal) {
  if (!isOpen) return null;

  return (
    <div className={'fixed inset-0 z-50 flex items-center justify-center bg-black/50'} onClick={onClose}>
      <div
        className={`w-[448px] h-[75vh] rounded-[5px] flex flex-col ${dark(theme) ? 'bg-[#2d2d2d]' : 'bg-[#ffffff]'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <FollowerMember followData={followData} followType={followType} targetUserId={targetUserId} theme={theme} />
      </div>
    </div>
  );
}
