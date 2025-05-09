import { render, screen, waitFor } from "@testing-library/react";
import ContributionsList from "./ContributionsList";
import { MemoryRouter } from "react-router-dom";

// Mock the fetch API
beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      total: 1,
      contributions: [
        {
          title: "Mars Mission",
          description: "Update on the Mars mission.",
          startTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          endTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
          owner: "NASA",
          status: "Active",
        },
      ],
    }),
  }) as jest.Mock;
});

describe("ContributionsList Component", () => {
  it("renders fetched contributions and displays them", async () => {
    render(
      <MemoryRouter>
        <ContributionsList />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Mars Mission")).toBeInTheDocument();
    expect(screen.getByText(/update on the mars mission/i)).toBeInTheDocument();

    expect(screen.getByText(/Status:/i)).toBeInTheDocument();
    expect(screen.getByText(/Active/i)).toBeInTheDocument();
  });

  it("shows error message if fetch fails", async () => {
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      }),
    );

    render(
      <MemoryRouter>
        <ContributionsList />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(
        screen.getByText(/service is temporarily unavailable/i),
      ).toBeInTheDocument(),
    );
  });

  it("displays 'no contributions found' if list is empty", async () => {
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            total: 0,
            contributions: [],
          }),
      }),
    );

    render(
      <MemoryRouter>
        <ContributionsList />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText(/no contributions found/i)).toBeInTheDocument(),
    );
  });
});
