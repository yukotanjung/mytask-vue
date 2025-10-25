import { ref } from 'vue'

const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))

export function useAuth() {
  
  const can = (ability) => {
    if (!user.value || !user.value.abilities) return false
    return user.value.abilities.includes(ability)
  }

  const setUser = (data) => {
    user.value = data
    localStorage.setItem('user', JSON.stringify(data))
  }
  

  
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return { user, can, logout, setUser }
}
