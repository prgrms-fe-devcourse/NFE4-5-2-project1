import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Button from '../common/Button';
import CommentEditorToolbar from './CommentEditorToolbar';
import { Theme } from '../../types/darkModeTypes';
import { dark } from '../../utils/darkModeUtils';
import { useEffect } from 'react';

// Props 타입
interface Props {
  bottomRef: React.RefObject<HTMLDivElement | null>;
  channelId: string;
  resetTrigger: number;
  submitHandler: (e: React.FormEvent<Element>) => void;
  onChange: (html: string) => void;
  showCodeButton?: boolean;
  disableMinHeight?: boolean;
  theme: Theme;
}

export default function CommentEditor({
  bottomRef,
  channelId,
  resetTrigger,
  submitHandler,
  onChange,
  showCodeButton = false,
  disableMinHeight = false,
  theme,
}: Props) {
  // 에디터 기본 설정
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '댓글을 작성해 주세요',
      }),
    ],
    content: '<p></p>',
    onUpdate({ editor }) {
      onChange(editor.getHTML());

      // 댓글 작성 중 다음 줄로 넘어가면 스크롤도 따라 이동
      bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    },
  });

  // 댓글을 작성하면 resetTrigger 값이 변경되면서 댓글 에디터 부분 초기화
  useEffect(() => {
    if (editor) {
      editor.commands.clearContent();
    }
  }, [resetTrigger, editor]);

  return (
    <div className=" rounded-[5px] min-h-[100px] h-auto">
      <EditorContent
        editor={editor}
        className={`
    prose max-w-none 
    [&_.ProseMirror]:outline-none 
    [&_.ProseMirror]:h-auto
    ${disableMinHeight ? '' : '[&_.ProseMirror]:min-h-[50px]'}

    p-6 pb-3

    [&_.ProseMirror_pre]:p-4
    [&_.ProseMirror_pre]:rounded-lg
    [&_.ProseMirror_pre]:font-mono
    [&_.ProseMirror_pre]:whitespace-pre-wrap

    ${
      dark(theme)
        ? '[&_.ProseMirror_pre]:bg-[#1e1e1e] [&_.ProseMirror_pre]:text-[#ffffff]'
        : '[&_.ProseMirror_pre]:bg-[#ececec] [&_.ProseMirror_pre]:text-[#111111]'
    }
  `}
      />
      <div className="w-full h-[50px] flex justify-end items-center gap-6 pr-6 pb-4">
        {channelId === '1' && (
          <CommentEditorToolbar
            editor={editor}
            showCodeButton={showCodeButton}
            theme={theme}
          />
        )}
        {channelId !== '1' && (
          <CommentEditorToolbar editor={editor} theme={theme} />
        )}

        <Button
          value="댓글 달기"
          className={`button-style3 ${
            dark(theme) ? 'bg-[#ffffff] text-[#111111]' : ''
          }`}
          onClick={(e) => submitHandler(e)}
        />
      </div>
    </div>
  );
}
