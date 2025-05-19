import { useLocation, useParams } from "react-router";
import BackButton from "../components/common/BackButton";
import Conversations from "../features/chat/components/Conversations";
import Messages from "../features/chat/components/Messages";
import { useMsgVersionStore } from "../features/chat/stores/msgVersionStore";
import { useEffect, useState } from "react";
import { getCurrentUserId } from "../utils/auth";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function Chat() {
  const { userId } = useParams();
  const location = useLocation();
  const version = useMsgVersionStore((state) => state.c_version);
  const reset = useMsgVersionStore((state) => state.reset);
  const [loginId, setLoginId] = useState();

  const [from] = useState(() => location.state?.from || "/");

  useEffect(() => {
    reset();
  }, [userId, reset]);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getCurrentUserId();
      setLoginId(id);
    };

    fetchUserId();
  }, []);

  return (
    <>
      {loginId === undefined ? (
        <div className="w-[90%] h-[85vh] flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="md:flex flex-col md:w-[720px] lg:w-[800px] xl:w-[1080px] xl:x-[1080px] h-[88vh] hidden py-10 gap-4 ">
            <div className="w-full">
              <BackButton from={from} />
            </div>
            <div className="flex h-[90%] w-full justify-between">
              <div className="w-[30%] h-full">
                <Conversations key={version} loginId={loginId} from={from} />
              </div>
              <div className="w-[68%] h-full">
                <Messages />
              </div>
            </div>
          </div>

          <div className="md:hidden w-full flex flex-col gap-[20px] h-[78vh] px-12 mt-24">
            {userId ? (
              <Messages />
            ) : (
              <Conversations key={version} loginId={loginId} from={from} />
            )}
          </div>
        </>
      )}
    </>
  );
}
