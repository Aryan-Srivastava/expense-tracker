import { useState } from 'react';

/**
 * A hook that returns a function to force a component to re-render
 */
export function useForceUpdate() {
  const [, setValue] = useState(0);
  return () => setValue(value => value + 1);
}
