import play from "../../../assets/images/playbtn.svg";

export default function BopCardSkeleton() {
  return (
    <>
      <div className="relative w-fit">
        <div className="w-[240px] bg-[#55555534] p-4 rounded-2xl flex flex-col gap-4 mt-7  shadow-lg shadow-[rgba(0,0,0,0.50)] ">
          <div className="relative w-full h-[208px] overflow-hidden rounded-2xl group">
            <div className="w-full h-full bg-[color:var(--grey-500)] rounded-2xl shadow-lg shadow-[rgba(0,0,0,0.25)] object-cover animate-pulse" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div className="w-full flex gap-0.5 h-12">
                <div className="flex flex-col w-[90%] justify-between">
                  <span className="w-full h-[24px] bg-[color:var(--grey-500)] truncate rounded-sm animate-pulse"></span>
                  <span className="w-[50%] h-[18px] bg-[color:var(--grey-500)] rounded-sm animate-pulse"></span>
                </div>
              </div>

              <span className="w-[60%] h-[18px] bg-[color:var(--grey-500)] rounded-sm animate-pulse"></span>
            </div>

            <div className="flex justify-between">
              <div className="flex w-[30%] gap-2 items-center h-[20px] bg-[color:var(--grey-500)] rounded-sm animate-pulse"></div>
              <img
                src={play}
                alt="재생버튼"
                className="w-6 h-6 cursor-pointer pb-1 "
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
