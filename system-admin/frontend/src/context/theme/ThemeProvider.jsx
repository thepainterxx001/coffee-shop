import { useEffect, useState } from "react"
import themeContext from "./themeContext"

const ThemeProvider = ({ children }) => {
  const [ theme, setTheme ] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (value) => {
    setTheme(value);
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