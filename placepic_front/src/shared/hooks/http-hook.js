import { useState, useCallback, useRef } from 'react';

// export const useHttpClient = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState();

//   const activeHttpRequests = useRef([]);

//   const sendRequest = useCallback(
//     async (url, method = 'GET', body = null, headers = {}) => {
//       setIsLoading(true);
//       const httpAbortCtrl = new AbortController();
//       activeHttpRequests.current.push(httpAbortCtrl);

//       try {
//         const response = await fetch(url, {
//           method,
//           body,
//           headers,
//           signal: httpAbortCtrl.signal
//         });

//         const responseData = await response.json();

//         activeHttpRequests.current = activeHttpRequests.current.filter(
//           reqCtrl => reqCtrl !== httpAbortCtrl
//         );

//         if (!response.ok) {
//           throw new Error(responseData.message);
//         }

//         setIsLoading(false);
//         return responseData;
//       } catch (err) {
//         setError(err.message);
//         setIsLoading(false);
//         throw err;
//       }
//     },
//     []
//   );

//   const clearError = () => {
//     setError(null);
//   };

//   useEffect(() => {
//     return () => {
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//       activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
//     };
//   }, []);

//   return { isLoading, error, sendRequest, clearError };
// };
export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        // Check if the request was not canceled
        if (!httpAbortCtrl.signal.aborted) {
          if (!response.ok) {
            throw new Error(responseData.message); // Handle server-sent errors
          } else {
            setError(null); // Clear previous errors
            setIsLoading(false);
          }
        }

        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  return { isLoading, error, sendRequest, clearError };
};

