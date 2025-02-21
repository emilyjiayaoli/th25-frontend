import React, { useState } from 'react';
import { exportToBlob, Tldraw, TLUiComponents, Editor } from 'tldraw';
import 'tldraw/tldraw.css';

export default function Canvas() {
    const [editor, setEditor] = useState<Editor | null>(null);

    async function handleExport() {
        if (!editor) return;
        const shapeIds = editor.getCurrentPageShapeIds();
        if (shapeIds.size === 0) {
            alert('No shapes on the canvas');
            return;
        }

        const blob = await exportToBlob({
            editor,
            ids: [...shapeIds],
            format: 'png',
            opts: { background: false },
        });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'canvas-image.png';
        link.click();
    }

    function ExportCanvasButton() {
        return (
            // pt-1.5 pb-1 to center the icon
            <div className="absolute top-2 left-2 z-[1000] pointer-events-auto bg-tl-blue text-white px-2 pt-1.5 pb-1 rounded-lg">
                <button onClick={handleExport}>
                    {/* ArrowDownOnSquare from Heroicons import will not render */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25" />
                    </svg>
                </button>
            </div>
        );
    }

    const components: TLUiComponents = {
        PageMenu: null,
        KeyboardShortcutsDialog: null,
        SharePanel: ExportCanvasButton,
    };

    return (
        <div className="h-full w-full border-black border-2">
            <Tldraw
                components={components}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    backgroundColor: '#f0f0f0',
                }}
                onMount={(editorInstance: any) => setEditor(editorInstance)}
            />
        </div>
    );
}
