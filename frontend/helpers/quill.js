import React from "react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import("react-quill");
        const { default: BlotFormatter } = await import("quill-blot-formatter");
        RQ.Quill.register("modules/blotFormatter", BlotFormatter);
        return function forwardRef({ forwardedRef, ...props }) {
            return <RQ ref={forwardedRef} {...props} />;
        };
    },
    {
        ssr: false,
    }
);

// import BlotFormatter from "quill-blot-formatter";

const quillModules = {
    toolbar: [
        [
            { header: "1" },
            { header: "2" },
            { header: [3, 4, 5, 6] },
            { font: [] },
        ],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video"],
        ["clean"],
        ["code-block"],
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    },
    blotFormatter: {},
};

const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "video",
    "code-block",
];

export default function createDocument() {
    const [enableEditor, setEnableEditor] = useState(false);
    const [editorData, setEditorData] = useState("");

    const loadQuill = async () => {
        return new Promise(async (resolve, reject) => {
            const Quill = require("react-quill").Quill;
            const BlotFormatter = (await import("quill-blot-formatter"))
                .default;
            resolve({ Quill, BlotFormatter });
        })
            .then(({ Quill, BlotFormatter }) => {
                Quill.register("modules/blotFormatter", BlotFormatter);
                return;
            })
            .then((value) => {
                setEnableEditor(true);
            });
    };

    useEffect(() => {
        loadQuill();
    }, []);

    return (
        <div className="m-2 text-xs text-black">
            {enableEditor ? (
                <div className="bg-white">
                    <ReactQuill
                        value={editorData}
                        onChange={setEditorData}
                        modules={quillModules}
                        formats={quillFormats}
                    />
                </div>
            ) : null}
        </div>
    );
}

export { quillFormats, quillModules };
