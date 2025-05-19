import { Editor } from "@tiptap/react";
import CodeEditIcon from "../icon/CodeEditIcon";
import ImageIcon from "../icon/ImageIcon";
import BoldIcon from "../icon/BoldIcon";
import ItalicIcon from "../icon/ItalicIcon";
import VoteIcon from "../icon/VoteIcon";
import { Theme } from "../../types/darkModeTypes";
import { dark } from "../../utils/darkModeUtils";

interface Props {
  editor: Editor | null;
  onTogglePoll: () => void;
  onImageSelect?: (file: File) => void;
  showPollButton?: boolean;
  showCodeButton?: boolean;
  theme: Theme;
}

export default function EditorToolbar({
  editor,
  onTogglePoll,
  onImageSelect,
  showPollButton = false,
  showCodeButton = false,
  theme,
}: Props) {
  if (!editor) return null;

  return (
    <div className='flex gap-5.5 mb-3.5'>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`cursor-pointer rounded-[5px] ${
          editor.isActive("bold")
            ? "font-bold bg-blue-400"
            : dark(theme)
            ? "hover:bg-[#1e1e1e]"
            : " hover:bg-gray-200"
        }`}
      >
        <BoldIcon theme={theme} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`cursor-pointer rounded-[5px] ${
          editor.isActive("italic")
            ? "italic bg-blue-400"
            : dark(theme)
            ? "hover:bg-[#1e1e1e]"
            : " hover:bg-gray-200"
        }`}
      >
        <ItalicIcon theme={theme} />
      </button>

      {showCodeButton && (
        <button
          onClick={() => {
            editor.chain().focus().toggleCodeBlock().run();
          }}
          className={`cursor-pointer rounded-[5px] 
          ${
            editor.isActive("codeBlock")
              ? "bg-blue-400"
              : dark(theme)
              ? "hover:bg-[#1e1e1e]"
              : "hover:bg-gray-200"
          }`}
        >
          <CodeEditIcon theme={theme} />
        </button>
      )}

      <input
        type='file'
        accept='image/*'
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onImageSelect?.(file); // 부모에게 파일 전달
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result;
              if (typeof result === "string") {
                editor?.chain().focus().run();

                editor
                  ?.chain()
                  .focus()
                  .insertContent([
                    {
                      type: "customImage",
                      attrs: { src: result },
                    },
                    {
                      type: "paragraph",
                    },
                  ])
                  .run();
              }
            };
            reader.readAsDataURL(file);
          }
          e.target.value = "";
        }}
        className='hidden cursor-pointer rounded-[5px]'
        id='image-upload'
      />

      <label
        htmlFor='image-upload'
        className={`cursor-pointer rounded-[5px] flex items-center justify-center ${
          dark(theme) ? "hover:bg-[#1e1e1e]" : "hover:bg-gray-200"
        }`}
      >
        <ImageIcon theme={theme} />
      </label>

      {showPollButton && (
        <button
          onClick={onTogglePoll}
          className={`cursor-pointer rounded-[5px] ${
            dark(theme) ? "hover:bg-[#1e1e1e]" : "hover:bg-gray-200"
          }`}
        >
          <VoteIcon theme={theme} />
        </button>
      )}
    </div>
  );
}
