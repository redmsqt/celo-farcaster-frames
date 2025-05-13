import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

export const useVerification = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    const fetchIsVerified = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/verification/${address}`);
        const data = await response.json();
        setIsVerified(data.isVerified);
      } catch {
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIsVerified();
  }, [address]);
  return { isVerified, setIsVerified, isLoading };
};
