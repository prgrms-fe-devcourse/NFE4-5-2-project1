import { axiosInstance } from "../axiosInstance";
import { getUserInfo } from "./userService";

export const getTrackToPlaylist = async () => {
  const userData = await getUserInfo();
  const res = await axiosInstance.get(`/posts/author/${userData._id}`, {
    params: {
      offset: 0,
      limit: 100,
    },
  });
  return res.data.filter(
    (data: { channel: { _id: string } }) =>
      data.channel._id === "681e46160764ba7641dcd157"
  );
};

export const addTrackToPlayList = async ({ title }: { title: Track }) => {
  const res = await axiosInstance.post("/posts/create", {
    title: JSON.stringify(title),
    img: null,
    channelId: "681e46160764ba7641dcd157",
  });
  return res.data;
};

export const deleteTrackFromPlaylist = async (id: string) => {
  const res = await axiosInstance.delete("posts/delete", {
    data: { id: id },
  });
  return res;
};

export const getOtherUserTrackToPlaylist = async (id: string) => {
  const res = await axiosInstance.get(`/posts/author/${id}`, {
    params: {
      offset: 0,
      limit: 100,
    },
  });
  return res.data.filter(
    (data: { channel: { _id: string } }) =>
      data.channel._id === "681e46160764ba7641dcd157"
  );
};

export const getUserPlaylist = async (searchQuery: string) => {
  try {
    const res = await axiosInstance.get(`/search/users/${searchQuery}`);

    return res.data;
  } catch (error) {
    console.error(error);
  }
};
