import { useParams } from "react-router";
import { Location } from "react-router";
import { Post } from "../../types/postType";
import { userStore } from "../../stores/userStore";
import { refreshStore } from "../../stores/refreshStore";
import InfiniteScrollWrapper from "./InfiniteScrollWrapper";

export default function NewThreadList({ location }: { location: Location }) {
  const { channelId } = useParams();
  const refresh = refreshStore((state) => state.refresh);
  const userId = userStore.getState().getUser()?._id;

  const params = new URLSearchParams(location.search);
  const isSortPage = params.get("sort") === "like";

  // 정렬 처리
  const sortPosts = (posts: Post[]) =>
    isSortPage
      ? [...posts].sort((a, b) => b.likes.length - a.likes.length)
      : [...posts].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
  return (
    <div className="flex flex-col gap-6">
      <InfiniteScrollWrapper
        channelId={channelId}
        refresh={refresh}
        sortFn={sortPosts}
        userId={userId}
      />
    </div>
  );
}
