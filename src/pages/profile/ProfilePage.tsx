import Profile from './Profile';
import { useAuthStore } from '../../stores/authStore';
import { useLocation } from 'react-router-dom';
import { Theme } from '../../types/darkModeTypes';

export default function ProfilePage({ theme }: { theme: Theme }) {
  const location = useLocation();
  const { userid } = location.state || {};
  const user = useAuthStore((state) => state.user);
  return (
    <>
      <Profile
        key={user?._id}
        userId={userid ? userid : user?._id || ''}
        theme={theme}
      />
    </>
  );
}
