import { useState, useEffect } from "react";

export const useVerification = (userFid?: number) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!userFid) {
      setIsLoading(false);
      return;
    }
    const fetchIsVerified = async () => {
      try {
        const response = await fetch(`/api/verification/${userFid}`);
        const data = await response.json();
        setIsVerified(data.isVerified);
      } catch {
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIsVerified();
  }, [userFid]);
  return { isVerified, setIsVerified, isLoading };
};
