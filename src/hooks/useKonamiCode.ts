import { useEffect, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function useKonamiCode(callback: () => void) {
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newKeys = [...keys, e.key];
      // Keep only the length of the Konami code
      if (newKeys.length > KONAMI_CODE.length) {
        newKeys.shift();
      }
      setKeys(newKeys);

      // Check match
      const isMatch = newKeys.every((key, idx) => key.toLowerCase() === KONAMI_CODE[idx].toLowerCase());
      if (isMatch) {
        callback();
        setKeys([]); // Clear sequence
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, callback]);
}
