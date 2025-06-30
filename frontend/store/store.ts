import { create } from 'zustand'

interface UserStore {
    id: number
    name: string
    email: string
    google_id?: string | null
    created_At: Date
    updated_At?: Date | null

    setUser: (user: Partial<Omit<UserStore, 'setUser' | 'clearUser'>>) => void
    clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
    id: 0,
    name: '',
    email: '',
    google_id: null,
    created_At: new Date(),
    updated_At: null,

    setUser: (user) =>
        set((state) => ({
            ...state,
            ...user,
            updated_At: new Date(),
        })),

    clearUser: () =>
        set(() => ({
            id: 0,
            name: '',
            email: '',
            google_id: null,
            created_At: new Date(),
            updated_At: null,
        })),
}))
