import ImageUploader from "../../../components/common/ImageUploader";
import InputField from "../../../components/common/InputField";
import TextAreaField from "../../../components/common/TextAreaField";

interface PostInputFormProps {
  titleInput: string;
  contentInput: string;
  setTitleInput: (value: string) => void;
  setContentInput: (value: string) => void;
  setImageInput?: (file: File | null) => void;
  setIsImageDeleted?: (value: boolean) => void;
  existingImageUrl?: string;
}

export default function PostInputForm({
  titleInput,
  contentInput,
  setTitleInput,
  setContentInput,
  setImageInput,
  existingImageUrl,
  setIsImageDeleted,
}: PostInputFormProps) {
  return (
    <>
      <form className="flex flex-col gap-8">
        <InputField
          label="게시물 제목 *"
          id="titleInput"
          name="titleInput"
          value={titleInput}
          placeholder="제목을 입력해주세요."
          type="text"
          autoComplete="titleInput"
          onChange={(e) => {
            setTitleInput(e.target.value);
          }}
          className="w-[100%] py-4"
        />

        <div className="flex gap-4 w-full">
          <TextAreaField
            label="게시물 내용 *"
            id="contentInput"
            name="contentInput"
            autoComplete="contentInput"
            placeholder="내용을 입력해주세요."
            className="flex-grow w-full"
            value={contentInput}
            onChange={(e) => {
              setContentInput(e.target.value);
            }}
          />

          {setImageInput && (
            <ImageUploader
              onImageChange={setImageInput}
              initialImageUrl={existingImageUrl}
              onImageDelete={() => setIsImageDeleted && setIsImageDeleted(true)}
            />
          )}
        </div>
      </form>
    </>
  );
}
