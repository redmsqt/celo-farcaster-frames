import { render, screen } from "@testing-library/react";
import GamePage from "../page";

jest.mock("wagmi", () => ({
  useAccount: () => ({ isConnected: true, address: "0xTestAddress" }),
  useReadContract: () => ({ data: 100 }),
  useWriteContract: () => ({ writeContract: jest.fn() })
}));

describe("GamePage", () => {
  it("displays Celo score", () => {
    render(<GamePage />);
    expect(screen.getByText("Your High Score on Celo")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });
});