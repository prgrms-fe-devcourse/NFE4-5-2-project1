export const formatDate = (date: Date) => {
	const month = (date.getMonth() + 1).toString();
	const day = date.getDate().toString();
	return `${date.getFullYear()}-${month.length === 1 ? `0${month}` : month}-${
		day.length === 1 ? `0${day}` : day
	}`;
};

export const formatTime = (date: Date) => {
	const hours = date.getHours().toString();
	const minutes = date.getMinutes().toString();
	return `${hours.length === 1 ? `0${hours}` : hours}:${minutes.length === 1 ? `0${minutes}` : minutes}`;
};

export const getDiffInDays = (date1: Date, date2: Date) => {
	const oneDayMs = 1000 * 60 * 60 * 24;
	let diff = oneDayMs;
	if (date2) {
		diff = new Date(date2).getTime() - new Date(date1).getTime();
	}
	return Math.floor(diff / oneDayMs);
};

export function formatDateRange(dateRangeInput: unknown): string {
	let dates: string[] = [];
	// yy.mm.dd - yy.mm.dd
	if (Array.isArray(dateRangeInput)) {
		dates = dateRangeInput as string[];
	}
	// yy.mm.dd
	else if (typeof dateRangeInput === "string") {
		const matches = dateRangeInput.match(
			/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g
		);
		if (matches) {
			dates = matches;
		}
	}

	if (dates.length === 0) return "잘못된 날짜";

	const format = (dateStr: string) => {
		const date = new Date(dateStr);
		const yy = String(date.getFullYear()).slice(2);
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");
		return `${yy}.${mm}.${dd}`;
	};

	if (dates.length === 1) return format(dates[0]);
	if (dates.length === 2) return `${format(dates[0])} - ${format(dates[1])}`;

	return "잘못된 날짜";
}
