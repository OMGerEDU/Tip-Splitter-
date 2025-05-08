import React, { useState } from "react";
import { History, X, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";

export default function HistoryDrawer({ language, history, onClearHistory }) {
  const [isOpen, setIsOpen] = useState(false);

  // Text content in both languages
  const text = {
    history: { en: "History", he: "היסטוריה" },
    noHistory: { en: "No recent calculations", he: "אין חישובים אחרונים" },
    startCalculating: { 
      en: "Start calculating to see your history here", 
      he: "התחל לחשב כדי לראות את ההיסטוריה שלך כאן" 
    },
    clearHistory: { en: "Clear History", he: "נקה היסטוריה" },
    bill: { en: "Bill", he: "חשבון" },
    tip: { en: "Tip", he: "טיפ" },
    people: { en: "People", he: "אנשים" },
    perPerson: { en: "Per Person", he: "לאדם" },
  };

  // Format currency display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(language === "he" ? "he-IL" : "en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format date based on language
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (language === "he") {
      // Hebrew date format
      return format(date, "dd/MM/yyyy HH:mm");
    } else {
      // English date format
      return format(date, "MMM d, yyyy h:mm a");
    }
  };

  // Handle clear history
  const handleClearHistory = () => {
    onClearHistory();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className={`relative ${language === "he" ? "ml-2" : "mr-2"}`}
          aria-label="History"
          onClick={() => setIsOpen(true)}
        >
          <History className="h-5 w-5" />
          {history.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              {history.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent 
        position={language === "he" ? "right" : "right"} 
        className={`w-full sm:max-w-md ${language === "he" ? "text-right" : "text-left"}`}
      >
        <SheetHeader className="space-y-2 pr-6">
          <SheetTitle className="text-xl flex items-center gap-2">
            <History className="h-5 w-5" />
            {text.history[language]}
          </SheetTitle>
          <SheetClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>
        
        <div className="mt-6 flex-1 overflow-y-auto">
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div 
                  key={item.timestamp} 
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="text-xs text-gray-500 mb-2">
                    {formatDate(item.timestamp)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">{text.bill[language]}:</span>
                    </div>
                    <div className="font-medium">
                      {formatCurrency(item.bill)}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">{text.tip[language]}:</span>
                    </div>
                    <div className="font-medium">
                      {item.tipPercent}%
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">{text.people[language]}:</span>
                    </div>
                    <div className="font-medium">
                      {item.numPeople}
                    </div>
                    
                    <div className="col-span-2 h-px bg-gray-100 dark:bg-gray-700 my-2"></div>
                    
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">{text.perPerson[language]}:</span>
                    </div>
                    <div className="font-medium text-blue-600 dark:text-blue-400">
                      {formatCurrency(item.totalPerPerson)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-40 text-gray-500">
              <History className="h-12 w-12 mb-2 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-medium">{text.noHistory[language]}</h3>
              <p className="text-sm mt-1">{text.startCalculating[language]}</p>
            </div>
          )}
        </div>
        
        <SheetFooter className="mt-6">
          <Button 
            variant="destructive" 
            onClick={handleClearHistory}
            disabled={history.length === 0}
            className="w-full flex items-center gap-2 justify-center"
          >
            <Trash2 className="h-4 w-4" />
            {text.clearHistory[language]}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}