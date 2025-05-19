import { useState, useEffect, useMemo } from "react";
import { Theme } from "../../types/darkModeTypes";
import { dark } from "../../utils/darkModeUtils";
import { useParams } from "react-router-dom";
import { voteComments, deleteComments } from "../../api/post/post";
import { useAuthStore } from "../../stores/authStore";

interface PollOption {
  id: number;
  text: string;
}

interface CommentType {
  _id: string;
  comment: string;
  userId?: string;
}

interface PollOptionsViewProps {
  options: PollOption[];
  theme: Theme;
  comments: CommentType[];
  onVoted?: () => void;
}

export default function PollOptionsVoteView({
  options,
  theme,
  comments,
  onVoted,
}: PollOptionsViewProps) {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useAuthStore();
  const myUserId = user?._id;

  const [localComments, setLocalComments] = useState<CommentType[]>(comments);

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const { selectedOptionId, myCommentId } = useMemo(() => {
    const vote = localComments.find((c) => {
      try {
        const parsed = JSON.parse(c.comment);
        return (
          parsed.type === "vote" &&
          (parsed.userId === myUserId || c.userId === myUserId)
        );
      } catch {
        return false;
      }
    });

    if (vote) {
      try {
        const parsed = JSON.parse(vote.comment);
        return {
          selectedOptionId: Number(parsed.selectedOptionId),
          myCommentId: vote._id,
        };
      } catch {
        return { selectedOptionId: null, myCommentId: null };
      }
    }

    return { selectedOptionId: null, myCommentId: null };
  }, [localComments, myUserId]);

  const pollOptions = useMemo(() => {
    return options.map((opt) => ({
      ...opt,
      voteCount: localComments.filter((c) => {
        try {
          const parsed = JSON.parse(c.comment);
          return (
            parsed.type === "vote" && Number(parsed.selectedOptionId) === opt.id
          );
        } catch {
          return false;
        }
      }).length,
    }));
  }, [options, localComments]);

  const totalVotes = useMemo(
    () => pollOptions.reduce((acc, cur) => acc + cur.voteCount, 0),
    [pollOptions]
  );

  const maxVoteCount = useMemo(
    () => Math.max(...pollOptions.map((opt) => opt.voteCount)),
    [pollOptions]
  );

  const topOptionIds = useMemo(
    () =>
      pollOptions
        .filter((opt) => opt.voteCount === maxVoteCount)
        .map((opt) => opt.id),
    [pollOptions, maxVoteCount]
  );

  const handleVote = async (optionId: number) => {
    if (!postId || !myUserId) return;

    const prevComment = localComments.find((c) => c._id === myCommentId);

    if (selectedOptionId === optionId && myCommentId) {
      setLocalComments((prev) => prev.filter((c) => c._id !== myCommentId));

      try {
        await deleteComments(myCommentId);
        onVoted?.();
      } catch (err) {
        if (prevComment) {
          setLocalComments((prev) => [...prev, prevComment]);
        }
        console.error("선택 취소 실패", err);
      }

      return;
    }

    const tempId = "temp-" + Date.now();
    const newComment: CommentType = {
      _id: tempId,
      userId: myUserId,
      comment: JSON.stringify({
        type: "vote",
        selectedOptionId: optionId,
        userId: myUserId,
      }),
    };

    setLocalComments((prev) => {
      const filtered = myCommentId
        ? prev.filter((c) => c._id !== myCommentId)
        : prev;
      return [...filtered, newComment];
    });

    if (myCommentId) {
      try {
        await deleteComments(myCommentId);
      } catch (err) {
        console.error("기존 투표 삭제 실패", err);
      }
    }

    try {
      const { data } = await voteComments(
        postId,
        String(optionId),
        String(myUserId)
      );

      setLocalComments((prev) =>
        prev.map((c) => (c._id === tempId ? data : c))
      );

      onVoted?.();
    } catch (err) {
      setLocalComments((prev) => prev.filter((c) => c._id !== tempId));
      console.error("투표 실패", err);
    }
  };

  return (
    <div className='flex flex-col gap-3'>
      {pollOptions.map((option) => {
        const ratio =
          totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;
        const isSelected = option.id === selectedOptionId;
        const isTop = topOptionIds.includes(option.id);

        const bgColor = dark(theme) ? "#8c8c8c" : "#d1d6db";
        const topColor = dark(theme) ? "#1e1e1e" : "#60AfF7";
        const barColor = isTop ? topColor : bgColor;

        const borderColor = dark(theme)
          ? isSelected
            ? "border-2 border-neutral-600"
            : "border-2 border-[#1e1e1e]"
          : isSelected
          ? "border-gray-400"
          : "border-gray-300";

        const hoverBg = dark(theme)
          ? "hover:bg-[#2c2c2c]"
          : "hover:bg-gray-100";
        const textColor = dark(theme) ? "text-white" : "text-gray-800";
        const subTextColor = dark(theme) ? "text-gray-300" : "text-gray-600";

        return (
          <div key={option.id} className='flex flex-col gap-2'>
            <div
              onClick={() => handleVote(option.id)}
              className={`relative px-4 py-2 border rounded flex justify-between items-center cursor-pointer transition overflow-hidden ${borderColor} ${hoverBg}`}
            >
              <div
                className='absolute left-0 top-0 h-full transition-all duration-300'
                style={{
                  width: `${ratio}%`,
                  backgroundColor: barColor,
                }}
              />
              <span className={`z-10 ${textColor}`}>{option.text}</span>
              <span className={`z-10 text-sm ${subTextColor}`}>
                {option.voteCount}표 ({ratio.toFixed(1)}%)
              </span>
            </div>
          </div>
        );
      })}
      <div
        className={`mt-4 font-medium ${
          dark(theme) ? "text-[#ffffff]" : "text-gray-700"
        }`}
      >
        Total Votes: {totalVotes}
      </div>
    </div>
  );
}
