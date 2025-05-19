import { Node, mergeAttributes } from "@tiptap/core";

export const CustomImage = Node.create({
  name: "customImage",
  group: "block",
  inline: false,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: {},
      alt: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "img[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      wrapper.style.display = "inline-block";
      wrapper.style.width = "100%";
      wrapper.style.height = "100%";
      wrapper.style.overflow = "hidden";

      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || "";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.display = "block";
      img.style.borderRadius = "8px";

      const button = document.createElement("button");
      button.textContent = "✕";
      Object.assign(button.style, {
        position: "absolute",
        top: "4px",
        left: "4px",
        background: "black",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        cursor: "pointer",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "10",
      });

      button.onclick = (e) => {
        e.stopPropagation();
        const pos = getPos();
        if (typeof pos === "number") {
          editor
            .chain()
            .focus()
            .deleteRange({ from: pos, to: pos + node.nodeSize })
            .run();
        }
      };

      wrapper.appendChild(img);
      wrapper.appendChild(button);

      return {
        dom: wrapper,
      };
    };
  },
});
