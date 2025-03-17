import { CallApiFunction, RequestInit } from 'apis/api.type';
import { useState, useEffect } from 'react';

function useFetch<R>(
  callApiFunc: CallApiFunction,
  options: RequestInit = {},
  auto: boolean = true
) {
  const [data, setData] = useState<R | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<{ value: boolean }>({
    value: false,
  });

  useEffect(() => {
    async function callApi() {
      setLoading(true);
      try {
        const response = await callApiFunc(options);
        if (response.status < 200 || response.status >= 300) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const result = await response.data;
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    if (auto || refetch.value) {
      callApi();
    }
  }, [auto, refetch]);

  return { data, error, isLoading, setRefetch };
}

export default useFetch;
