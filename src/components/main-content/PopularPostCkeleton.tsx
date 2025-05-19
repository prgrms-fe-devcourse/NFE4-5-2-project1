import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';

export default function PopularPostCkeleton({ theme }: { theme: Theme }) {
  const bgColor = dark(theme) ? 'bg-[#1e1e1e]' : 'bg-gray-200';
  const borderColor = dark(theme) ? 'border-[#1e1e1e]' : 'border-gray-200';
  const textColor = dark(theme) ? 'text-[#1e1e1e]' : 'text-gray-200';

  return (
    <div className='w-full tab-content flex gap-x-7 gap-y-5 flex-wrap min-h-[260px] relative animate-pulse'>
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className='w-full box-border basis-[calc(50%-0.875rem)] tabConstentItem'
        >
          <div
            className={`h-[283.5px] border ${borderColor} rounded-[5px] p-[21px] ${
              dark(theme) ? 'bg-[#2d2d2d]' : 'bg-[#ffffff]'
            }`}
          >
            <div className='flex mb-[27px] gap-x-4 items-center'>
              <div
                className={`w-[50px] h-[50px] rounded-[50%] ${bgColor}`}
              ></div>
              <div>
                <div className={`w-[100px] h-[20px] ${bgColor} mb-[5px]`}></div>
                <div className={`w-[150px] h-[17px] ${bgColor}`}></div>
              </div>
            </div>
            <div className='px-[24px] mb-[15px]'>
              <div
                className={`max-w-[200px] h-[25px] ${bgColor} mb-[25px]`}
              ></div>
              <div
                className={`max-w-[400px] h-[20px] ${bgColor} mb-[5px]`}
              ></div>
              <div className={`max-w-[300px] h-[20px] ${bgColor}`}></div>
            </div>
            <div className='mb-[10px]'>
              <div
                className={`ml-auto max-w-[100px] h-[15px] ${bgColor}`}
              ></div>
            </div>
            <hr className={textColor}></hr>
            <div>
              <div
                className={`max-w-[150px] h-[24px] my-[12px] ml-auto ${bgColor}`}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
