import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';

export default function PostDetailSkeleton({ theme }: { theme: Theme }) {
  return (
    <>
      <div
        className={`w-full h-auto p-4 rounded-md animate-pulse space-y-4 ${
          dark(theme) ? 'bg-[#2d2d2d]' : 'bg-[#ffffff]'
        }`}
      >
        {/* 사용자 */}
        <div className="flex h-[85px] gap-3 m-2 mb-0">
          <div
            className={`w-[50px] h-[50px] rounded-[50%] ${
              dark(theme) ? 'bg-[#1e1e1e]' : 'bg-gray-200'
            }`}
          />
          <div className="flex flex-col gap-2">
            <div
              className={`rounded w-[120px] h-[20px] ${
                dark(theme) ? 'bg-[#1e1e1e]' : 'bg-gray-200'
              }`}
            />
            <div
              className={`rounded w-[120px] h-[17px] ${
                dark(theme) ? 'bg-[#1e1e1e]' : 'bg-gray-200'
              }`}
            />
          </div>
        </div>
        {/* 본문 */}
        <div
          className={`h-[250px] rounded ${
            dark(theme) ? 'bg-[#1e1e1e]' : 'bg-gray-100'
          }`}
        />
        <hr
          className={`mx-[18px]  ${
            dark(theme) ? 'text-[#1e1e1e]' : 'text-[#b2b2b2]'
          }`}
        />
        {/* 하단 */}
        <div className="flex justify-end">
          <div
            className={`h-[40px] rounded w-[123px] ${
              dark(theme) ? 'bg-[#1e1e1e]' : 'bg-gray-200'
            }`}
          />
        </div>
        {/* 댓글 */}
        <div
          className={`h-auto p-4 pt-0.5 rounded-[5px] mx-7 mb-[30px] animate-pulse space-y-4 ${
            dark(theme)
              ? 'bg-[#2d2d2d] border border-[#1e1e1e]'
              : 'bg-[#ffffff] border border-[#b4b4b4]'
          }`}
        >
          {/* 사용자 */}
          <div className="flex items-center h-[85px] gap-3 ">
            <div
              className={`w-9 h-9 rounded-full ${
                dark(theme) ? 'bg-[#1e1e1e]' : 'bg-gray-200'
              }`}
            />
            <div
              className={`rounded w-[50px] h-[20px] ${
                dark(theme) ? 'bg-[#1e1e1e]' : 'bg-gray-200'
              }`}
            />
            <div
              className={`rounded w-[70px] h-[17px] ${
                dark(theme) ? 'bg-[#1e1e1e]' : 'bg-gray-200'
              }`}
            />
          </div>
          {/* 본문 */}
          <div
            className={`h-[150px] rounded py-[11px] px-4 ${
              dark(theme) ? 'bg-[#1e1e1e]' : 'bg-gray-100'
            }`}
          />
        </div>
        {/* 댓글 */}
        <div
          className={`h-auto p-4 pt-0.5 rounded-[5px] border border-[#b4b4b4] mx-7 mb-[30px] animate-pulse space-y-4 ${
            dark(theme) ? 'bg-[#2d2d2d]' : 'bg-[#ffffff]'
          }`}
        >
          {/* 사용자 */}
          <div className="flex items-center h-[85px] gap-3 ">
            <div
              className={`w-9 h-9 rounded-full ${
                dark(theme) ? 'bg-[#1e1e1e]' : 'bg-gray-200'
              }`}
            />
            <div
              className={`rounded w-[50px] h-[20px] ${
                dark(theme) ? 'bg-[#1e1e1e]' : 'bg-gray-200'
              }`}
            />
            <div
              className={`rounded w-[70px] h-[17px] ${
                dark(theme) ? 'bg-[#1e1e1e]' : 'bg-gray-200'
              }`}
            />
          </div>
          {/* 본문 */}
          <div
            className={`h-[150px] rounded py-[11px] px-4 ${
              dark(theme) ? 'bg-[#1e1e1e]' : 'bg-gray-100'
            }`}
          />
        </div>
      </div>
    </>
  );
}
