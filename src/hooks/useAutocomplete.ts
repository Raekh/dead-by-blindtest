import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getAllKillerNames, getKillerById, isGenericTheme } from '../data/killers';
import type { KeyboardEvent } from 'react';

export interface AutocompleteSuggestion {
  display: string;
  id: string;
  isGeneric: boolean;
  killerName: string;
}

export interface UseAutocompleteReturn {
  inputValue: string;
  setInputValue: (value: string) => void;
  suggestions: AutocompleteSuggestion[];
  selectedItem: AutocompleteSuggestion | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedIndex: number;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => string | null;
  handleSelect: (item: AutocompleteSuggestion) => void;
  reset: () => void;
  listRef: React.RefObject<HTMLUListElement | null>;
}

export function useAutocomplete(isGenericRound: boolean = false, onSelect?: (name: string) => void): UseAutocompleteReturn {
  const [inputValue, setInputValueState] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [selectedItem, setSelectedItem] = useState<AutocompleteSuggestion | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement | null>(null);

  const allNames = useMemo(() => getAllKillerNames(), []);

  const handleInputChange = useCallback((value: string) => {
    setInputValueState(value);
    setSelectedIndex(-1);
    setSelectedItem(null);

    if (value.trim().length === 0) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const normalizedValue = value.toLowerCase();
    
    // Find matching killers and deduplicate by killer ID
    const matchedKillerIds = new Set<string>();
    const matches: AutocompleteSuggestion[] = [];
    
    for (const item of allNames) {
      if (item.display.toLowerCase().includes(normalizedValue)) {
        // Only add if we haven't seen this killer yet
        if (!matchedKillerIds.has(item.id)) {
          matchedKillerIds.add(item.id);
          const killer = getKillerById(item.id);
          if (killer) {
            // Check if this killer uses generic themes
            const killerUsesGeneric = killer.audio.terrorRadius?.themes.some(t => isGenericTheme(t)) ?? false;
            
            // If this is a generic round and the killer uses generic themes, show as "Generic (Killer Name)"
            if (isGenericRound && killerUsesGeneric) {
              matches.push({
                display: `Generic (${killer.name})`,
                id: killer.id,
                isGeneric: true,
                killerName: killer.name,
              });
            } else {
              matches.push({
                display: killer.name,
                id: killer.id,
                isGeneric: false,
                killerName: killer.name,
              });
            }
          }
        }
      }
      if (matches.length >= 8) break;
    }

    setSuggestions(matches);
    setIsOpen(matches.length > 0);
  }, [allNames, isGenericRound]);

  const handleSelect = useCallback((item: AutocompleteSuggestion) => {
    // Set input to the display value (which includes "Generic (...)" if applicable)
    setInputValueState(item.display);
    setSelectedItem(item);
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onSelect) {
      onSelect(item.display);
    }
  }, [onSelect]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>): string | null => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        return inputValue;
      }
      return null;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
          return null;
        }
        return inputValue;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
    return null;
  }, [isOpen, suggestions, selectedIndex, inputValue, handleSelect]);

  const reset = useCallback(() => {
    setInputValueState('');
    setSelectedItem(null);
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('li');
      if (items[selectedIndex]) {
        items[selectedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  return {
    inputValue,
    setInputValue: handleInputChange,
    suggestions,
    selectedItem,
    isOpen,
    setIsOpen,
    selectedIndex,
    handleKeyDown,
    handleSelect,
    reset,
    listRef,
  };
}
