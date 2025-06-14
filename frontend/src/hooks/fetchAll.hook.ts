import { CallApiFunction, RequestInit } from 'apis/api.type';
import { useState, useEffect } from 'react';

export type ApiFuncArray = [CallApiFunction, RequestInit][];

function useFetchAll(apiFuncArray: ApiFuncArray, auto: boolean = true) {
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<{ value: boolean }>({
    value: false,
  });

  useEffect(() => {
    async function callApis() {
      setData(null);
      setError(null);
      setLoading(true);
      try {
        const responses = await Promise.all(
          apiFuncArray.map((apiFunc) => apiFunc[0](apiFunc[1]))
        );
        const results = [];
        for (let response of responses) {
          if (response.status >= 200 && response.status < 300) {
            results.push(await response.data);
          }
        }
        setData(results);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    if (auto || refetch.value) {
      callApis();
    }
  }, [auto, refetch]);

  return { data, error, isLoading, setRefetch };
}

export default useFetchAll;
