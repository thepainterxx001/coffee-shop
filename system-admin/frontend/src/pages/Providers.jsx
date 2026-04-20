import AuthProvider from "../context/auth/AuthProvider"

const Providers = ({ children }) => {
  return (
    <AuthProvider>
      { children }
    </AuthProvider>
  )
}

export default Providers