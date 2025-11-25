import { useMemo } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hook to extract query parameters from location.search
 * @returns {Record<string, string>} Object containing query parameters as key-value pairs
 */
const useQueryParams = (): Record<string, string> => {
  const location = useLocation();

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    const searchParams = new URLSearchParams(location.search);

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return params;
  }, [location.search]);

  return queryParams;
};

export default useQueryParams;
