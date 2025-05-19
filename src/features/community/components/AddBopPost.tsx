import { useState } from "react";
import { useChannelId } from "../../../hooks/useChannelId";
import { ChannelName } from "../types/ChannelName";
import { useNavigate } from "react-router";
import { createPost } from "../../../utils/post";
import BackButton from "../../../components/common/BackButton";
import BopPostForm from "./BopPostForm";
import { BopTrack } from "../types/BopTrack";
import StatusModal from "../../../components/common/StatusModal";

export default function AddBopPost({ channelName }: ChannelName) {
  const navigate = useNavigate();
  const { channelId } = useChannelId(channelName);
  const [bopTrack, setBopTrack] = useState<BopTrack | null>(null);
  const [bopGenre, setBopGenre] = useState("");
  const [bopText, setBopText] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isFormInvalid = !bopTrack || !bopGenre || !bopText;

  const createBopHandler = async () => {
    if (!bopTrack || !bopGenre || !bopText || !channelId) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const jsonTitle = {
      track: {
        id: bopTrack.id,
        name: bopTrack.name,
        artists: bopTrack.artists.join(", "),
        image: bopTrack.image || "",
      },
      genre: bopGenre,
      text: bopText,
    };

    try {
      const response = await createPost({
        title: jsonTitle,
        channelId,
      });
      if (response.status === 201 || response.status === 200) {
        setShowSuccessModal(true);
      }
    } catch (e) {
      console.error("Error during Bop Post creation:", e);
    }
  };

  const closeModalHandler = () => {
    setShowSuccessModal(false);
    navigate(-1);
  };

  return (
    <div className="w-full h-[80vh] flex flex-col gap-2 ">
      <div className="flex w-full my-4">
        <BackButton />
      </div>
      <div className="w-full h-full px-4">
        <div className="flex flex-col w-full h-auto border border-(--white-80) border-opacity-50 rounded-lg p-[48px] box-border gap-8">
          <span className="w-full text-center text-2xl">숨듣명 추가하기</span>
          <BopPostForm
            bopTrack={bopTrack}
            bopText={bopText}
            bopGenre={bopGenre}
            setBopTrack={setBopTrack}
            setBopText={setBopText}
            setBopGenre={setBopGenre}
          />
          <div className="w-[100%] flex justify-center items-center">
            <button
              type="button"
              disabled={isFormInvalid}
              className={`text-[14px] px-8 py-3 w-fit rounded-4xl  transition ${
                isFormInvalid
                  ? "border-1 border-[color:var(--primary-200)] text-[var(--white-80)] "
                  : "bg-[var(--primary-300)] text-[var(--bg-color)] cursor-pointer font-semibold"
              }`}
              onClick={createBopHandler}
            >
              저장하기
            </button>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <StatusModal
          message="성공적으로 저장되었습니다."
          onClose={closeModalHandler}
        />
      )}
    </div>
  );
}
