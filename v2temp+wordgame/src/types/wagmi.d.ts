import type { Connector } from "wagmi";

declare module "wagmi" {
  interface Connectors {
    frameConnector: () => Connector;
  }
}