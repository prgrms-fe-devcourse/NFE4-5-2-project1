import { FieldErrors } from "react-hook-form";
import { showToast } from "../components/commons/Toast";

export const formErrorHandler = (errors: FieldErrors<FormValues>) => {
	if (errors.location) {
		showToast({ type: "error", message: errors.location.message });
	} else if (errors.dateRange) {
		showToast({ type: "error", message: errors.dateRange.message });
	} else if (errors.url) {
		showToast({ type: "error", message: errors.url.message });
	} else if (errors.title) {
		const titleLen = errors.title.ref?.value.length;
		showToast({
			type: "error",
			message: errors.title.message + ` (현재 : ${titleLen}자)`
		});
	} else if (errors.condition?.gender) {
		showToast({ type: "error", message: errors.condition.gender.message });
	} else if (errors.condition?.ageRange) {
		showToast({ type: "error", message: errors.condition.ageRange.message });
	}
};
