import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { useChannelId } from "../../../hooks/useChannelId";
import BopsCommunityPage from "./BopsCommunityPage";

export default function BopsCommunity() {
  const { channelId, loading } = useChannelId("BopsCommunity");
  if (loading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  if (!channelId) return <p>채널을 찾을 수 없습니다.</p>;

  return (
    <>
      <BopsCommunityPage channelId={channelId} />
    </>
  );
}
