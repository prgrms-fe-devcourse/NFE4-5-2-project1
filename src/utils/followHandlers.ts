import { postFollow, postUnfollow } from '../api/follow/follow';
import { postNotificationData } from '../api/notification/notification';

export const handleFollow = async (
  currentUser: User,
  targetUserId: string,
  setUser: (user: User) => void,
  refetch?: () => void
) => {
  const updatedUserData = await postFollow(targetUserId);
  const newFollowData: Follow = updatedUserData.data;
  const updatedFollowing = [...currentUser.following, newFollowData];
  setUser({ ...currentUser, following: updatedFollowing });

  if (refetch) refetch();
  await postNotificationData('FOLLOW', newFollowData._id, targetUserId, null);
};

export const handleUnfollow = async (
  currentUser: User,
  targetUserId: string,
  setUser: (user: User) => void,
  refetch?: () => void
) => {
  const followToRemove = currentUser.following.find(
    (follow) => follow.user === targetUserId && follow.follower === currentUser._id
  );
  if (!followToRemove) return;

  await postUnfollow(followToRemove._id);
  const updatedFollowing = currentUser.following.filter((follow) => follow._id !== followToRemove._id);
  setUser({ ...currentUser, following: updatedFollowing });

  if (refetch) refetch();
};
