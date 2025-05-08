
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TipCalculator from "../components/TipCalculator";
import HistoryDrawer from "../components/HistoryDrawer";
import GuidedTour from "../components/GuidedTour";
import PersonalItemsCalculator from "../components/PersonalItemsCalculator";
import SharedSession from "../components/SharedSession";

export default function Home() {
  const [language, setLanguage] = useState("en");
  const [history, setHistory] = useState([]);
  const [isTouring, setIsTouring] = useState(false);
  const [tourRefs, setTourRefs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState("");
  const [personalTotal, setPersonalTotal] = useState(0);
  const [activeTab, setActiveTab] = useState("split");

  // Text content in both languages
  const text = {
    title: { 
      en: "Split & Tip Your Bill", 
      he: "חישוב טיפ ופיצול חשבון" 
    },
    subtitle: { 
      en: "Calculate tips and split bills easily with friends and family", 
      he: "חשב טיפים וחלק חשבונות בקלות עם חברים ומשפחה" 
    },
    features: { 
      en: [
        "Calculate exact tip amounts",
        "Split bills evenly among friends",
        "Save calculation history",
        "Works offline with PWA support"
      ], 
      he: [
        "חשב סכומי טיפים מדויקים",
        "חלק חשבונות בצורה שווה בין חברים",
        "שמור היסטוריית חישובים",
        "עובד גם ללא אינטרנט עם תמיכת PWA"
      ] 
    },
    tabs: {
      split: {
        en: "Even Split",
        he: "חלוקה שווה"
      },
      personal: {
        en: "Individual Items",
        he: "פריטים נפרדים"
      }
    }
  };

  // References for tour
  const handleSetTourRef = (refs) => {
    setTourRefs(refs);
  };

  // Load language preference
  useEffect(() => {
    const storedLang = localStorage.getItem("tipSplitter_language");
    if (storedLang) {
      setLanguage(storedLang);
    } else {
      // Check browser language
      const browserLang = navigator.language.split("-")[0];
      setLanguage(browserLang === "he" ? "he" : "en");
    }
    
    // Load history from localStorage
    const savedHistory = localStorage.getItem("tipSplitter_history");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      } catch (e) {
        console.error("Error parsing history:", e);
      }
    }
    
    // Simulate loading for skeleton effect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Update language when it changes in layout
  useEffect(() => {
    const handleLanguageChange = () => {
      const storedLang = localStorage.getItem("tipSplitter_language");
      if (storedLang) {
        setLanguage(storedLang);
      }
    };
    
    window.addEventListener("languageChanged", handleLanguageChange);
    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  // Initialize session ID from URL or create new one
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session');
    if (session) {
      setSessionId(session);
      setActiveTab("personal"); // Auto-switch to personal mode if session is shared
    } else {
      setSessionId(Math.random().toString(36).substring(2, 15));
    }
  }, []);

  // Save history when it changes
  useEffect(() => {
    if (history.length > 0) {
      // Limit history to 5 most recent items
      const limitedHistory = history.slice(0, 5);
      localStorage.setItem("tipSplitter_history", JSON.stringify(limitedHistory));
    }
  }, [history]);

  // Save calculation to history
  const handleSaveSplit = (calculationData) => {
    // Only add if there's actual data
    if (calculationData && calculationData.bill > 0) {
      setHistory(prevHistory => {
        // Check if this is the same calculation as the last one
        if (prevHistory.length > 0) {
          const lastItem = prevHistory[0];
          if (lastItem.bill === calculationData.bill &&
              lastItem.tipPercent === calculationData.tipPercent &&
              lastItem.numPeople === calculationData.numPeople) {
            return prevHistory;
          }
        }
        
        // Add new calculation at the beginning of the array
        return [calculationData, ...prevHistory].slice(0, 5);
      });
    }
  };

  // Clear all history
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("tipSplitter_history");
  };

  // Hero section animation variants
  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${language === "he" ? "text-right" : "text-left"}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section
          className="py-10 mb-12"
          initial="hidden"
          animate="visible"
          variants={heroVariants}
        >
          <motion.div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div variants={itemVariants} className="md:w-1/2">
              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4"
              >
                {text.title[language]}
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="text-xl text-gray-700 dark:text-gray-300 mb-6"
              >
                {text.subtitle[language]}
              </motion.p>
              <motion.ul variants={itemVariants} className="space-y-2">
                {text.features[language].map((feature, index) => (
                  <motion.li 
                    key={index}
                    variants={itemVariants}
                    className="flex items-center gap-2"
                  >
                    <span className="flex-shrink-0 h-5 w-5 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                      ✓
                    </span>
                    <span className="text-gray-700 dark:text-gray-200">{feature}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="md:w-1/2 flex justify-center"
            >
              <img
                src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="People splitting bill"
                className="rounded-xl shadow-lg max-w-full h-auto"
              />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Main Calculator Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <GuidedTour language={language} tourRefs={tourRefs} />
            <HistoryDrawer language={language} history={history} onClearHistory={handleClearHistory} />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="mb-6 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm">
            <TabsTrigger value="split" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30">
              {text.tabs.split[language]}
            </TabsTrigger>
            <TabsTrigger value="personal" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30">
              {text.tabs.personal[language]}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="split" className="mt-0">
            {isLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md mb-6"></div>
                <div className="space-y-4">
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                </div>
              </div>
            ) : (
              <TipCalculator 
                language={language} 
                onSaveSplit={handleSaveSplit} 
                tourActive={isTouring}
                setTourRef={handleSetTourRef}
              />
            )}
          </TabsContent>
          
          <TabsContent value="personal" className="mt-0">
            <div className="grid md:grid-cols-2 gap-8">
              <PersonalItemsCalculator
                language={language}
                sessionId={sessionId}
                onTotalChange={setPersonalTotal}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
