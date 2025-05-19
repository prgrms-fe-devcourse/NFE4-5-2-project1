import { useState } from "react";
import { FieldErrors, FormProvider, UseFormReturn } from "react-hook-form";
import ReactQuill from "react-quill-new";
import { useNavigate } from "react-router";
import { CHANNELS } from "../../../constants/posts";
import { useThemeStore } from "../../../store/themeStore";
import Button from "../../commons/Button";
import Icon from "../../commons/Icon";
import ConditionList from "./ConditionList";
import Contents from "./Contents";
import InfoForm from "./InfoForm";
import InputTitle from "./InputTitle";
import InputUrl from "./InputUrl";
import UploadImage from "./UploadImage";

interface PostFormProps {
	submitHandler: (data: FormValues) => void;
	errorHandler: (errors: FieldErrors<FormValues>) => void;
	contentsRef: React.RefObject<ReactQuill | null>;
	imageProps: {
		showImages: string[];
		addImage: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
		removeImage: (image: string) => void;
	};
	initImages: (images: string[]) => void;
	methods: UseFormReturn<FormValues>;
	type: string;
}

export default function PostForm({
	submitHandler,
	errorHandler,
	contentsRef,
	imageProps,
	initImages,
	methods,
	type
}: PostFormProps) {
	const { isDark } = useThemeStore();
	const navigate = useNavigate();
	const [isConfirmed, setIsConfirmed] = useState(0);
	const confirmHandler = () => {
		setIsConfirmed((state) => (state ? 0 : 1));
	};
	const isEditing = type === "edit";
	return (
		<div className="flex justify-center">
			<main className="font-[Noto-Sans] sm:w-275 w-full">
				<div className="sm:hidden flex items-center fixed w-full bg-white dark:bg-[#1B1D22] border-b dark:border-[#4a4b4d] z-10 border-[#f3f3f3] h-[70px]">
					<div className="flex items-center gap-4 p-4 fixed">
						<Icon
							onClick={() => navigate(-1)}
							position={isDark ? "50.218% 27.747%" : "39.301% 27.747%"}
							size="16px"
						/>
						<h2 className="text-lg font-medium">게시글 등록</h2>
					</div>
				</div>
				<div className="sm:hidden h-[100px]" />
				<FormProvider {...methods}>
					<form
						className="sm:mt-10 px-6"
						action=""
						onSubmit={methods.handleSubmit(submitHandler, errorHandler)}
					>
						<InfoForm
							initImages={initImages}
							isEditing={isEditing}
							confirmHandler={confirmHandler}
						/>
						<div className="flex flex-col gap-10 sm:my-13 mt-[30px]">
							<InputUrl />
							<InputTitle />
							<Contents contentsRef={contentsRef} isConfirmed={isConfirmed} />
							{methods.watch().channel === CHANNELS.RECRUITMENT && (
								<UploadImage {...imageProps} />
							)}
							<ConditionList isEditing={isEditing} />
						</div>
						<div className="flex items-center justify-between sm:mt-0 mt-[66px] sm:mb-20 mb-25">
							<div
								onClick={() => navigate(-1)}
								className="sm:flex hidden justify-center items-center gap-4 cursor-pointer "
							>
								<Icon
									position={isDark ? "50.218% 27.747%" : "39.301% 27.747%"}
									size="16px"
								/>
								<span className="text-xl">나가기</span>
							</div>
							<Button type="submit" className="sm:w-50 w-full">
								등록하기
							</Button>
						</div>
					</form>
				</FormProvider>
			</main>
		</div>
	);
}
