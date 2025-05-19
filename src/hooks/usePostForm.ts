import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CHANNELS } from "../constants/posts";
import { postFormSchema } from "../utils/post.schema";

export function usePostForm(defaultValues?: Partial<FormValues>) {
	return useForm<FormValues>({
		mode: "onSubmit",
		resolver: zodResolver(postFormSchema),
		shouldFocusError: false,
		defaultValues: {
			channel: CHANNELS.RECRUITMENT,
			member: "2",
			location: "",
			dateRange: [],
			title: "",
			condition: {
				gender: "",
				ageRange: []
			},
			images: [],
			url: "",
			...(defaultValues || {})
		}
	});
}
