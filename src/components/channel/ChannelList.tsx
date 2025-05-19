import { useEffect, useState } from 'react';
import filterIcon from '../../assets/icons/filterIcon.svg';

interface Channel {
  _id: string;
  name: string;
}

interface ChannelListProps {
  channels: Channel[];
  onSelect: (channelId: string) => void;
  selectedChannelId: string | null;
  onFilterChange?: (filters: { cost?: number; location?: string }) => void;
  className?: string;
}

export default function ChannelList({
  channels,
  onSelect,
  selectedChannelId,
  onFilterChange,
}: ChannelListProps) {
  const [cost, setCost] = useState<number>(0);
  const [location, setLocation] = useState<string>('');

  const [useCostFilter, setUseCostFilter] = useState(false);
  const [useLocationFilter, setUseLocationFilter] = useState(false);

  const [showFilter, setShowFilter] = useState(true);

  // 필터 상태가 바뀌면 자동 반영
  useEffect(() => {
    const filters: { cost?: number; location?: string } = {};
    if (useCostFilter) filters.cost = cost;

    if (useLocationFilter) filters.location = location;

    onFilterChange?.(filters);
  }, [useCostFilter, useLocationFilter, cost, location]);

  const filterToggle = () => setShowFilter((prev) => !prev);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  return (
    <div className="flex justify-center relative">
      <div className="flex-col">
        <ul className="flex space-x-4 mt-[10px] mb-[20px] flex-row h-[55px]">
          {channels.map((channel) => {
            const isSelected = channel._id === selectedChannelId;
            return (
              <li
                key={channel._id}
                onClick={() => onSelect(channel._id)}
                className={`border-[1px] rounded-xl py-[15px] px-[40px] text-[15px] cursor-pointer transition-all duration-75 ease-in-out
                ${
                  isSelected
                    ? 'bg-[#EFF8FF] text-[var(--color-main-blue)] scale-[1.15] border-[3px] border-[var(--color-main-blue)]'
                    : 'text-[#8F8F8F] hover:scale-[1.15]'
                }`}
              >
                {channel.name}
              </li>
            );
          })}
        </ul>

        {/* 필터 토글 버튼 */}
        <img
          src={filterIcon}
          alt="filterIcon"
          className="w-[30px] h-[30px] absolute left-0 top-[90px] cursor-pointer hover:scale-[1.3]"
          onClick={filterToggle}
        />

        {!showFilter && <div className="h-[40px] mb-[30px]"></div>}

        {/* 필터 UI */}
        {showFilter && (
          <div className="flex-col flex gap-2 pl-[40px] px-[10px] pt-[5px] pb-[20px]">
            {/* 장소 필터 */}
            <div className="flex items-center gap-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useLocationFilter}
                  onChange={(e) => setUseLocationFilter(e.target.checked)}
                />
                <span className="text-[var(--color-text-filter)]">장소</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={handleLocationChange}
                className="border border-[#d9d9d9] rounded-[10px] w-[300px] h-[10px] px-[10px] py-[15px] text-[var(--color-text-filter)]"
                placeholder="장소를 입력하세요"
                disabled={!useLocationFilter}
              />
            </div>

            {/* 비용 필터 */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useCostFilter}
                  onChange={(e) => setUseCostFilter(e.target.checked)}
                />
                <span className="text-[var(--color-text-filter)]">경비</span>
              </label>
              <input
                type="range"
                id="cost"
                min={0}
                max={2000000}
                step={10000}
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-[200px]"
                list="markers"
                disabled={!useCostFilter}
              />
              <datalist id="markers">
                <option value="100000"></option>
                <option value="300000"></option>
                <option value="700000"></option>
                <option value="1200000"></option>
                <option value="1700000"></option>
              </datalist>
              <span className="text-[var(--color-text-filter)] text-[14px]">
                200만원 이상
              </span>
            </div>

            <p className="text-[14px] text-[var(--color-cost-text)] mb-[10px]">
              현재 설정된 경비: <strong>{cost.toLocaleString()}원</strong>
            </p>

            {/* 적용 버튼은 필수 아님 */}
            {/* <button
              onClick={() => {}} // 선택사항: 아무 동작 안 하거나 제거해도 됨
              className="absolute right-0 bottom-[30px] bg-[var(--color-main-navy)] text-white cursor-pointer px-4 py-2 hover:bg-[var(--color-main-navy-hover)] rounded-xl w-[80px]"
              disabled={!useCostFilter && !useLocationFilter}
            >
              적용
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
}
