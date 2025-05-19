import { useCallback, useEffect, useMemo, useState } from 'react';
import ImageEditBtn from '../../../assets/images/img-edit/img-edit-btn.svg';
import { fullNameRegex, passwordRegex } from '../../../utils/validators';
import EditMenu from './EditMenu';
import Input from '../../../components/common/Input';
import { axiosInstance } from '../../../api/axios';
import PhotoUploadModal from './PhotoUploadModal';
import Button from '../../../components/common/Button';
import { getUserData } from '../../../api/profileInfo/profile';
import { useAuthStore } from '../../../stores/authStore';
import defaultProfileImage from '../../../assets/images/profile/default-profile-img.jpg';
import defaultCover from '../../../assets/images/profile/default-cover.png';
import { useNavigate } from 'react-router-dom';
import { Theme } from '../../../types/darkModeTypes';
import { dark } from '../../../utils/darkModeUtils';

export default function EditProfile({ userId, theme }: { userId: string; theme: Theme }) {
  const navigator = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [userData, setUserData] = useState<User | null>(null);

  const [enteredUserValues, setEnteredUserValues] = useState<EnteredValues>({
    myName: user?.fullName || '',
    password: '',
    confirmPassword: '',
  });

  const [enteredErrorValues, setEnteredErrorValues] = useState<EnteredErrorValues>({
    myNameError: '',
    passwordError: '',
    confirmPasswordError: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBackgroundMenuOpen, setIsBackgroundMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCover, setIsCover] = useState(false);

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  // 보이는 이미지만 변경
  const coverPreviewUrl = useMemo(() => {
    return coverImage ? URL.createObjectURL(coverImage) : null;
  }, [coverImage]);

  const profilePreviewUrl = useMemo(() => {
    return profileImage ? URL.createObjectURL(profileImage) : null;
  }, [profileImage]);

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
      if (profilePreviewUrl) URL.revokeObjectURL(profilePreviewUrl);
    };
  }, [coverPreviewUrl, profilePreviewUrl]);

  const validateUsername = (name: string) => fullNameRegex.test(name);
  const validatePassword = (password: string) => passwordRegex.test(password);

  /// input 변경 시 유효성 검사 (변경될 때마다 검사)
  const handleInputChange = (identifier: string, value: string) => {
    setEnteredUserValues((prev) => ({ ...prev, [identifier]: value }));

    let errorMessage = '';
    if (identifier === 'myName') {
      if (!value) errorMessage = '이름은 필수 입력 항목입니다.';
      else if (!validateUsername(value)) errorMessage = '이름은 특수문자 없이 10글자 이하로 입력해주세요.';
    }
    if (identifier === 'password') {
      if (!value) errorMessage = '비밀번호는 필수 입력 항목입니다.';
      else if (!validatePassword(value)) errorMessage = '비밀번호는 영문, 숫자, 특수문자 포함해 8~16자로 입력해주세요.';
    }
    if (identifier === 'confirmPassword') {
      if (value !== enteredUserValues.password) errorMessage = '비밀번호가 일치하지 않습니다.';
    }

    setEnteredErrorValues((prevErrors) => ({
      ...prevErrors,
      [`${identifier}Error`]: errorMessage,
    }));
  };

  const fetchUserData = useCallback(async () => {
    try {
      const { data: userData } = await getUserData(userId);
      setUserData(userData);
    } catch (error) {
      console.error('getUserData 오류:', error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchUserData();
  }, [userId, fetchUserData]);

  // 모달로 받은 사진 저장
  const handleSavePhoto = (file: File) => {
    if (isCover) {
      setCoverImage(file);
    } else {
      setProfileImage(file);
    }
  };

  // 이미지 삭제 -> 기본 이미지로 대체
  const handleDelete = async () => {
    setIsBackgroundMenuOpen(false);
    setIsProfileMenuOpen(false);

    const imagePath = isCover ? defaultCover : defaultProfileImage;
    const response = await fetch(imagePath);
    const blob = await response.blob();

    const file = new File([blob], 'default-image.jpg', { type: blob.type });

    if (isCover) {
      setCoverImage(file);
    } else {
      setProfileImage(file);
    }
  };

  // 파일 -> url 변경
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  // 제출할 때 에러 메시지 있으면 제출하지 않음. 제출 시 api 호출하여 정보 변경
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { myName, password, confirmPassword } = enteredUserValues;

    const newErrors = {
      myNameError: '',
      passwordError: '',
      confirmPasswordError: '',
    };

    if (!myName) newErrors.myNameError = '이름은 필수 입력 항목입니다.';
    else if (!validateUsername(myName)) newErrors.myNameError = '이름은 특수문자 없이 10글자 이하로 입력해주세요.';
    else if (!password) newErrors.passwordError = '비밀번호는 필수 입력 항목입니다.';
    else if (!validatePassword(password))
      newErrors.passwordError = '비밀번호는 영문, 숫자, 특수문자를 포함해 8~16자로 입력해주세요.';
    else if (!confirmPassword) newErrors.confirmPasswordError = '비밀번호 확인은 필수 입력 항목입니다.';
    else if (confirmPassword !== password) newErrors.confirmPasswordError = '비밀번호가 일치하지 않습니다.';

    if (newErrors.myNameError || newErrors.passwordError || newErrors.confirmPasswordError) {
      setEnteredErrorValues(newErrors);
      return;
    }

    try {
      await axiosInstance.put('/settings/update-user', {
        fullName: myName,
        username: myName,
      });
      await axiosInstance.put('/settings/update-password', { password });

      if (coverImage) {
        const formDataCover = new FormData();
        formDataCover.append('image', coverImage);
        formDataCover.append('isCover', 'true');
        await axiosInstance.post('/users/upload-photo', formDataCover, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      let updatedImage: string | undefined;
      // 프로필 이미지는 헤더에도 보여서 주수탄드 변경
      if (profileImage) {
        const formDataProfile = new FormData();
        formDataProfile.append('image', profileImage);
        formDataProfile.append('isCover', 'false');
        await axiosInstance.post('/users/upload-photo', formDataProfile, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        updatedImage = await fileToBase64(profileImage);
      }

      if (user) {
        setUser({
          ...user,
          ...(updatedImage && { image: updatedImage }),
          ...(myName && { fullName: myName }),
        });
      }
      navigator('/profile');
    } catch (error) {
      console.error('프로필 저장 중 오류 발생:', error);
    }
  };

  if (!userData) {
    return <div className='text-center py-10 text-gray-500'>로딩 중...</div>;
  }

  return (
    <>
      <div className='w-full h-full pb-[30px]'>
        <div
          className={`w-full h-full max-h-[821px] grid grid-rows-[auto_1fr] rounded-[10px] shadow-md font-semibold ${
            dark(theme) ? 'bg-[#2d2d2d]' : 'bg-[#ffffff]'
          }`}
        >
          <div className='relative h-[223px] rounded-t-[10px]'>
            <img
              src={coverPreviewUrl || userData.coverImage || defaultCover}
              className='w-full h-full rounded-t-[10px]'
              alt='Background'
            />
            <div className='absolute bottom-[19px] right-3'>
              <img
                src={ImageEditBtn}
                alt='BackgroundEdit'
                className='cursor-pointer w-[30px] h-[30px]'
                onClick={() => {
                  setIsBackgroundMenuOpen((prev) => !prev);
                  setIsCover(true);
                }}
              />
              {isBackgroundMenuOpen && (
                <EditMenu
                  onEdit={() => setIsModalOpen(true)}
                  onDelete={handleDelete}
                  onClose={() => setIsBackgroundMenuOpen(false)}
                  theme={theme}
                />
              )}
            </div>
          </div>

          <div className='h-full flex flex-wrap justify-evenly gap-x-6 items-center px-5 py-5 overflow-y-auto scroll-custom'>
            <div className='relative inline-block'>
              <img
                src={profilePreviewUrl || userData.image || defaultProfileImage}
                className='w-[300px] h-[300px] rounded-[5px] border border-[#E3E3E3] object-cover'
                alt='Profile'
              />
              <div className='absolute bottom-[19px] right-3'>
                <img
                  src={ImageEditBtn}
                  alt='ProfileEdit'
                  className='cursor-pointer w-[30px] h-[30px]'
                  onClick={() => {
                    setIsProfileMenuOpen((prev) => !prev);
                    setIsCover(false);
                  }}
                />
                {isProfileMenuOpen && (
                  <EditMenu
                    onEdit={() => setIsModalOpen(true)}
                    onDelete={handleDelete}
                    onClose={() => setIsProfileMenuOpen(false)}
                    theme={theme}
                  />
                )}
              </div>
            </div>

            <form className='w-[310px]' onSubmit={handleSubmit}>
              <p className={`pt-[35px] font-bold text-[14px] ${dark(theme) ? 'text-[#ffffff]' : 'text-[#111111]'}`}>
                이름
              </p>
              <Input
                type='text'
                value={enteredUserValues.myName}
                className={`input-profile ${dark(theme) ? 'bg-[#ffffff]' : ''}`}
                onChange={(event) => handleInputChange('myName', event.target.value)}
              />

              <p className='text-[11px] text-red-500 pt-1 h-2.5'>{enteredErrorValues.myNameError || '\u00A0'}</p>

              <p className={`mt-[22px] font-bold text-[14px] ${dark(theme) ? 'text-[#ffffff]' : 'text-[#111111]'}`}>
                이메일
              </p>
              <Input
                type='text'
                value={userData.email}
                readOnly
                className={`input-profile bg-[#e3e3e3] text-black/50 ${dark(theme) ? 'bg-[#e3e3e3] opacity-50' : ''}`}
              />

              <p className={`mt-[22px] font-bold text-[14px] ${dark(theme) ? 'text-[#ffffff]' : 'text-[#111111]'}`}>
                비밀번호
              </p>
              <Input
                type='password'
                placeholder='Password'
                className={`input-profile ${dark(theme) ? 'bg-[#ffffff]' : ''}`}
                value={enteredUserValues.password}
                onChange={(event) => handleInputChange('password', event.target.value)}
              />

              <p className='text-[11px] text-red-500 pt-1 h-2.5'>{enteredErrorValues.passwordError || '\u00A0'}</p>
              <p className={`mt-[22px] font-bold text-[14px] ${dark(theme) ? 'text-[#ffffff]' : 'text-[#111111]'}`}>
                비밀번호 확인
              </p>
              <Input
                type='password'
                placeholder='Password'
                className={`input-profile ${dark(theme) ? 'bg-[#ffffff]' : ''}`}
                value={enteredUserValues.confirmPassword}
                onChange={(event) => handleInputChange('confirmPassword', event.target.value)}
              />
              <p className='text-[11px] text-red-500 pt-1 h-2.5'>
                {enteredErrorValues.confirmPasswordError || '\u00A0'}
              </p>

              <div className='flex justify-end mt-[25px] relative'>
                <Button value='수정' className={`button-edit ${dark(theme) ? 'bg-[#ffffff] text-[#111111]' : ''}`} />
              </div>
            </form>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <PhotoUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePhoto}
          theme={theme}
        />
      )}
    </>
  );
}
