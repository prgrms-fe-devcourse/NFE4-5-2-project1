export const checkAgeMatch = (
	condition: Condition,
	user: { gender: string; age: number }
) => {
	let isGenderMatched: boolean = false;
	let isAgeMatched: boolean = false;

	if (condition.gender === user.gender || condition.gender === "성별 무관")
		isGenderMatched = true;

	const ageRange = condition.ageRange.map((age) =>
		Number(age.replace("대", ""))
	);
	isAgeMatched = ageRange.some((age) => age / 10 === Math.floor(user.age / 10));
	return isGenderMatched && isAgeMatched;
};
