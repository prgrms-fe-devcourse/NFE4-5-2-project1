import {axiosClient} from "./aixosClient";

type GetConcertsParams = {
  channelId: string;
};

export const getConcerts = async ({channelId}: GetConcertsParams) => {
  try {
    const response = await axiosClient.get(`/posts/channel/${channelId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching concerts:", error);
  }
};
