import { useEffect, useState } from "react"
import themeContext from "./themeContext"

const ThemeProvider = ({ children }) => {
  const [ theme, setTheme ] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  const toggleTheme = (value) => {
    setTheme(value);
    localStorage.setItem("theme", value);
    if (value === "light") {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <themeContext.Provider value={{ theme, toggleTheme }}>
      { children }
    </themeContext.Provider>
  )
}

export default ThemeProvider