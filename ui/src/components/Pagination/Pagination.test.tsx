import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";

describe("Pagination Component", () => {
  it("renders correctly with current page and total pages", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />,
    );

    expect(screen.getByText("Page 1 of 5")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Previous/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
  });

  it("calls onPageChange when 'Next' button is clicked", () => {
    const onPageChangeMock = jest.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChangeMock}
      />,
    );

    const nextButton = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextButton);

    expect(onPageChangeMock).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange when 'Previous' button is clicked", () => {
    const onPageChangeMock = jest.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={onPageChangeMock}
      />,
    );

    const prevButton = screen.getByRole("button", { name: /Previous/i });
    fireEvent.click(prevButton);

    expect(onPageChangeMock).toHaveBeenCalledWith(1);
  });
});
