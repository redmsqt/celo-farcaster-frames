import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useWaitForTransactionReceipt } from "wagmi";

type LoadingTransactionProps = {
  txHash: `0x${string}`;
  handleSuccess: () => void
};

export function TransactionLoader({ txHash, handleSuccess }: LoadingTransactionProps) {
  const { isLoading, isError, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    timeout: 5000,
    chainId: 44787,
    retryCount: 2,
  });

  const handler = useCallback(() => {
    if (isSuccess) {
      handleSuccess()
    }
  }, [isSuccess, handleSuccess]);

  useEffect(() => {
    handler()
  }, [handler])

  return (
    <div className="w-44 mt-5 bg-[#F97316] text-white font-semibold py-3 px-4 rounded-xl text-lg text-center">
      {isLoading && (
        <div className="flex items-center justify-center animate-pulse">
          <Loader2 className="animate-spin w-5 h-5 mr-2" />
          Processing
        </div>
      )}

      {isSuccess && (
        <div className="flex items-center justify-center text-green-200">
          <CheckCircle className="w-5 h-5 mr-2" />
          Success
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center text-red-200">
          <XCircle className="w-5 h-5 mr-2" />
          Failed
        </div>
      )}
    </div>
  );
}
