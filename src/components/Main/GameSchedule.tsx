import { useState, useEffect, useOptimistic, startTransition } from "react";
import { BaseballGameData } from "../../types/mainGame";
import { team_list } from "../../utils/getLogoImages";
import axios from "axios";
import MainTitle from "./MainTitle";

const API_URL = import.meta.env.VITE_API_NEXT_MATCH;

const GameTable = ({ team, pitcher }: { team: string; pitcher: string }) => (
  <div className="flex items-center justify-around">
    <div className="flex items-center gap-2">
      <div className="w-[40px]">
        <img
          src={team_list[team as keyof typeof team_list]}
          alt={team}
          className="w-[30px]"
        />
      </div>
      <p className="w-[60px] font-bold">{team}</p>
    </div>
    <p className="w-20">
      {pitcher && (
        <>
          <span className="text-[#00aeef] font-bold">선</span> {pitcher}
        </>
      )}
    </p>
  </div>
);

const LoadingSkeleton = () => (
  <div className="w-auto border border-[#00000020] dark:border-b-[#35363C] dark:last:border-b-0">
    <div className="flex flex-row justify-between py-[1.07rem]">
      <div className="flex flex-col gap-4 px-4 w-full">
        <div className="flex items-center">
          <div className="w-[40px]">
            <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-500 w-6"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-500 w-full"></div>
        </div>
        <div className="flex items-center">
          <div className="w-[40px]">
            <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-500 w-6"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-500 w-full"></div>
        </div>
      </div>
      <div className="flex">
        <div className="flex items-center px-8 border-l border-[#00000020] dark:border-[#35363C]">
          <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-500 w-20"></div>
        </div>
        <div className="flex items-center px-8 border-l border-[#00000020] dark:border-[#35363C]">
          <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-500 w-20"></div>
        </div>
        <div className="flex items-center px-8 border-l border-[#00000020] dark:border-[#35363C]">
          <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-500 w-20"></div>
        </div>
      </div>
    </div>
  </div>
);

const NotGameSchedule = () => (
  <div className="w-auto border border-[#00000020] h-[500px] flex items-center justify-center">
    <div className="text-center text-gray-500 text-xl dark:text-white font-bold">
      경기 일정이 없습니다.
    </div>
  </div>
);

const GameScore = ({ game }: { game: BaseballGameData }) => {
  const getGameScore = (team1: string, team2: string, team: string) => {
    let color;
    if (team1 === team2) {
      color = "text-[#222] dark:text-white";
    } else if (team === "1") {
      color =
        +team1 > +team2
          ? "text-[#FF0000] dark:text-[#DB4343]"
          : "text-[#222] dark:text-white";
    } else {
      color =
        +team1 < +team2
          ? "text-[#FF0000] dark:text-[#DB4343]"
          : "text-[#222] dark:text-white";
    }

    return color;
  };

  if (game.CANCEL_SC_NM === "정상경기") {
    return (
      <>
        <div className="md:w-[100px]">
          {game.GAME_INN_NO} {game.GAME_TB_SC_NM}
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          <p
            className={`text-md font-bold w-[10px] ${getGameScore(
              game.T_SCORE_CN,
              game.B_SCORE_CN,
              "1"
            )}`}
          >
            {game.T_SCORE_CN}
          </p>
          <p
            className={`text-md font-bold w-[10px] ${getGameScore(
              game.T_SCORE_CN,
              game.B_SCORE_CN,
              "2"
            )}`}
          >
            {game.B_SCORE_CN}
          </p>
        </div>
      </>
    );
  } else
    return (
      <>
        <div className="md:w-[110px] text-center">{game.CANCEL_SC_NM}</div>
      </>
    );
};

const now = new Date();
const newDate = now;

const year = newDate.getFullYear();
const month = String(newDate.getMonth() + 1);
const day = String(newDate.getDate());

export default function GameSchedule() {
  const [isLoading, setIsLoading] = useState(true);
  const [gameSchedule, setGameSchedule] = useState<BaseballGameData[]>([]);
  const [optimisticSchedule, addOptimisticSchedule] = useOptimistic(
    gameSchedule,
    (_, newSchedule: BaseballGameData[]) => newSchedule
  );

  const getGameSchedule = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.status === 200) {
        const data = res.data;
        startTransition(() => {
          addOptimisticSchedule(data.game);
        });
        setGameSchedule(data.game);
        setIsLoading(false);
      } else {
        console.error("Error fetching game schedule:", res.status);
      }
    } catch (error) {
      console.error("Error fetching game schedule:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getGameSchedule();
  }, []);

  return (
    <div className="w-full">
      <MainTitle title="경기 일정" color="#0033A0" />
      <div className="mt-10 dark:bg-[#232429]">
        {isLoading ? (
          Array(5)
            .fill(0)
            .map((_, index) => <LoadingSkeleton key={index} />)
        ) : optimisticSchedule.length === 0 ? (
          <NotGameSchedule />
        ) : (
          optimisticSchedule.map((game) => (
            <div
              className="w-auto border border-[#6b4a4a20] dark:border-b-[#35363C] dark:last:border-b-0"
              key={game.AWAY_NM}
            >
              <div className="flex flex-row justify-between py-4">
                <div className="flex flex-col gap-4 px-4 w-1/2">
                  <GameTable team={game.AWAY_NM} pitcher={game.T_PIT_P_NM} />
                  <GameTable team={game.HOME_NM} pitcher={game.B_PIT_P_NM} />
                </div>
                <div className="flex">
                  <div className="flex items-center justify-center px-8 border-l border-[#00000020] dark:border-[#35363C]">
                    <GameScore game={game} />
                  </div>
                  <div className="flex items-center justify-center px-8 border-l border-[#00000020] dark:border-[#35363C] md:w-[170px]">
                    <span>{game.S_NM} 야구장</span>
                  </div>
                  <div className="flex items-center px-8 border-l border-[#00000020] dark:border-[#35363C]">
                    <span>{game.G_TM}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <p className="text-sm text-gray-500 text-end font-bold mt-1 dark:text-white">
        {year}년 {month}월 {day}일 기준
      </p>
    </div>
  );
}
