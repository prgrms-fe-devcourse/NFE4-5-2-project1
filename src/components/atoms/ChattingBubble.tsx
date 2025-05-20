import React from 'react';
import TimeAgo from './TimeAgo';

interface ChattingBubbleProps {
  sender: 'user' | 'me';
  children: React.ReactNode;
  timestamp: string | number | Date; // 변경: date 대신 raw timestamp
  fontSize?: number; // optional fontSize for TimeAgo
}

export default function ChattingBubble({
  sender,
  children,
  timestamp,
  fontSize = 12, // 기본 12px
}: ChattingBubbleProps) {
  return (
    <div
      className={`relative flex gap-[5px] ${sender === 'me' ? 'justify-end' : ''}`}
    >
      {sender === 'user' && (
        <div className="nanum-gothic-regular max-w-[60%] rounded-tl-[23px] rounded-r-[23px] bg-[#D7CAB9] px-[23px] py-[13px] text-[16px] break-all dark:text-black">
          {children}
        </div>
      )}

      {/* 변경: 단순 텍스트 대신 TimeAgo 컴포넌트 */}
      <div className="self-end">
        <TimeAgo timestamp={timestamp} fontSize={fontSize} />
      </div>

      {sender === 'me' && (
        <div className="dark:bg-dark-button dark:border-dark-border nanum-gothic-regular max-w-[60%] rounded-l-[23px] rounded-tr-[23px] border border-[#D7CAB9] px-[23px] py-[13px] text-[16px] break-all">
          {children}
        </div>
      )}
    </div>
  );
}
