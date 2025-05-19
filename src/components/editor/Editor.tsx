import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorToolbar from "./EditorToolbar";

import { CustomImage } from "./extensions/CustomImage";
import { useState, useEffect } from "react";
import PollCreator from "../poll/PollCreater";
import { Theme } from "../../types/darkModeTypes";
import { dark } from "../../utils/darkModeUtils";

interface Props {
  onChange: (html: string) => void;
  onPollCreate?: (options: { id: number; text: string }[]) => void;
  onImageSelect?: (file: File) => void;
  showPollButton?: boolean;
  showCodeButton?: boolean;
  disableMinHeight?: boolean;
  initialContent: string;
  theme: Theme;
}

export default function Editor({
  onChange,
  onPollCreate,
  onImageSelect,
  showPollButton = false,
  showCodeButton = false,
  disableMinHeight = false,
  initialContent,
  theme,
}: Props) {
  const editor = useEditor({
    extensions: [StarterKit, CustomImage],
    content: "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });
  const [hasSetInitialContent, setHasSetInitialContent] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);

  useEffect(() => {
    if (editor && initialContent && !hasSetInitialContent) {
      editor.commands.setContent(initialContent);
      setHasSetInitialContent(true); // 초기 콘텐츠 설정 완료
    }
  }, [editor, initialContent, hasSetInitialContent]);

  return (
    <div
      className={
        "editor-box px-4 py-2 rounded-lg min-h-[100px] mb-4 h-[calc(100%-170px)]"
      }
    >
      <EditorToolbar
        editor={editor}
        onTogglePoll={() => setShowPollCreator((prev) => !prev)}
        onImageSelect={onImageSelect}
        showPollButton={showPollButton}
        showCodeButton={showCodeButton}
        theme={theme}
      />
      <div
        className={`editor-box-text max-w-full overflow-y-auto h-[calc(100%-41px)] pr-1  ${
          showPollCreator && onPollCreate && "edit-vote-box-text"
        }`}
      >
        <EditorContent
          editor={editor}
          className={`
          prose max-w-none [&_.ProseMirror]:outline-none
          ${disableMinHeight ? "" : "[&_.ProseMirror]:min-h-full"}
          [&_.ProseMirror]:h-full

          [&_.ProseMirror_pre]:p-4
          [&_.ProseMirror_pre]:rounded-lg
          [&_.ProseMirror_pre]:font-mono
          [&_.ProseMirror_pre]:whitespace-pre-wrap

          [&_.ProseMirror_img]:max-w-[30%]
          [&_.ProseMirror_img]:h-auto

          ${
            dark(theme)
              ? "[&_.ProseMirror_pre]:bg-[#1e1e1e] [&_.ProseMirror_pre]:text-[#ffffff]"
              : "[&_.ProseMirror_pre]:bg-[#ececec] [&_.ProseMirror_pre]:text-[#111111]"
          }
        `}
        />

        {showPollCreator && onPollCreate && (
          <PollCreator onCreate={onPollCreate} theme={theme} />
        )}
      </div>
    </div>
  );
}
