export default function UserPlaylistHeader() {
  return (
    <>
      <div className="hidden md:px-4 md:flex gap-[16px] text-[16px] md:text-[20px] font-bold">
        <h2>
          다른 유저들의 PlayList
          <span className="hidden md:inline">보러가기</span>
        </h2>
        <span role="img" aria-label="eyes">
          👀
        </span>
      </div>
      <div className="md:hidden flex gap-[16px] text-[14px] font-bold items-center">
        <h2>다른 유저들의 PlayList 보러가기</h2>
        <span role="img" aria-label="eyes">
          👀
        </span>
      </div>
    </>
  );
}
