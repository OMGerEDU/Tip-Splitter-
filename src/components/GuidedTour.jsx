import React, { useState, useEffect } from "react";
import { HelpCircle, ChevronRight, ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

export default function GuidedTour({ language, tourRefs }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  // Text content in both languages
  const text = {
    tourTitle: { en: "Guided Tour", he: "סיור מודרך" },
    startTour: { en: "Start Tour", he: "התחל סיור" },
    next: { en: "Next", he: "הבא" },
    previous: { en: "Previous", he: "הקודם" },
    finish: { en: "Finish", he: "סיום" },
    skip: { en: "Skip", he: "דלג" },
    steps: [
      {
        title: { 
          en: "Welcome to TipSplitter", 
          he: "ברוכים הבאים למחשבון הטיפים" 
        },
        description: { 
          en: "Let's take a quick tour to see how to use this app.", 
          he: "בואו נעשה סיור קצר כדי לראות איך להשתמש באפליקציה." 
        }
      },
      {
        title: { 
          en: "Enter the Bill Amount", 
          he: "הזן את סכום החשבון" 
        },
        description: { 
          en: "Start by entering the total amount from your bill before tip.", 
          he: "התחל בהזנת הסכום הכולל מהחשבון שלך לפני הטיפ." 
        }
      },
      {
        title: { 
          en: "Choose Tip Percentage", 
          he: "בחר את אחוז הטיפ" 
        },
        description: { 
          en: "Adjust the slider to select how much tip you want to give. You can also use the preset buttons for common tip percentages.", 
          he: "התאם את המחוון כדי לבחור כמה טיפ ברצונך לתת. תוכל גם להשתמש בכפתורים המוגדרים מראש לאחוזי טיפ נפוצים." 
        }
      },
      {
        title: { 
          en: "Select Number of People", 
          he: "בחר את מספר האנשים" 
        },
        description: { 
          en: "Use the plus/minus buttons to set how many people are splitting the bill.", 
          he: "השתמש בכפתורי פלוס/מינוס כדי להגדיר כמה אנשים מתחלקים בחשבון." 
        }
      },
      {
        title: { 
          en: "View Results", 
          he: "צפה בתוצאות" 
        },
        description: { 
          en: "See the calculated tip and total amounts, both overall and per person. You can click the copy button next to any result to copy it to your clipboard.", 
          he: "ראה את הטיפ המחושב ואת הסכומים הכוללים, הן בסך הכל והן לאדם. אתה יכול ללחוץ על כפתור ההעתקה ליד כל תוצאה כדי להעתיק אותה ללוח שלך." 
        }
      }
    ]
  };

  // Check if user has seen the tour
  useEffect(() => {
    const tourSeen = localStorage.getItem("tipSplitter_tourSeen");
    if (tourSeen) {
      setHasSeenTour(true);
    }
  }, []);

  // Show tour automatically for first-time users
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasSeenTour) {
        setIsOpen(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [hasSeenTour]);

  const startTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  const finishTour = () => {
    setIsOpen(false);
    localStorage.setItem("tipSplitter_tourSeen", "true");
    setHasSeenTour(true);
  };

  const nextStep = () => {
    if (currentStep < text.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Highlight current step element
  useEffect(() => {
    if (!isOpen || !tourRefs) return;

    // Remove highlight from all elements
    const removeHighlight = () => {
      Object.values(tourRefs).forEach(ref => {
        if (ref.current) {
          ref.current.classList.remove('tour-highlight');
        }
      });
    };

    // Add highlight to current step element
    removeHighlight();
    
    // Map step to ref
    const stepRefMap = {
      1: 'billInput',
      2: 'tipSlider',
      3: 'numPeople',
      4: 'results'
    };

    const currentRef = stepRefMap[currentStep];
    if (currentRef && tourRefs[currentRef] && tourRefs[currentRef].current) {
      tourRefs[currentRef].current.classList.add('tour-highlight');
    }

    return removeHighlight;
  }, [currentStep, isOpen, tourRefs]);

  return (
    <>
      <Button
        id="tour-button"
        variant="outline"
        size="icon"
        onClick={startTour}
        className="rounded-full"
        aria-label="Start guided tour"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className={`sm:max-w-md ${language === "he" ? "text-right" : "text-left"}`}
        >
          <DialogHeader>
            <DialogTitle>
              {text.steps[currentStep].title[language]}
            </DialogTitle>
            <DialogDescription>
              {text.steps[currentStep].description[language]}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="sm:justify-between">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={finishTour}
                size="sm"
              >
                {text.skip[language]}
              </Button>
              
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {text.previous[language]}
                </Button>
              )}
            </div>
            
            <Button
              onClick={nextStep}
              size="sm"
              className="flex items-center gap-1"
            >
              {currentStep < text.steps.length - 1 ? text.next[language] : text.finish[language]}
              {currentStep < text.steps.length - 1 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <style jsx="true">{`
        .tour-highlight {
          position: relative;
          z-index: 10;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5) !important;
          transition: box-shadow 0.3s ease;
          border-radius: 0.5rem;
        }
      `}</style>
    </>
  );
}