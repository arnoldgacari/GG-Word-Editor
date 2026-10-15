'use client'

import React, { useState, useEffect } from 'react';

import { useDocStore } from '@/store/useDocstore';

import { 

  Plus, Trash2, FileText, Bold, Italic, Heading1, Heading2, 

  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, 

  Printer, Download, Search, Moon, Sun 

} from 'lucide-react';


export default function EditorPage() {

  const { documents, activeId, addDocument, updateDocument, deleteDocument, setActiveId } = useDocStore();

  const [search, setSearch] = useState('');

  const [darkMode, setDarkMode] = useState(false);


  const activeDoc = documents.find((doc) => doc.id === activeId);


  // Stats calculation

  const textContent = activeDoc?.content.replace(/<[^>]*>/g, '') || '';

  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;

  const charCount = textContent.length;


  const handleFormat = (command: string, value: string = '') => {

    document.execCommand(command, false, value);

  };


  const handleExport = (format: 'txt' | 'html') => {

    if (!activeDoc) return;

    const element = document.createElement('a');

    let file = new Blob([format === 'html' ? activeDoc.content : textContent], {

      type: format === 'html' ? 'text/html' : 'text/plain',

    });

    element.href = URL.createObjectURL(file);

    element.download = `${activeDoc.title || 'document'}.${format}`;

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

  };


  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  const formatUpdatedDate = (timestamp: number) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(timestamp));

  return (
    <div
      className={`${
        darkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-zinc-100 text-zinc-900'
      } flex h-screen w-screen overflow-hidden font-sans antialiased transition-colors`}
    >
      {/* SIDEBAR */}
      <aside
        className={`w-[280px] border-r border-zinc-200 bg-white/80 backdrop-blur-sm flex flex-col shadow-sm ${
          darkMode ? 'border-zinc-800 bg-zinc-900/90' : 'border-zinc-200 bg-white/80'
        }`}
      >
        <div className="flex items-center justify-between border-b border-inherit px-4 py-3.5">
          <h1 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
              <FileText className="h-4 w-4" />
            </span>
            GG Editor
          </h1>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        <div className="p-3">
          <button
            type="button"
            onClick={() => addDocument()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            <Plus className="h-4 w-4" />
            New Document
          </button>
        </div>

        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full rounded-xl border bg-transparent py-2.5 pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500/40 ${
                darkMode
                  ? 'border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400'
              }`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {filteredDocs.length === 0 ? (
            <div className="mt-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-3 py-4 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-400">
              No documents match your search.
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setActiveId(doc.id)}
                className={`group flex cursor-pointer items-center justify-between rounded-xl p-3 transition ${
                  activeId === doc.id
                    ? 'bg-indigo-500/10 text-indigo-700 ring-1 ring-indigo-200 dark:text-indigo-300 dark:ring-indigo-500/30'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/80'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{doc.title || 'Untitled Document'}</p>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                    {formatUpdatedDate(doc.updatedAt)}
                  </span>
                </div>

                {documents.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDocument(doc.id);
                    }}
                    className="ml-2 rounded-md p-1.5 text-zinc-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-500/10"
                    aria-label={`Delete ${doc.title || 'document'}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </aside>


      {/* MAIN EDITOR AREA */}

      <main className="flex-1 flex flex-col h-full overflow-hidden">

        {activeDoc ? (

          <>

            {/* HEADER */}

            <header
              className={`flex h-16 items-center justify-between border-b px-6 ${
                darkMode ? 'border-zinc-800 bg-zinc-900/80' : 'border-zinc-200 bg-white/90'
              }`}
            >
              <input
                type="text"
                value={activeDoc.title}
                onChange={(e) => updateDocument(activeDoc.id, { title: e.target.value })}
                placeholder="Document Title..."
                className="w-full max-w-xl bg-transparent text-lg font-semibold tracking-tight text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />

              <div className="ml-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleExport('txt')}
                  title="Export as Text"
                  className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-200/80 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                >
                  <Download className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  title="Print / Save PDF"
                  className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-200/80 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                >
                  <Printer className="h-4 w-4" />
                </button>
              </div>
            </header>

            {/* FORMATTING TOOLBAR */}
            <div
              className={`flex flex-wrap items-center gap-1 border-b px-6 py-2 ${
                darkMode ? 'border-zinc-800 bg-zinc-900/60' : 'border-zinc-200 bg-zinc-50/90'
              }`}
            >
              <button type="button" onClick={() => handleFormat('bold')} className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-200/80 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"><Bold className="h-4 w-4" /></button>
              <button type="button" onClick={() => handleFormat('italic')} className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-200/80 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"><Italic className="h-4 w-4" /></button>

              <span className="mx-1 h-4 w-px bg-zinc-300 dark:bg-zinc-700" />

              <button type="button" onClick={() => handleFormat('formatBlock', '<h1>')} className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-200/80 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"><Heading1 className="h-4 w-4" /></button>
              <button type="button" onClick={() => handleFormat('formatBlock', '<h2>')} className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-200/80 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"><Heading2 className="h-4 w-4" /></button>

              <span className="mx-1 h-4 w-px bg-zinc-300 dark:bg-zinc-700" />

              <button type="button" onClick={() => handleFormat('insertUnorderedList')} className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-200/80 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"><List className="h-4 w-4" /></button>
              <button type="button" onClick={() => handleFormat('insertOrderedList')} className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-200/80 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"><ListOrdered className="h-4 w-4" /></button>

              <span className="mx-1 h-4 w-px bg-zinc-300 dark:bg-zinc-700" />

              <button type="button" onClick={() => handleFormat('justifyLeft')} className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-200/80 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"><AlignLeft className="h-4 w-4" /></button>
              <button type="button" onClick={() => handleFormat('justifyCenter')} className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-200/80 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"><AlignCenter className="h-4 w-4" /></button>
              <button type="button" onClick={() => handleFormat('justifyRight')} className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-200/80 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"><AlignRight className="h-4 w-4" /></button>
            </div>

            {/* EDITABLE CANVAS */}
            <div className="flex flex-1 justify-center overflow-y-auto p-6 sm:p-8">
              <div
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => updateDocument(activeDoc.id, { content: e.currentTarget.innerHTML })}
                dangerouslySetInnerHTML={{ __html: activeDoc.content }}
                className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-500"
                style={{ minHeight: '500px' }}
              />
            </div>

            {/* FOOTER STATS */}
            <footer
              className={`flex items-center justify-between border-t px-6 py-2 text-xs ${
                darkMode ? 'border-zinc-800 bg-zinc-900 text-zinc-400' : 'border-zinc-200 bg-white text-zinc-500'
              }`}
            >
              <div>Words: {wordCount} | Characters: {charCount}</div>
              <div>Auto-saved locally</div>
            </footer>

          </>

        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/80 px-8 py-6 text-center text-zinc-500 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
              Select or create a document to start writing.
            </div>
          </div>
        )}

      </main>

    </div>

  );

}


