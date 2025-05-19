import { render, screen } from '@testing-library/react';
import Home from "@/app/page";

describe("Home", () => {
  it("renders without crashing", async () => {
    render(<Home />);
    const googleLink = screen.getByRole("link", {
      name: /Sign up with Google/i,
    });
    expect(googleLink).toBeInTheDocument();
  })
})