import { create } from 'zustand';

import { persist } from 'zustand/middleware';

import { DocumentItem } from '@/types/document';


interface DocState {

  documents: DocumentItem[];

  activeId: string | null;

  addDocument: () => string;

  updateDocument: (id: string, updates: Partial<DocumentItem>) => void;

  deleteDocument: (id: string) => void;

  setActiveId: (id: string) => void;

}

export const useDocStore = create<DocState>()(

  persist(

    (set) => ({

      documents: [

        {

          id: '1',

          title: 'Welcome Document',

          content: '<h1>Welcome to your new editor!</h1><p>Start typing or formatting your notes here...</p>',

          updatedAt: Date.now(),

        },

      ],

      activeId: '1',

      addDocument: () => {

        const newDoc: DocumentItem = {

          id: Date.now().toString(),

          title: 'Untitled Document',

          content: '',

          updatedAt: Date.now(),

        };

        set((state) => ({

          documents: [newDoc, ...state.documents],

          activeId: newDoc.id,

        }));

        return newDoc.id;

      },

      updateDocument: (id, updates) => {

        set((state) => ({

          documents: state.documents.map((doc) =>

            doc.id === id ? { ...doc, ...updates, updatedAt: Date.now() } : doc

          ),

        }));

      },

      deleteDocument: (id) => {

        set((state) => {

          const remaining = state.documents.filter((doc) => doc.id !== id);

          let newActiveId = state.activeId;

          if (state.activeId === id) {

            newActiveId = remaining.length > 0 ? remaining[0].id : null;

          }

          return {

            documents: remaining,

            activeId: newActiveId,

          };

        });

      },

      setActiveId: (id) => set({ activeId: id }),

    }),

    {

      name: 'local-doc-storage',

    }

  )

);