import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: window.location.hostname
    ? import.meta.env.VITE_OPENAI_API_KEY
    : "/api",
  dangerouslyAllowBrowser: true,
});

let isRequesting = false;

export const recommendTracksByGpt = async (
  prompt: string
): Promise<TrackRecommendation[]> => {
  if (isRequesting) throw new Error("이미 요청 진행 중");

  try {
    isRequesting = true;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content || "";
    const parsed = JSON.parse(text);

    if (
      Array.isArray(parsed) &&
      parsed.every((item) => item.name && item.artist)
    ) {
      return parsed;
    }

    throw new Error("잘못된 응답 형식");
  } catch (error) {
    console.error("추천 실패:", error);
    throw error;
  } finally {
    isRequesting = false;
  }
};
