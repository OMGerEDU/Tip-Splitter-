import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookieBanner({ language }) {
  const [isVisible, setIsVisible] = useState(false);

  const text = {
    title: { 
      en: "We use cookies", 
      he: "אנו משתמשים בעוגיות" 
    },
    description: { 
      en: "We use cookies to enhance your experience and save your preferences.", 
      he: "אנו משתמשים בעוגיות כדי לשפר את החוויה שלך ולשמור על ההעדפות שלך." 
    },
    accept: { 
      en: "Accept", 
      he: "אישור" 
    },
    preferences: { 
      en: "Preferences", 
      he: "העדפות" 
    }
  };

  useEffect(() => {
    // Check if user has already responded to cookie banner
    const cookieConsent = localStorage.getItem("tipSplitter_cookieConsent");
    if (!cookieConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("tipSplitter_cookieConsent", "accepted");
    setIsVisible(false);
  };

  const showPreferences = () => {
    // For this simple app, just accept cookies when clicking preferences
    acceptCookies();
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 inset-x-0 z-50 p-4 ${language === "he" ? "text-right" : "text-left"}`}>
      <div className="container mx-auto max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 animate-slideUp">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">{text.title[language]}</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={acceptCookies}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {text.description[language]}
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={showPreferences}>
              {text.preferences[language]}
            </Button>
            <Button size="sm" onClick={acceptCookies}>
              {text.accept[language]}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}