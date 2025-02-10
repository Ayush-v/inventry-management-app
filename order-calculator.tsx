// @ts-nocheck

import * as React from "react";
import { Calculator, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface CalculatorInputs {
  dailyUsage: number;
  daysUntilDelivery: number;
  backupMultiplier: number;
  stockInPounds: number;
  traysInStock: number;
  weightPerTray: number;
}

// Preset values for each input
const presets = {
  dailyUsage: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  daysUntilDelivery: [1, 2, 3, 4, 5, 6, 7, 14, 21, 30],
  backupMultiplier: [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5],
  stockInPounds: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
  traysInStock: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  weightPerTray: [5, 10, 14, 15, 20, 25, 30, 35, 40, 45],
};

interface ComboboxInputProps {
  value: number;
  onChange: (value: number) => void;
  presetValues: number[];
  label: string;
  placeholder?: string;
}

function ComboboxInput({
  value,
  onChange,
  presetValues,
  label,
  placeholder,
}: ComboboxInputProps) {
  const [open, setOpen] = React.useState(false);
  const formattedPresets = presetValues.map((v) => ({
    value: v.toString(),
    label: v.toString(),
  }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={placeholder || `Search ${label}...`} />
          <CommandList>
            <CommandEmpty>No value found.</CommandEmpty>
            <CommandGroup>
              {formattedPresets.map((preset) => (
                <CommandItem
                  key={preset.value}
                  value={preset.value}
                  onSelect={(currentValue) => {
                    onChange(Number(currentValue));
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === Number(preset.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {preset.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function OrderCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    dailyUsage: 42,
    daysUntilDelivery: 2,
    backupMultiplier: 0.2,
    stockInPounds: 10,
    traysInStock: 3,
    weightPerTray: 14,
  });
  const [results, setResults] = useState<{
    exact: number | null;
    rounded: number | null;
  }>({
    exact: null,
    rounded: null,
  });

  const handleCalculate = () => {
    const exact =
      inputs.dailyUsage *
      inputs.daysUntilDelivery *
      (1 + inputs.backupMultiplier);
    setResults({
      exact,
      rounded: Math.floor(exact),
    });
  };

  const handleInputChange = (key: keyof CalculatorInputs, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Order Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-6 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Daily Usage (lbs)</label>
            <ComboboxInput
              value={inputs.dailyUsage}
              onChange={(value) => handleInputChange("dailyUsage", value)}
              presetValues={presets.dailyUsage}
              label="Daily Usage"
              placeholder="Enter usage..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Days Until Delivery</label>
            <ComboboxInput
              value={inputs.daysUntilDelivery}
              onChange={(value) =>
                handleInputChange("daysUntilDelivery", value)
              }
              presetValues={presets.daysUntilDelivery}
              label="Days"
              placeholder="Enter days..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Backup Multiplier</label>
            <ComboboxInput
              value={inputs.backupMultiplier}
              onChange={(value) => handleInputChange("backupMultiplier", value)}
              presetValues={presets.backupMultiplier}
              label="Multiplier"
              placeholder="Enter multiplier..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Stock (lbs)</label>
            <ComboboxInput
              value={inputs.stockInPounds}
              onChange={(value) => handleInputChange("stockInPounds", value)}
              presetValues={presets.stockInPounds}
              label="Stock"
              placeholder="Enter stock..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Trays in Stock</label>
            <ComboboxInput
              value={inputs.traysInStock}
              onChange={(value) => handleInputChange("traysInStock", value)}
              presetValues={presets.traysInStock}
              label="Trays"
              placeholder="Enter trays..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Weight per Tray</label>
            <ComboboxInput
              value={inputs.weightPerTray}
              onChange={(value) => handleInputChange("weightPerTray", value)}
              presetValues={presets.weightPerTray}
              label="Weight"
              placeholder="Enter weight..."
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleCalculate} className="flex-1">
            <Calculator className="mr-2 h-4 w-4" />
            Calculate Order
          </Button>

          {results.exact !== null && (
            <Card className="flex-1 bg-muted">
              <CardContent className="p-4">
                <div className="flex justify-between items-center space-x-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Exact:</p>
                    <p className="font-mono">{results.exact.toFixed(2)} lbs</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Rounded:</p>
                    <p className="font-mono font-bold">{results.rounded} lbs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
