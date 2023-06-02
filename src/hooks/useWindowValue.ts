import { useEffect, useLayoutEffect, useState } from 'react';
import { getValueByPath } from 'utils';

export function useWindowValue({
  path,
  initialValue = null,
}: {
  path: string;
  initialValue?: any;
}) {
  const [windowVallue, setWindowVallue] = useState<any>(initialValue);
  useEffect(() => {
    const value = getValueByPath(window, path);
    setWindowVallue(value);
  }, [path]);
  return windowVallue;
}
