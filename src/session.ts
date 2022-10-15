import { Accessor, createSignal } from "solid-js"
import { User } from "./generated/Api"
import { api } from "./realworlddemo"

export type Session = {
  user: Accessor<User>
  actions: {
    logout: () => void
    newSession: (user) => void
  }
}

const [user, setUser] = createSignal<User | null>(null)

function logout() {
  setUser(null)
}

function newSession(user: User) {
  setUser(user)
  api.setSecurityData({ token: user.token })
}

export function useSession(): Session {
  return {
    user,
    actions: {
      logout,
      newSession,
    },
  }
}
