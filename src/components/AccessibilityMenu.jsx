import React, { useState, useEffect } from "react";
import { 
  Accessibility, X, ZoomIn, ZoomOut, Type, MousePointer, 
  Moon, Sun, Link as LinkIcon, Eye, Zap
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetClose 
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function AccessibilityMenu({ language }) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    textSize: 100,
    highContrast: false,
    reducedMotion: false,
    highlightLinks: false,
    biggerCursor: false,
    nightMode: false,
    focusMode: false
  });

  // Text content in both languages
  const text = {
    accessibility: { en: "Accessibility", he: "נגישות" },
    textSize: { en: "Text Size", he: "גודל טקסט" },
    highContrast: { en: "High Contrast", he: "ניגודיות גבוהה" },
    reducedMotion: { en: "Reduced Motion", he: "הפחתת אנימציות" },
    highlightLinks: { en: "Highlight Links", he: "הדגשת קישורים" },
    biggerCursor: { en: "Bigger Cursor", he: "סמן גדול" },
    nightMode: { en: "Night Mode", he: "מצב לילה" },
    focusMode: { en: "Focus Mode", he: "מצב התמקדות" },
    reset: { en: "Reset All", he: "איפוס הכל" }
  };

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem("tipSplitter_accessibility");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // Apply text size
    document.documentElement.style.fontSize = `${settings.textSize}%`;
    
    // Apply high contrast
    if (settings.highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    
    // Apply reduced motion
    if (settings.reducedMotion) {
      document.documentElement.classList.add("reduced-motion");
    } else {
      document.documentElement.classList.remove("reduced-motion");
    }
    
    // Apply highlight links
    if (settings.highlightLinks) {
      document.documentElement.classList.add("highlight-links");
    } else {
      document.documentElement.classList.remove("highlight-links");
    }
    
    // Apply bigger cursor
    if (settings.biggerCursor) {
      document.body.classList.add("bigger-cursor");
    } else {
      document.body.classList.remove("bigger-cursor");
    }
    
    // Apply night mode
    if (settings.nightMode) {
      document.documentElement.classList.add("forced-dark");
    } else {
      document.documentElement.classList.remove("forced-dark");
    }
    
    // Apply focus mode
    if (settings.focusMode) {
      document.documentElement.classList.add("focus-mode");
    } else {
      document.documentElement.classList.remove("focus-mode");
    }
    
    // Save settings
    localStorage.setItem("tipSplitter_accessibility", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    const defaultSettings = {
      textSize: 100,
      highContrast: false,
      reducedMotion: false,
      highlightLinks: false,
      biggerCursor: false,
      nightMode: false,
      focusMode: false
    };
    setSettings(defaultSettings);
  };

  return (
    <>
      {/* Accessibility button (floating) */}
      <Button
        id="accessibility-button"
        onClick={() => setIsOpen(true)}
        variant="ghost"
        size="icon"
        className="rounded-full"
        aria-label="Open accessibility menu"
      >
        <Accessibility className="h-5 w-5" />
      </Button>
      
      {/* Accessibility panel */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent position={language === "he" ? "right" : "left"} className={`w-[300px] ${language === "he" ? "text-right" : "text-left"}`}>
          <SheetHeader className="pb-4 border-b dark:border-gray-800">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                <span>{text.accessibility[language]}</span>
              </SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>
          
          <div className="py-5 space-y-6">
            {/* Text Size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  <span className="text-sm font-medium">{text.textSize[language]}</span>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateSetting('textSize', Math.max(80, settings.textSize - 10))}
                    disabled={settings.textSize <= 80}
                    className="w-7 h-7"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </Button>
                  <span className="w-8 text-center text-sm">{settings.textSize}%</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateSetting('textSize', Math.min(150, settings.textSize + 10))}
                    disabled={settings.textSize >= 150}
                    className="w-7 h-7"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <Slider
                value={[settings.textSize]}
                min={80}
                max={150}
                step={10}
                onValueChange={(val) => updateSetting('textSize', val[0])}
              />
            </div>
            
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">{text.highContrast[language]}</span>
              </div>
              <Switch
                checked={settings.highContrast}
                onCheckedChange={(val) => updateSetting('highContrast', val)}
              />
            </div>
            
            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">{text.reducedMotion[language]}</span>
              </div>
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={(val) => updateSetting('reducedMotion', val)}
              />
            </div>
            
            {/* Highlight Links */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{text.highlightLinks[language]}</span>
              </div>
              <Switch
                checked={settings.highlightLinks}
                onCheckedChange={(val) => updateSetting('highlightLinks', val)}
              />
            </div>
            
            {/* Bigger Cursor */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MousePointer className="h-4 w-4" />
                <span className="text-sm font-medium">{text.biggerCursor[language]}</span>
              </div>
              <Switch
                checked={settings.biggerCursor}
                onCheckedChange={(val) => updateSetting('biggerCursor', val)}
              />
            </div>
            
            {/* Night Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <span className="text-sm font-medium">{text.nightMode[language]}</span>
              </div>
              <Switch
                checked={settings.nightMode}
                onCheckedChange={(val) => updateSetting('nightMode', val)}
              />
            </div>
            
            {/* Focus Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <span className="text-sm font-medium">{text.focusMode[language]}</span>
              </div>
              <Switch
                checked={settings.focusMode}
                onCheckedChange={(val) => updateSetting('focusMode', val)}
              />
            </div>
            
            {/* Reset button */}
            <Button 
              variant="secondary" 
              className="w-full mt-6" 
              onClick={resetSettings}
            >
              {text.reset[language]}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Global styles for accessibility options */}
      <style jsx="true">{`
        .high-contrast {
          filter: contrast(1.5);
        }
        
        .reduced-motion * {
          animation-duration: 0.001ms !important;
          transition-duration: 0.001ms !important;
        }
        
        .highlight-links a {
          text-decoration: underline !important;
          color: #3B82F6 !important;
          font-weight: bold !important;
        }
        
        .bigger-cursor,
        .bigger-cursor * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M8.034 0c-0.168 0-0.337 0.020-0.505 0.062l-6.26 1.577c-0.485 0.122-0.876 0.467-1.044 0.923-0.169 0.456-0.075 0.961 0.252 1.35l16.29 19.5c0.295 0.354 0.716 0.558 1.176 0.566 0.006 0 0.013 0 0.019 0 0.45 0 0.873-0.189 1.176-0.524l4.132-4.553 6.153 6.153c0.389 0.39 1.020 0.39 1.409 0l2.561-2.56c0.389-0.39 0.389-1.020 0-1.409l-6.046-6.046 4.553-4.132c0.336-0.304 0.524-0.727 0.524-1.177-0.007-0.46-0.212-0.881-0.566-1.176l-19.5-16.29c-0.273-0.228-0.605-0.342-0.943-0.342zM7.783 2.119c0.122-0.031 0.245 0.001 0.343 0.084l15.224 12.706-4.133 3.753-12.829-15.284c-0.097-0.116-0.127-0.239-0.096-0.362 0.030-0.122 0.114-0.211 0.236-0.241l1.255-0.657z' fill='%23000'/%3E%3C/svg%3E") 6 1, auto !important;
        }
        
        .forced-dark {
          color-scheme: dark !important;
          filter: invert(1) hue-rotate(180deg);
        }
        
        .focus-mode .tip-calculator-section {
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </>
  );
}