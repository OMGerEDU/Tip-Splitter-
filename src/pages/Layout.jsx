
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sun, Moon, Languages, ChevronUp, X, Menu } from "lucide-react";
import AccessibilityMenu from "../components/AccessibilityMenu";
import LanguageSwitcher from "../components/LanguageSwitcher";
import CookieBanner from "../components/CookieBanner";
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Text content in both languages
  const text = {
    logo: { en: "TipSplitter", he: "מחשבון טיפים" },
    backToTop: { en: "Back to Top", he: "חזרה למעלה" },
    footerCredits: { 
      en: "© Copyright: OMGerEDU", 
      he: "© זכויות יוצרים: OMGerEDU" 
    }
  };

  useEffect(() => {
    // Check if user has a language preference stored
    const storedLang = localStorage.getItem("tipSplitter_language");
    if (storedLang) {
      setLanguage(storedLang);
    } else {
      // Check browser language
      const browserLang = navigator.language.split("-")[0];
      setLanguage(browserLang === "he" ? "he" : "en");
    }

    // Check if user has a theme preference stored
    const storedTheme = localStorage.getItem("tipSplitter_theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    }

    // Scroll listener for back-to-top button
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("tipSplitter_theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("tipSplitter_language", lang);
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
    // Dispatch an event so other components can react to language change
    window.dispatchEvent(new Event("languageChanged"));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Set the html dir attribute based on language
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
  }, [language]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + L: Toggle language
      if (e.altKey && e.key === "l") {
        changeLanguage(language === "en" ? "he" : "en");
      }
      // Alt + A: Toggle accessibility menu
      if (e.altKey && e.key === "a") {
        document.getElementById("accessibility-button")?.click();
      }
      // Alt + ?: Toggle help tour
      if (e.altKey && e.key === "?") {
        document.getElementById("tour-button")?.click();
      }
      // Alt + T: Toggle theme
      if (e.altKey && e.key === "t") {
        toggleTheme();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [language]);

  return (
    <div className={`min-h-screen flex flex-col ${language === "he" ? "font-hebrewFont" : "font-sans"} ${theme === "dark" ? "dark" : ""}`}>
      {/* Custom styles for improved readability */}
      <style jsx="true">{`
        /* Light mode styles */
        :root {
          --background: #ffffff;
          --foreground: #1f2937;
          --card-background: #ffffff;
          --card-foreground: #1f2937;
          --primary: #3b82f6;
          --primary-foreground: #ffffff;
          --secondary: #f3f4f6;
          --secondary-foreground: #1f2937;
          --muted: #f3f4f6;
          --muted-foreground: #6b7280;
          --accent: #f3f4f6;
          --accent-foreground: #1f2937;
          --destructive: #ef4444;
          --destructive-foreground: #ffffff;
          --border: #e5e7eb;
          --input: #e5e7eb;
          --ring: #3b82f6;
        }

        /* Dark mode styles */
        .dark {
          --background: #111827;
          --foreground: #f9fafb;
          --card-background: #1f2937;
          --card-foreground: #f9fafb;
          --primary: #3b82f6;
          --primary-foreground: #f9fafb;
          --secondary: #374151;
          --secondary-foreground: #f9fafb;
          --muted: #374151;
          --muted-foreground: #9ca3af;
          --accent: #374151;
          --accent-foreground: #f9fafb;
          --destructive: #ef4444;
          --destructive-foreground: #f9fafb;
          --border: #374151;
          --input: #374151;
          --ring: #3b82f6;
        }

        body {
          background-color: var(--background);
          color: var(--foreground);
        }

        .dark body {
          background-color: var(--background);
        }

        html[dir="rtl"] input[type="number"] {
          text-align: right;
        }
        
        .dark .shadow-lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
        }
        
        @media (prefers-reduced-motion) {
          * {
            animation-duration: 0.001ms !important;
            transition-duration: 0.001ms !important;
          }
        }

        /* Improved readability styles */
        .dark {
          color-scheme: dark;
        }

        .card-highlight {
          border-color: var(--primary);
        }
      `}</style>
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b shadow-sm bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg dark:border-gray-800 transition-colors">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Home")} className="flex items-center">
              <div className="font-bold text-xl text-blue-600 dark:text-blue-400 transition-transform hover:scale-105">
                {text.logo[language]}
              </div>
            </Link>
            
            <div className="flex items-center space-x-3 md:space-x-5 rtl:space-x-reverse">
              <div className="hidden md:flex items-center space-x-3 rtl:space-x-reverse">
                <Button
                  onClick={toggleTheme}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                
                <LanguageSwitcher 
                  currentLanguage={language} 
                  onChange={changeLanguage} 
                />
                
                <AccessibilityMenu language={language} />
              </div>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 py-3 space-y-2 border-t dark:border-gray-800">
              <div className="flex justify-around items-center">
                <Button
                  onClick={toggleTheme}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === "dark" ? 
                    (language === "en" ? "Light Mode" : "מצב יום") : 
                    (language === "en" ? "Dark Mode" : "מצב לילה")
                  }
                </Button>
                
                <Button
                  onClick={() => changeLanguage(language === "en" ? "he" : "en")}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Languages className="h-4 w-4" />
                  {language === "en" ? "עברית" : "English"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 bg-white dark:bg-gray-950 border-t dark:border-gray-800 transition-colors relative">
        <div className="container mx-auto">
          {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 flex items-center gap-1 text-sm font-medium hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              aria-label="Back to top"
            >
              <ChevronUp className="h-4 w-4" />
              <span className="pr-1">{text.backToTop[language]}</span>
            </button>
          )}
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {text.footerCredits[language]}
            </p>
            
            <div className="flex flex-col items-center md:items-end text-xs text-gray-500 dark:text-gray-500">
              <div className="flex items-center mb-2">
                <a href="https://github.com/OMGerEDU" target="_blank" rel="noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400">
                  GitHub: OMGerEDU
                </a>
              </div>
              <div className="flex items-center">
                <a href="https://linkedin.com/in/omger" target="_blank" rel="noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400">
                  LinkedIn: omger
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Cookie Banner */}
      <CookieBanner language={language} />
    </div>
  );
}
