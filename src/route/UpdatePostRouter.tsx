import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import UpdateCodePost from "../pages/update/UpdateCodePost";
import UpdateSetPost from "../pages/update/UpdateSetPost";
import UpdateVotePost from "../pages/update/UpdateVotePost";
import { Theme } from "../types/darkModeTypes";

export default function ChannelUpdateRouter({ theme }: { theme: Theme }) {
  const { channelId } = useParams<{ channelId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (channelId && !["1", "2", "3"].includes(channelId)) {
      navigate("/404");
    }
  }, [channelId, navigate]);

  if (!channelId) return null;

  switch (channelId) {
    case "1":
      return <UpdateCodePost theme={theme} />;
    case "2":
      return <UpdateSetPost theme={theme} />;
    case "3":
      return <UpdateVotePost theme={theme} />;
    default:
      return null;
  }
}
