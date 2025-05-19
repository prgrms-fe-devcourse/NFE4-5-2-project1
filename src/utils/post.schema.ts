import { z } from "zod";
import { CHANNELS } from "../constants/posts";

export const postFormSchema = z
	.object({
		channel: z.string(),
		member: z.string(),
		location: z
			.string()
			.min(1, "지역을 입력해주세요")
			.regex(
				/[A-Za-z가-힣]/,
				"지역은 영문 대소문자 또는 한글만 입력 가능합니다"
			),
		dateRange: z.array(z.date()).min(1, "일정을 선택해주세요"),
		title: z
			.string()
			.min(2, "제목은 최소 2자 이상이어야 합니다")
			.max(20, "제목은 최대 20자까지 가능합니다"),
		condition: z
			.object({
				gender: z.string(),
				ageRange: z.array(z.string())
			})
			.optional(),
		images: z.array(z.string()),
		url: z.string().optional()
	})
	.superRefine((data, ctx) => {
		if (data.channel !== CHANNELS.REVIEW) {
			if (!data.condition?.gender) {
				ctx.addIssue({
					path: ["condition", "gender"],
					code: "custom",
					message: "성별을 선택해 주세요"
				});
			}

			if (!data.condition?.ageRange || data.condition.ageRange.length === 0) {
				ctx.addIssue({
					path: ["condition", "ageRange"],
					code: "custom",
					message: "나이를 선택해 주세요(다중 선택 가능)"
				});
			}
		}
		if (data.url) {
			const regex = /https:\/\/open.kakao.com\/o\/[A-Za-z0-9]{8}/;
			if (!regex.test(data.url)) {
				ctx.addIssue({
					path: ["url"],
					code: "custom",
					message: "오픈 카톡 주소 형식이 틀렸습니다"
				});
			}
		}
	});
