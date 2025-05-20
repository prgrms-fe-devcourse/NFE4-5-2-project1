'use client';

import api from '../../api';
import { useState, useEffect } from 'react';
import Icon from '../atoms/Icon';
import UserAvatar from '../atoms/UserAvatar';
import { updateUser, uploadPhoto } from '../../api/users';
import { getAuthUser } from '../../api/auth';
import { toast } from 'react-toastify';
import Button from '../atoms/Button';
import { useNavigate } from 'react-router-dom';
import { useDarkModeStore } from '../../stores/darkModeStore';
import { AxiosError } from 'axios';

export default function Setting() {
  const [user, setUser] = useState<User | null>(null); // 사용자 데이터
  const [file, setFile] = useState<File | null>(null); // 프로필 이미지 파일
  const [form, setForm] = useState({
    fullName: '',
    introduction: '',
    tags: '',
    email: '',
    github: '',
    velog: '',
    homepage: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await getAuthUser();
        setUser(currentUser);

        const userMeta = currentUser.username
          ? JSON.parse(currentUser.username)
          : {};

        setForm({
          fullName: currentUser.fullName ?? '',
          introduction: userMeta.introduction ?? '',
          tags: (userMeta.tags || []).join(', '),
          email: userMeta.email ?? '',
          github: userMeta.github ?? '',
          velog: userMeta.velog ?? '',
          homepage: userMeta.homepage ?? '',
        });
      } catch (error) {
        console.error('사용자 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // 다크모드 전역상태로 관리
  const darkModeToggle = useDarkModeStore((state) => state.isDarkMode);
  const toggleDarkMode = useDarkModeStore((state) => state.toggleDarkMode);

  // esc 누르면 메인으로 이동하는 훅
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof typeof form,
  ) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return toast.error('이미지를 선택해주세요.');
    }
    try {
      const result = await uploadPhoto(file, false);
      // isCover = false → 프로필 이미지
      console.log('업로드 성공', result);
      toast.success('사진이 변경되었습니다.');
      const updatedUser = await getAuthUser();
      setUser(updatedUser);
      localStorage.setItem('myImage', updatedUser.image);
    } catch (error) {
      console.error('이미지 업로드 실패', error);
      toast.error('이미지 업로드 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const deletePhoto = (isCover: boolean) => {
    return api
      .delete('/users/delete-photo', { data: { isCover } })
      .then((res) => res.data);
  };

  const handleDeleteImage = async () => {
    try {
      await deletePhoto(false); // false: 프로필 이미지 삭제
      const updatedUser = await getAuthUser(); // 최신 사용자 정보로 갱신
      setUser(updatedUser);
      localStorage.removeItem('myImage');
      toast.success('기본 프로필 이미지로 변경되었습니다.');
      console.log(updatedUser);
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      toast.error('이미지 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleApply = async () => {
    if (!form.fullName.trim()) {
      toast.error('닉네임은 필수 입력 항목입니다.');
      return;
    }
    try {
      const tags = form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
      const payload = {
        fullName: form.fullName,
        introduction: form.introduction,
        tags,
        email: form.email,
        github: form.github,
        velog: form.velog,
        homepage: form.homepage,
      };
      await updateUser(payload);
      const updatedUser = await getAuthUser(); // 최신 정보 다시 불러오기
      setUser(updatedUser); // 상태 갱신
      console.log('업데이트된 유저 정보:', updatedUser); // ✅ 콘솔 출력
      toast.success('변경 사항이 저장되었습니다.');
    } catch (err) {
      console.error(err);
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  const deleteUser = (userId: string) =>
    api
      .delete('/users/delete-user', {
        data: { id: userId },
      })
      .then((res) => res.data);
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    );
    if (!confirmed || !user) return;

    try {
      await deleteUser(user._id);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('myId');
      localStorage.removeItem('myImage');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      toast.success(
        <>
          회원 탈퇴가 완료되었습니다. <br />
          잠시 후 메인화면으로 이동합니다.
        </>,
      );
    } catch (error) {
      const err = error as AxiosError;
      // 401 에러도 성공으로 간주
      if (err?.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('myId');
        localStorage.removeItem('myImage');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
        toast.success(
          <>
            회원 탈퇴가 완료되었습니다. <br />
            잠시 후 메인화면으로 이동합니다.
          </>,
        );
        return;
      }
      console.error('회원 탈퇴 실패:', error);
      toast.error('회원 탈퇴 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="nanum-gothic-regular dark:text-dark-text dark:border-dark-border ml-[42px] w-[950px] transition-colors duration-300 ease-in-out">
      <div className="mb-[10px] flex">
        <div
          onClick={() => navigate('/')}
          className="cursor-pointer dark:contrast-75 dark:invert"
        >
          <Icon name="leftIcon" />
        </div>
        <div className="ml-[20px]">설정</div>
      </div>

      <div className="dark:bg-dark-card dark:border-dark-border rounded-[5px] border border-[#ababab] p-6 transition-colors duration-300">
        <div className="ml-[28px] flex items-end gap-5">
          <UserAvatar size={120} imageUrl={user?.image} />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="dark:border-dark-border dark:bg-dark-card cursor-pointer rounded-[5px] border text-[12px] transition-colors"
          />

          <Button size="s" full onClick={handleUpload}>
            이미지 업로드
          </Button>
          <Button size="s" onClick={handleDeleteImage}>
            이미지 삭제
          </Button>

          <label className="ml-[100px] inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={darkModeToggle}
              onChange={toggleDarkMode}
            />

            <div className="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-blue-600 dark:peer-focus:ring-blue-800"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              다크모드
            </span>
          </label>
        </div>

        <hr className="dark:border-dark-border my-5 border-t border-[#ababab]" />

        <div className="ml-[28px] space-y-6">
          <div>
            <div className="nanum-gothic-bold mb-1">닉네임</div>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => handleInputChange(e, 'fullName')}
              placeholder="설정할 닉네임을 입력해주세요."
              className="dark:text-dark-text dark:border-dark-border dark:bg-dark-card h-[38px] w-[255px] rounded-[5px] border p-3 text-[12px] transition-colors"
            />
          </div>

          <div>
            <div className="nanum-gothic-bold mb-1">한 줄 소개</div>
            <input
              type="text"
              value={form.introduction}
              onChange={(e) => handleInputChange(e, 'introduction')}
              placeholder="한 줄로 나를 소개해 보세요!"
              className="dark:text-dark-text dark:border-dark-border dark:bg-dark-card h-[38px] w-[520px] rounded-[5px] border p-3 text-[12px] transition-colors"
            />
          </div>

          <div>
            <div className="nanum-gothic-bold mb-1">기술 스택</div>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => handleInputChange(e, 'tags')}
              placeholder="예: React, TypeScript, Node.js"
              className="dark:text-dark-text dark:border-dark-border dark:bg-dark-card h-[38px] w-[520px] rounded-[5px] border p-3 text-[12px] transition-colors"
            />
          </div>

          <div>
            <div className="nanum-gothic-bold mb-1">소셜 정보</div>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: 'mailIcon', key: 'email', placeholder: '이메일 주소' },
                {
                  icon: 'githubIcon',
                  key: 'github',
                  placeholder: '깃허브 주소',
                },
                { icon: 'velogIcon', key: 'velog', placeholder: '벨로그 주소' },
                {
                  icon: 'homepageIcon',
                  key: 'homepage',
                  placeholder: '홈페이지 주소',
                },
              ].map(({ icon, key, placeholder }, i) => (
                <div key={i} className="relative">
                  <div className="absolute top-1/2 left-2 -translate-y-1/2 dark:contrast-75 dark:invert">
                    <Icon name={icon} />
                  </div>
                  <input
                    type="text"
                    value={form[key as keyof typeof form]}
                    onChange={(e) =>
                      handleInputChange(e, key as keyof typeof form)
                    }
                    placeholder={`${placeholder}를 입력해주세요`}
                    className="dark:text-dark-text dark:border-dark-border dark:bg-dark-card h-[38px] w-[200px] rounded-[5px] border pr-3 pl-[36px] text-[12px] transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="nanum-gothic-bold relative mt-[36px] mb-36 ml-[5px] flex justify-between">
        <button
          onClick={handleDeleteAccount}
          className="cursor-pointer text-red-500"
        >
          회원탈퇴
        </button>

        <div className="absolute right-0">
          <Button size="m" full onClick={handleApply}>
            적용
          </Button>
        </div>
      </div>
    </div>
  );
}
