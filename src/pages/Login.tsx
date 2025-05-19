import React, { useState } from "react";
import { useNavigate } from "react-router";
import { loginUser } from "../apis/auth";
import SignupLogo from "../assets/images/Signup_logo.svg";
import Button from "../components/commons/Button";
import Icon from "../components/commons/Icon";
import { showToast } from "../components/commons/Toast";
import { useNoti } from "../context/useNoti";
import { useAuthStore } from "../store/authStore";

export default function Login() {
	const navigate = useNavigate();
	const login = useAuthStore((state) => state.login);
	const [form, setForm] = useState({
		email: "",
		password: ""
	});
	const [errors, setErrors] = useState<{ email?: string }>({});
	const [hoveredField, setHoveredField] = useState<string | null>(null);
	// 추가
	const [focusedField, setFocusedField] = useState<string | null>(null);

	const { refetchNotiList } = useNoti();

	const handleSignupClick = () => {
		navigate("/signup");
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const newErrors: { email?: string } = {};

		if (!emailRegex.test(form.email)) {
			newErrors.email = "*이메일 형식이 올바르지 않습니다.";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		try {
			const data = await loginUser(form.email, form.password);
			console.log("서버응답", data);

			if (data?.token) {
				login(data.token, data.user);
				showToast({ type: "success", message: "로그인에 성공했습니다!" });
				navigate("/");
				await refetchNotiList(); //알림
			} else {
				showToast({
					type: "error",
					message: "이메일 또는 비밀번호가 올바르지 않습니다."
				});
			}
		} catch (error) {
			showToast({ type: "warning", message: "로그인 중 오류가 발생했습니다." });
			console.error(error);
		}
	};
	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="w-[460px] mx-auto flex flex-col text-[#333333]"
			>
				<img
					src={SignupLogo}
					alt="TripUs 로고"
					className="w-[300px] sm:w-[278px] h-[106px] mx-auto mt-[210px] sm:mt-[223px] mb-[26px] cursor-pointer"
					onClick={() => navigate("/")}
				/>
				<div className="flex flex-col mb-[11px] w-[360px] sm:w-full mx-auto">
					<div
						className="relative group"
						onMouseEnter={() => setHoveredField("email")}
						onMouseLeave={() => setHoveredField(null)}
					>
						<div className="absolute left-4 top-1/2 -translate-y-1/2 w-[20px] h-[20px]">
							<Icon
								size="20px"
								position={
									hoveredField === "email" || focusedField === "email"
										? " 52% 73.352%"
										: "52% 66.209%"
								}
							/>
						</div>
						<input
							name="email"
							placeholder="이메일"
							value={form.email}
							onChange={handleChange}
							onFocus={() => setFocusedField("email")}
							onBlur={() => setFocusedField(null)}
							className="inputProps"
						/>
					</div>
					<p className="text-[#DB1F5A] text-xs font-bold mt-[1px] h-[14px] leading-tight">
						{errors.email ?? ""}
					</p>
				</div>
				<div
					className="relative group w-[360px] sm:w-full mx-auto mb-[26px]"
					onMouseEnter={() => setHoveredField("password")}
					onMouseLeave={() => setHoveredField(null)}
				>
					<div className="absolute left-4 top-1/2 -translate-y-1/2 w-[20px] h-[20px]">
						<Icon
							size="22px"
							position={
								hoveredField === "password" || focusedField === "password"
									? "66.079% 73.743%"
									: "66.079% 66.48%"
							}
						/>
					</div>
					<input
						name="password"
						type="password"
						placeholder="비밀번호"
						value={form.password}
						onChange={handleChange}
						onFocus={() => setFocusedField("password")}
						onBlur={() => setFocusedField(null)}
						className="inputProps"
					/>
				</div>

				<Button
					type="submit"
					className="w-[360px] sm:w-full mx-auto h-[60px] mb-[26px]"
				>
					로그인
				</Button>
				<Button
					type="button"
					onClick={handleSignupClick}
					reverse
					className="w-[360px] sm:w-full h-[60px] mx-auto border-[1px] dark:bg-transparent dark:hover:bg-[#333]"
				>
					회원가입
				</Button>
			</form>
		</>
	);
}
