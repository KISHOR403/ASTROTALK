import { useState, useEffect } from 'react';
import { Check, Loader2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverAnchor,
} from '@/components/ui/popover';
import { useLocationSuggestions } from '@/hooks/useLocationSuggestions';

interface LocationInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const LocationInput = ({
    value,
    onChange,
    placeholder = 'Search for a location...',
    className,
}: LocationInputProps) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const { suggestions, isLoading } = useLocationSuggestions(inputValue);

    // Sync local input value with external value prop
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Manage popover visibility
    useEffect(() => {
        if (inputValue.length >= 2 && (isLoading || suggestions.length > 0)) {
            setOpen(true);
        } else if (inputValue.length < 2) {
            setOpen(false);
        }
    }, [inputValue, isLoading, suggestions]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverAnchor asChild>
                <div className={cn('relative w-full', className)}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            // Only call external onChange if we want the parent to track every keystroke
                            // which is likely desired for field reset/binding
                            onChange(e.target.value);
                        }}
                        onFocus={() => {
                            if (inputValue.length >= 2) setOpen(true);
                        }}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-accent/20 focus:border-accent focus:ring-1 focus:ring-accent focus:shadow-[0_0_15px_rgba(234,179,8,0.3)] outline-none transition-all text-foreground placeholder:text-muted-foreground"
                    />
                </div>
            </PopoverAnchor>
            <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
                sideOffset={5}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onFocusOutside={(e) => e.preventDefault()}
            >
                <Command shouldFilter={false} className="border-none">
                    <CommandList>
                        {isLoading && (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                <span className="text-sm text-muted-foreground">Searching...</span>
                            </div>
                        )}
                        {!isLoading && suggestions.length === 0 && inputValue.length >= 2 && (
                            <CommandEmpty>No location found.</CommandEmpty>
                        )}
                        {!isLoading && suggestions.length > 0 && (
                            <CommandGroup>
                                {suggestions.map((suggestion) => (
                                    <CommandItem
                                        key={suggestion.place_id}
                                        value={suggestion.display_name}
                                        onSelect={() => {
                                            onChange(suggestion.display_name);
                                            setInputValue(suggestion.display_name);
                                            setOpen(false);
                                        }}
                                        className="flex items-start gap-2 py-3"
                                    >
                                        <MapPin className="h-4 w-4 mt-1 shrink-0 text-accent" />
                                        <span>{suggestion.display_name}</span>
                                        <Check
                                            className={cn(
                                                'ml-auto h-4 w-4',
                                                value === suggestion.display_name ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
