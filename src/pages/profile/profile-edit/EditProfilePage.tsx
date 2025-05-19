import { useAuthStore } from '../../../stores/authStore';
import { Theme } from '../../../types/darkModeTypes';
import EditProfile from './EditProfile';

export default function EditProfilePage({ theme }: { theme: Theme }) {
  const user = useAuthStore((state) => state.user);
  return (
    <>
      <EditProfile key={user?._id} userId={user?._id || ''} theme={theme} />
    </>
  );
}
