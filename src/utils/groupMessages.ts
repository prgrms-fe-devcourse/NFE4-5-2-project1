type Message = {
  id: string;
  s_id: string;
  message: string;
  createdAt: string;
};

export type GroupedMessage = Message & {
  groupPosition: "single" | "first" | "middle" | "last";
  groupDate: string;
};

export default function groupMessages(messages: Message[]): GroupedMessage[] {
  return messages.map((message, index) => {
    const currentSender = message.s_id;
    const currentDate = new Date(message.createdAt).toLocaleDateString(
      "ko-KR",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const prev = messages[index - 1];
    const next = messages[index + 1];

    const prevSender = prev?.s_id;
    const nextSender = next?.s_id;

    const prevDate = prev
      ? new Date(prev.createdAt).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;
    const nextDate = next
      ? new Date(next.createdAt).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

    const isSameAsPrev =
      prevSender === currentSender && prevDate === currentDate;
    const isSameAsNext =
      nextSender === currentSender && nextDate === currentDate;

    let groupPosition: GroupedMessage["groupPosition"];

    if (!isSameAsPrev && !isSameAsNext) groupPosition = "single";
    else if (!isSameAsPrev && isSameAsNext) groupPosition = "first";
    else if (isSameAsPrev && isSameAsNext) groupPosition = "middle";
    else groupPosition = "last";

    return {
      ...message,
      groupPosition,
      groupDate: currentDate,
    };
  });
}
