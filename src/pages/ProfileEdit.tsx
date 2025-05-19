import profile from '../assets/images/profile.svg';
import minus from '../assets/icons/minus.svg';
import Button from '../components/button';
import Jeju from '../assets/achievementIcons/jeju.svg';
import Cafe from '../assets/achievementIcons/cafe.svg';
import Hiking from '../assets/achievementIcons/hiking.svg';
import Alone from '../assets/achievementIcons/alone.svg';
import House from '../assets/achievementIcons/house.svg';
import KoreaPin from '../assets/achievementIcons/koreaPin.svg';
import PowerJ from '../assets/achievementIcons/PowerJ.svg';
import Star from '../assets/achievementIcons/Star.svg';
import Train from '../assets/achievementIcons/train.svg';
import Tag from '../components/Tag';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../api/axios';
import PasswordInput from '../components/PaswordInput';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

export default function ProfileEdit() {
    const userId = useAuthStore((state) => state.userId);
    const [user, setUser] = useState<{
        fullName: string;
        image: string;
        username: string;
    } | null>(null);
    const [text, setText] = useState('');
    const [editName, setEditName] = useState('');
    const [profileImgFile, setProfileImgFile] = useState<File | null>(null);
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isPasswordConfirm, setIsPasswordConfirm] = useState<boolean>(false);
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [hasInitialized, setHasInitialized] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isImageDeleted, setIsImageDeleted] = useState(false);

    const navigate = useNavigate();

    // 프로필 정보 업데이트 (이름, 소개, 칭호, 프로필 사진)
    const updateUser = async () => {
        setLoading(true);
        try {
            const username = selectedTags.length > 0 ? `${text.trim()} [${selectedTags.join(', ')}]` : text.trim();

            const res1 = await axiosInstance.put('/settings/update-user', {
                fullName: editName.trim(),
                username,
            });

            if (profileImgFile && !isImageDeleted) {
                const formData = new FormData();
                formData.append('image', profileImgFile);
                formData.append('isCover', 'false');

                const res2 = await axiosInstance.post('/users/upload-photo', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log('프로필사진 업데이트 결과:', res2.data);
            } else if (isImageDeleted) {
                const res3 = await axiosInstance.delete('/users/delete-photo', {
                    data: { isCover: false },
                });
                console.log('프로필사진 업데이트 결과:', res3.data);
            }
            toast.success('정보가 성공적으로 변경되었습니다!');
            console.log('업데이트 결과:', res1.data);
            window.scrollTo(0, 0);
            navigate('/myprofile');
        } catch (error) {
            console.error('업데이트 실패:', error);
            toast.error('정보 변경에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 비밀번호 업데이트
    const updatePassword = async () => {
        if (!isPasswordConfirm) {
            return toast('비밀번호가 일치하지 않습니다!');
        }
        try {
            const res = await axiosInstance.put('/settings/update-password', {
                password: newPassword.trim(),
            });
            toast.success('비밀번호가 변경되었습니다.');
            console.log('업데이트 결과:', res.data);
            setIsPasswordChanged(true);
        } catch (error) {
            console.error('업데이트 실패:', error);
            toast.error('정보 변경에 실패했습니다.');
        }
    };

    // 비밀번호 변경됐는지 확인
    useEffect(() => {
        setIsPasswordChanged(false);
    }, [newPassword, confirmPassword]);

    // 서버에서 정보 받아오기
    useEffect(() => {
        const getUser = async () => {
            if (!userId) return;
            const { data } = await axiosInstance.get(`users/${userId}`);
            console.log(data);
            setUser(data);
        };
        getUser();
    }, [userId]);

    // 이름 받아오기
    useEffect(() => {
        if (user?.fullName) {
            setEditName(user.fullName);
        }
    }, [user]);

    const rawUsername = user?.username ?? '';

    // 정규표현식으로 소개/칭호 분리
    const match = rawUsername.match(/^(.*)\s?\[(.*)\]$/);

    const introduction = match?.[1] ?? rawUsername;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const titles = match?.[2]?.split(',').map((t) => t.trim()) ?? [];

    // 소개 받아오기
    useEffect(() => {
        if (introduction) {
            setText(introduction);
        }
    }, [introduction]);

    // 프로필 이미지 변경 함수
    const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            const file = e.target.files[0];
            if (file) {
                setProfileImgFile(file);
                setIsImageDeleted(false);
            }
        }
    };

    const handleImgDelete = () => {
        setProfileImgFile(null);
        setIsImageDeleted(true);
    };

    // 칭호 선택 함수
    const tagFields = [
        { label: '제주 중독', icon: Jeju },
        { label: '밥보단 커피', icon: Cafe },
        { label: '김정호..?', icon: KoreaPin },
        { label: '1박 2일 애호가', icon: Star },
        { label: '낭만가', icon: Train },
        { label: 'Power J', icon: PowerJ },
        { label: '산타아저씨', icon: Hiking },
        { label: '혼자서도 잘해요', icon: Alone },
        { label: '한달살이 경험자', icon: House },
    ];

    const handleTagClick = (label: string) => {
        setSelectedTags((prev) => {
            const lowerLabel = label.toLowerCase();

            const alreadySelected = prev.some((tag) => tag.toLowerCase() === lowerLabel);

            if (alreadySelected) {
                return prev.filter((tag) => tag.toLowerCase() !== lowerLabel);
            } else {
                return prev.length < 2 ? [...prev, label] : prev;
            }
        });
    };

    // 칭호 받아와서 기본선택 적용
    useEffect(() => {
        if (!hasInitialized && titles.length > 0) {
            setSelectedTags(titles.slice(0, 2));
            setHasInitialized(true);
        }
    }, [titles, hasInitialized]);

    // 비밀번호
    useEffect(() => {
        if (!newPassword && !confirmPassword) {
            setIsPasswordConfirm(false);
        } else {
            setIsPasswordConfirm(newPassword === confirmPassword);
        }
    }, [newPassword, confirmPassword]);

    // 비밀번호 변경 버튼
    const handlePasswordSubmit = () => {
        updatePassword();
    };

    // 저장하기 버튼
    const handleSubmit = async () => {
        const hasPasswordInput = newPassword.trim() || confirmPassword.trim();

        if (hasPasswordInput && !isPasswordChanged) {
            toast('비밀번호 변경 버튼을 눌러주세요!');
            return;
        }
        updateUser();
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <div className="sm:px-28 pt-5 pb-4 montserrat">
                <div className="mx-auto min-w-[600px] max-w-[900px] w-[55vw] sm:px-32 sm:py-10 py-4 box-shadow-custom bg-[var(--color-white)] rounded-[10px]">
                    <div className="">
                        {/* 프로필이미지 */}
                        <div className="flex items-center">
                            <div
                                className="relative w-[150px] h-[150px] rounded-full overflow-hidden group mr-4 flex-shrink-0 cursor-pointer"
                                onClick={handleImgDelete}
                            >
                                {/* 이미지 */}
                                <img
                                    src={
                                        profileImgFile !== null
                                            ? URL.createObjectURL(profileImgFile)
                                            : isImageDeleted
                                            ? profile
                                            : user?.image || profile
                                    }
                                    alt="프로필 이미지"
                                    className="w-full h-full object-cover"
                                />

                                {!isImageDeleted && (
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full">
                                        <img src={minus} className="w-11" />
                                    </div>
                                )}
                            </div>
                            <div className="custom-flex-between items-center w-full">
                                <div className="flex flex-col mr-1">
                                    <span className="text-2xl font-bold">{user?.fullName}</span>
                                    <span className="text-base font-medium overflow-hidden truncate max-w-[290px]">
                                        {introduction}
                                    </span>
                                </div>
                                <label
                                    htmlFor="profileImg"
                                    className="ml-auto text-white text-[13px] font-semibold w-[113px] h-[33px] bg-[var(--color-main-skyBlue)] rounded-md flex items-center justify-center cursor-pointer"
                                >
                                    프로필 사진 변경
                                </label>
                            </div>
                            <input id="profileImg" type="file" className="hidden" onChange={handleImgChange} />
                        </div>

                        <div className="my-8">
                            {/* 이름 */}
                            <div className="flex flex-col gap-1.5 mb-7">
                                <p>이름</p>
                                <input
                                    placeholder="사용자 이름"
                                    type="text"
                                    className="bg-white rounded-xl border-[#c2c2c2] border h-11 px-3 focus:outline"
                                    value={editName}
                                    maxLength={15}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                            </div>

                            {/* 소개 */}
                            <div className="flex flex-col mb-5 gap-1.5">
                                <p>소개 (200자 이내)</p>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="사용자 소개"
                                    maxLength={200}
                                    className="bg-white rounded-xl border-[#c2c2c2] border h-24 px-3 py-3 resize-none focus:outline focus:outline-[#60B5FF]"
                                />
                                <div className="text-right text-sm text-gray-500 mt-1 montserrat">
                                    {text.length} / 200
                                </div>
                            </div>

                            {/* 칭호관리 */}
                            <div className="flex flex-col gap-1.5">
                                <p>칭호 관리 (최대 2개 선택 가능)</p>
                                <div className="bg-white px-1.5 pt-4 pb-2 rounded-xl border-[#c2c2c2] border flex flex-wrap justify-center">
                                    {tagFields.map((field) => (
                                        <div>
                                            <Tag
                                                icon={field.icon}
                                                label={field.label}
                                                selected={selectedTags.some(
                                                    (tag) => tag.toLowerCase() === field.label.toLowerCase()
                                                )}
                                                onClick={() => handleTagClick(field.label)}
                                            />
                                        </div>
                                    ))}
                                    <div className="w-full flex justify-end mt-2 px-1.5">
                                        <div className="text-sm text-gray-500 montserrat">
                                            {selectedTags.length} / 2
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 비밀번호 변경*/}
                            <div className="flex flex-col mt-9 mb-10 gap-1.5">
                                <PasswordInput label="새로운 비밀번호" value={newPassword} onChange={setNewPassword} />
                                <PasswordInput
                                    label="비밀번호 확인"
                                    value={confirmPassword}
                                    onChange={setConfirmPassword}
                                />
                                <div className="flex justify-end">
                                    <Button
                                        className="text-white font-semibold w-[113px] h-[33px] bg-[var(--color-main-skyBlue)] rounded-md mt-6"
                                        onClick={handlePasswordSubmit}
                                    >
                                        변경하기
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* 버튼 */}
                        <div className="flex gap-3 justify-end">
                            <Button
                                className="w-[100px] h-[40px] bg-white text-[var(--color-main-navy)] text-base font-bold rounded-[10px] border border-[#d1d1d1]"
                                onClick={() => navigate('/myprofile')}
                            >
                                취소
                            </Button>
                            <Button
                                className="w-[100px] h-[40px] bg-[var(--color-main-navy)]  text-white text-base font-bold rounded-[10px]"
                                onClick={handleSubmit}
                            >
                                저장
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
