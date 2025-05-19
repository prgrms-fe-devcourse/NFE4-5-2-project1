import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CreateCodePost from "../pages/write/CreateCodePost";
import CreateSetPost from "../pages/write//CreateSetPost";
import CreateVotePost from "../pages/write/CreateVotePost";
import { Theme } from "../types/darkModeTypes";

export default function ChannelWriteRouter({ theme }: { theme: Theme }) {
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
      return <CreateCodePost theme={theme} />;
    case "2":
      return <CreateSetPost theme={theme} />;
    case "3":
      return <CreateVotePost theme={theme} />;
    default:
      return null;
  }
}
