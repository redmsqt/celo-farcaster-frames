'use client'

import { useDisconnect, useAppKitAccount } from '@reown/appkit/react'

export const ConnectButton = () => {
  const { isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <appkit-button />
      {isConnected && (
        <button
          onClick={handleDisconnect}
          className="p-2 hover:opacity-75 bg-red-800 rounded ml-2 mb-2"
          aria-label="Disconnect"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      )}

    </div>
  )
}
