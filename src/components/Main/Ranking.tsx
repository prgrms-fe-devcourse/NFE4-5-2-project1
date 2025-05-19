import MainTitle from "./MainTitle";
import { useState, useEffect, useOptimistic, startTransition } from "react";
import { RankingData } from "../../types/mainGame";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_TEAM_RANK;

const LoadingSkeleton = () => (
  <div className="grid grid-cols-9 gap-4 py-2.5">
    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-500"></div>
    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-500"></div>
    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-500"></div>
    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-500"></div>
    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-500"></div>
    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-500"></div>
    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-500"></div>
    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-500"></div>
    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-500"></div>
  </div>
);

export default function Ranking() {
  const [ranking, setRanking] = useState<RankingData[]>([]);
  const [updateDay, setUpdateDay] = useState("");

  const [optimisticRanking, addOptimisticRanking] = useOptimistic(
    ranking,
    (_, newRanking: RankingData[]) => newRanking
  );

  const fetchRanking = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.status === 200) {
        const data = res.data;
        startTransition(() => {
          addOptimisticRanking(data.rows);
        });
        setRanking(data.rows);
        setUpdateDay(data.title);
      } else {
        console.error("Error fetching ranking:", res.status);
      }
    } catch (error) {
      console.error("Error fetching ranking:", error);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, []);

  const textContent = (text: string) => {
    const textArray = text.split("'>")[1];
    if (textArray) {
      return textArray.split("</span>")[0];
    } else return text;
  };

  return (
    <>
      <div className="w-full">
        <MainTitle title="구단 순위" color="#0033A0" />
        <div className="mt-10">
          <div className="border-1 border-[#00000020] dark:border-[#35363C] w-full py-[10px]">
            <div className="grid grid-cols-9 gap-4 py-2 border-b border-[#00000020] dark:border-[#35363C] text-center">
              <span>순위</span>
              <span>팀명</span>
              <span>경기</span>
              <span>승</span>
              <span>패</span>
              <span>무</span>
              <span>승률</span>
              <span>게임차</span>
              <span>연속</span>
            </div>
            {optimisticRanking.length === 0
              ? Array(10)
                  .fill(0)
                  .map((_, index) => <LoadingSkeleton key={index} />)
              : optimisticRanking.map((item, i) => (
                  <div
                    className="grid grid-cols-9 gap-4 py-2.5 text-center items-center"
                    key={i}
                  >
                    {item.row.map((row, index) => (
                      <div key={index}>{textContent(row.Text)}</div>
                    ))}
                  </div>
                ))}
          </div>
        </div>
        <p className="text-sm text-gray-500 text-end font-bold mt-1 dark:text-white">
          {updateDay}
        </p>
      </div>
    </>
  );
}
