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
            <div
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    zIndex: 1000,
                    pointerEvents: 'all',
                }}
            >
                <button
                    style={{
                        fontSize: 16,
                        backgroundColor: 'thistle',
                        padding: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        pointerEvents: 'all',
                    }}
                    onClick={handleExport}
                >
                    Export Canvas as Image
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
        <div className="h-full w-full">
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
