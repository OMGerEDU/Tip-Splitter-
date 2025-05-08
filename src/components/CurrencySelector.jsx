import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export default function CurrencySelector({ language, currency, setCurrency }) {
  const currencies = [
    { value: "USD", symbol: "$", name: { en: "US Dollar", he: "דולר אמריקאי" } },
    { value: "EUR", symbol: "€", name: { en: "Euro", he: "אירו" } },
    { value: "GBP", symbol: "£", name: { en: "British Pound", he: "ליש״ט" } },
    { value: "ILS", symbol: "₪", name: { en: "Israeli Shekel", he: "שקל" } }
  ];

  const text = {
    currency: {
      en: "Currency",
      he: "מטבע"
    },
    tooltip: {
      en: "Select your preferred currency",
      he: "בחר את המטבע המועדף עליך"
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        {text.currency[language]}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              {text.tooltip[language]}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </label>
      <Select value={currency} onValueChange={setCurrency}>
        <SelectTrigger className="w-[120px] bg-white dark:bg-gray-800">
          <SelectValue placeholder="USD" />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((curr) => (
            <SelectItem key={curr.value} value={curr.value}>
              {curr.symbol} - {curr.name[language]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}