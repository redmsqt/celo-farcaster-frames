import { Address } from "viem";

type ChainId = "42220" | "44787";

export interface Token {
  id: TokenId;
  symbol: string;
  name: string;
  color: string;
  decimals: number;
}

export interface TokenWithAddress {
  address: Address;
}

export enum TokenId {
  CELO = "CELO",
  cUSD = "cUSD",
  cEUR = "cEUR",
  cREAL = "cREAL",
  USDC = "USDC",
  // USDT = "USDT",
}

export const NativeStableTokenIds = [
  TokenId.cUSD,
  TokenId.cEUR,
  TokenId.cREAL,
] as const;

export type StableTokenId = (typeof NativeStableTokenIds)[number]; // 'cUSD' | 'cEUR' | 'cREAL'

export const CELO: Token = Object.freeze({
  id: TokenId.CELO,
  symbol: TokenId.CELO,
  name: "Celo Native",
  color: "#FBCC5C",
  decimals: 18,
});

export const cUSD: Token = Object.freeze({
  id: TokenId.cUSD,
  symbol: TokenId.cUSD,
  name: "Celo Dollar",
  color: "#35D07F",
  decimals: 18,
});

export const cEUR: Token = Object.freeze({
  id: TokenId.cEUR,
  symbol: TokenId.cEUR,
  name: "Celo Euro",
  color: "#35D07F",
  decimals: 18,
});

export const cREAL: Token = Object.freeze({
  id: TokenId.cREAL,
  symbol: TokenId.cREAL,
  name: "Celo Real",
  color: "#35D07F",
  decimals: 18,
});

export const USDC: Token = Object.freeze({
  id: TokenId.USDC,
  symbol: TokenId.USDC,
  name: "USDC",
  color: "#2775CA",
  decimals: 6,
});

// export const USDT: Token = Object.freeze({
//   id: TokenId.USDT,
//   symbol: TokenId.USDT,
//   name: "USDT",
//   color: "#2775CA",
//   decimals: 6,
// });

export const Tokens: Record<TokenId, Token> = {
  [TokenId.CELO]: CELO as Token,
  [TokenId.cUSD]: cUSD as Token,
  [TokenId.cEUR]: cEUR as Token,
  [TokenId.cREAL]: cREAL as Token,
  [TokenId.USDC]: USDC as Token,
  // [TokenId.USDT]: USDT as Token,
};

export const TokenAddresses: Record<
  ChainId,
  Record<TokenId, Address>
> = Object.freeze({
  "42220": {
    [TokenId.CELO]: "0x471EcE3750Da237f93B8E339c536989b8978a438",
    [TokenId.cUSD]: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
    [TokenId.cEUR]: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
    [TokenId.cREAL]: "0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787",
    [TokenId.USDC]: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
    // [TokenId.USDT]: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
  },
  "44787": {
    [TokenId.CELO]: "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9",
    [TokenId.cUSD]: "0x874069fa1eb16d44d622f2e0ca25eea172369bc1",
    [TokenId.cEUR]: "0x10c892a6ec43a53e45d0b916b4b7d383b1b78c0f",
    [TokenId.cREAL]: "0xE4D517785D091D3c54818832dB6094bcc2744545",
    [TokenId.USDC]: "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B",
    // [TokenId.USDT]: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
  },
});

export function isNativeToken(tokenId: string): boolean {
  return Object.keys(Tokens).includes(tokenId);
}

export function isNativeStableToken(tokenId: string): boolean {
  return NativeStableTokenIds.includes(tokenId as StableTokenId);
}

export function getTokenOptionsByChainId(chainId: ChainId): TokenId[] {
  const tokensForChain = TokenAddresses[chainId];
  return tokensForChain
    ? Object.entries(tokensForChain).map(([tokenId]) => tokenId as TokenId)
    : [];
}

export function getTokenById(id: TokenId | string): Token {
  return Tokens[id as TokenId];
}

export function getTokenAddress(id: TokenId, chainId: ChainId): Address {
  const addr = TokenAddresses[chainId][id];
  if (!addr)
    throw new Error(`No address found for token ${id} on chain ${chainId}`);
  return addr;
}

function areAddressesEqual(address1: Address, address2: Address): boolean {
  return address1.toLowerCase() === address2.toLowerCase();
}

export function getTokenByAddress(address: Address): Token {
  const idAddressTuples = Object.values(TokenAddresses)
    .map((idToAddress) => Object.entries(idToAddress))
    .flat();
  for (const [id, tokenAddr] of idAddressTuples) {
    if (areAddressesEqual(address, tokenAddr as Address)) {
      return Tokens[id as TokenId];
    }
  }
  throw new Error(`No token found for address ${address}`);
}
