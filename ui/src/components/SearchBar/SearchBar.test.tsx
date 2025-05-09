import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "./SearchBar";

describe("SearchBar Component", () => {
  it("displays the correct value based on searchQuery prop", () => {
    render(
      <SearchBar searchQuery="Tech Talk Live" onSearchChange={() => {}} />,
    );

    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toHaveValue("Tech Talk Live");
  });

  it("calls onSearchChange function when input changes", () => {
    let receivedValue = "";

    const onSearchChangeMock = jest.fn((e) => {
      receivedValue = e.target.value;
    });

    render(<SearchBar searchQuery="" onSearchChange={onSearchChangeMock} />);

    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, {
      target: { value: "Mars Mission Updates" },
    });

    expect(receivedValue).toBe("Mars Mission Updates");
  });
});
