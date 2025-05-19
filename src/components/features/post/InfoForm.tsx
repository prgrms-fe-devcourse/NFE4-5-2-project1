import { Korean } from "flatpickr/dist/l10n/ko.js";
import "flatpickr/dist/themes/material_green.css";
import { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useController, useFormContext, useWatch } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { CHANNELS } from "../../../constants/posts";
import useConfirm from "../../../hooks/useConfirm";
import Confirm from "../../commons/Confirm";
import CustomSelect from "../../commons/CustomSelect";
import AutoComplete from "./AutoComplete";

export default function InfoForm({
	initImages,
	isEditing,
	confirmHandler
}: {
	initImages: (images: string[]) => void;
	isEditing: boolean;
	confirmHandler: () => void;
}) {
	const { confirmOpen, toggleConfirm } = useConfirm();

	const {
		register,
		reset,
		setValue,
		control,
		formState: { dirtyFields }
	} = useFormContext();
	const otherFieldChanged = Object.keys(dirtyFields).some(
		(field) => field !== "channel"
	);
	const { field } = useController({
		name: "dateRange",
		control: control
	});
	const watchedChannel = useWatch({
		control,
		name: "channel"
	});

	const changeChannelHandler = () => {
		reset({
			channel: watchedChannel,
			member: "2",
			location: "",
			dateRange: [],
			title: "",
			contents: "",
			description: "",
			condition: {
				gender: "",
				ageRange: []
			},
			images: []
		});
		initImages([]);
		toggleConfirm();
		confirmHandler();
	};

	const cancelHandler = () => {
		if (watchedChannel === CHANNELS.RECRUITMENT) {
			setValue("channel", CHANNELS.REVIEW);
		} else {
			setValue("channel", CHANNELS.RECRUITMENT);
		}
	};

	const [isFocused, setIsFocused] = useState(false);
	useEffect(() => {
		if (!watchedChannel || isEditing) return;
		if (otherFieldChanged) {
			toggleConfirm();
		}
	}, [watchedChannel, reset, isEditing]);

	return (
		<>
			{confirmOpen && (
				<Confirm
					confirmHandler={changeChannelHandler}
					cancelHandler={cancelHandler}
					title="게시판을 변경하시겠습니까?"
					description="작성 중인 내용이 모두 삭제됩니다."
					confirmBtn="변경"
				/>
			)}
			<div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-15 gap-[30px]">
				<CustomSelect
					isEditing={isEditing}
					name="channel"
					label="게시판 선택"
					options={[
						{ label: "크루 모집", value: CHANNELS.RECRUITMENT },
						{ label: "항해 일지", value: CHANNELS.REVIEW }
					]}
				/>
				{watchedChannel === CHANNELS.RECRUITMENT ? (
					<CustomSelect
						isEditing={isEditing}
						name="member"
						label="모집 인원 선택"
						options={Array.from({ length: 9 }, (_, idx) => ({
							label: idx + 2,
							value: String(idx + 2)
						}))}
					/>
				) : (
					<div className="sm:block hidden" />
				)}
				<div className="relative flex sm:flex-col w-full sm:items-start items-center justify-between">
					<label
						htmlFor="location"
						className={twMerge(
							"post-input-title",
							isEditing && "text-[#aaaaaa] dark:text-[#666]"
						)}
					>
						지역 입력
					</label>
					<div className="relative flex flex-col flex-1 w-full">
						<input
							disabled={isEditing}
							id="location"
							type="text"
							placeholder="지역 입력"
							autoComplete="off"
							className={twMerge(
								"input-style placeholder:text-[#CDCDCD] focus:outline-0",
								"dark:placeholder:text-[#616161] dark:border-[#616161]",
								"disabled:text-[#aaaaaa]"
							)}
							{...register("location")}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
						/>
						{isFocused && <AutoComplete />}
					</div>
				</div>
				<div className="flex sm:flex-col sm:items-start items-center justify-between">
					<label
						htmlFor="date"
						className={twMerge(
							"post-input-title",
							isEditing && "text-[#aaaaaa] dark:text-[#666]"
						)}
					>
						일정 선택
					</label>
					<Flatpickr
						disabled={isEditing}
						id="date"
						className={twMerge(
							"flex-1 input-style placeholder:text-[#CDCDCD] focus:outline-0",
							"dark:placeholder:text-[#616161] dark:border-[#616161]",
							"disabled:cursor-default! disabled:text-[#aaaaaa]"
						)}
						options={{
							mode: "range",
							dateFormat: "Y-m-d",
							closeOnSelect: false,
							locale: Korean,
							position: "below right",
							...(watchedChannel === CHANNELS.RECRUITMENT
								? { minDate: "today" }
								: { maxDate: "today" })
						}}
						placeholder="일정 선택"
						onChange={(selectedDates) => {
							if (selectedDates.length < 2) {
								document.getElementById("date")?.focus();
							}
							field.onChange(selectedDates);
						}}
						value={field.value}
					/>
				</div>
			</div>
		</>
	);
}
