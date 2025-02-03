import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { StrictMode, useEffect } from "react";

import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

import { Bold, Heading1, Heading2, Heading3, Italic, List, ListOrdered } from "lucide-react";
import "./tiptap.css";

interface RichTextProps {
  content: string;
  className?: string;
}

export const RichText = ({ content, className }: RichTextProps) => {
  const editor = useEditor({
    editable: false,
    immediatelyRender: true,
    extensions: [StarterKit],
    content,
    editorProps: { attributes: { class: cn("h-auto", className) } },
  });

  useEffect(() => {
    if (content !== editor.getHTML()) editor.commands.setContent(content);
  }, [content, editor]);

  return (
    <StrictMode>
      <EditorContent editor={editor} />
    </StrictMode>
  );
};

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const bubbleMenuOptions = [
    {
      isActive: editor.isActive("bold"),
      onPressedChange: () => editor.chain().focus().toggleBold().run(),
      Icon: Bold,
    },
    {
      isActive: editor.isActive("italic"),
      onPressedChange: () => editor.chain().focus().toggleItalic().run(),
      Icon: Italic,
    },
    {
      isActive: editor.isActive("bulletList"),
      onPressedChange: () => editor.chain().focus().toggleBulletList().run(),
      Icon: List,
    },
    {
      isActive: editor.isActive("orderedList"),
      onPressedChange: () => editor.chain().focus().toggleOrderedList().run(),
      Icon: ListOrdered,
    },
    {
      isActive: editor.isActive("heading", { level: 1 }),
      onPressedChange: () => editor.chain().focus().toggleHeading({ level: 1 }),
      Icon: Heading1,
    },
    {
      isActive: editor.isActive("heading", { level: 2 }),
      onPressedChange: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      Icon: Heading2,
    },
    {
      isActive: editor.isActive("heading", { level: 3 }),
      onPressedChange: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      Icon: Heading3,
    },
  ];

  return (
    <div className="relative">
      <EditorContent
        editor={editor}
        className="border rounded-md p-2 !min-h-16 h-auto outline-none"
      />
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="flex bg-white border rounded-md shadow-lg p-1">
          {bubbleMenuOptions.map(({ isActive, onPressedChange, Icon }) => (
            <Toggle size="sm" pressed={isActive} onPressedChange={onPressedChange}>
              <Icon className="h-4 w-4" />
            </Toggle>
          ))}
        </div>
      </BubbleMenu>
    </div>
  );
}
