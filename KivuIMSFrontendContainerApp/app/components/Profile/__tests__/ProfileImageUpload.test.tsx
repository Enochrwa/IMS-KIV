import React from "react";
import { screen, fireEvent, render } from "@testing-library/react";
import { jest } from "@jest/globals";
import ProfileImageUpload from "../ProfileImageUpload";

// Mock the renderWithProviders to avoid GraphQL utils issues
jest.mock("../../../test-utils/renderUtils", () => ({
  renderWithProviders: (ui: React.ReactElement) => {
    return render(ui);
  }
}));

// Import after mocking
import { renderWithProviders } from "../../../test-utils/renderUtils";

describe("ProfileImageUpload Component", () => {
  const mockOnImageChange = jest.fn();
  const mockT = jest.fn((key: string, defaultValue: string) => defaultValue);

  const defaultProps = {
    profileImage: undefined,
    uploadProgress: 0,
    onImageChange: mockOnImageChange,
    t: mockT
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default props", () => {
    const { container } = renderWithProviders(
      <ProfileImageUpload {...defaultProps} />
    );

    expect(screen.getByTestId("profile-avatar")).toBeInTheDocument();
    expect(screen.getByTestId("upload-button")).toBeInTheDocument();
    expect(screen.getByTestId("file-input")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders with profile image", () => {
    const propsWithImage = {
      ...defaultProps,
      profileImage: "profile.jpg"
    };

    const { container } = renderWithProviders(
      <ProfileImageUpload {...propsWithImage} />
    );

    const avatar = screen.getByTestId("profile-avatar");
    // Check that the img element inside the avatar has the src and alt
    const img = avatar.querySelector("img");
    expect(img).toHaveAttribute("src", "profile.jpg");
    expect(img).toHaveAttribute("alt", "Profile");
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders upload progress when progress > 0", () => {
    const propsWithProgress = {
      ...defaultProps,
      uploadProgress: 50
    };

    const { container } = renderWithProviders(
      <ProfileImageUpload {...propsWithProgress} />
    );

    expect(screen.getByTestId("upload-progress")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("does not render progress bar when progress is 0", () => {
    renderWithProviders(<ProfileImageUpload {...defaultProps} />);

    expect(screen.queryByTestId("upload-progress")).not.toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("calls onImageChange when file input changes", () => {
    renderWithProviders(<ProfileImageUpload {...defaultProps} />);

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["dummy content"], "example.png", {
      type: "image/png"
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockOnImageChange).toHaveBeenCalledTimes(1);
    expect(mockOnImageChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          files: [file]
        })
      })
    );
  });

  it("calls translation function with correct key", () => {
    renderWithProviders(<ProfileImageUpload {...defaultProps} />);

    expect(mockT).toHaveBeenCalledWith(
      "upload-profile-image",
      "Upload Profile Image"
    );
  });

  it("renders with different upload progress values", () => {
    const testCases = [25, 75, 100];

    testCases.forEach((progress) => {
      const { unmount } = renderWithProviders(
        <ProfileImageUpload {...defaultProps} uploadProgress={progress} />
      );

      const progressBar = screen.getByTestId("upload-progress");
      expect(progressBar).toHaveAttribute("aria-valuenow", progress.toString());

      unmount();
    });
  });

  it("has correct button styling and attributes", () => {
    renderWithProviders(<ProfileImageUpload {...defaultProps} />);

    const button = screen.getByTestId("upload-button");
    expect(button).toBeInTheDocument();

    const input = screen.getByTestId("file-input");
    expect(input).toHaveAttribute("type", "file");
    expect(input).toHaveAttribute("accept", "image/*");
    expect(input).toHaveStyle({ display: "none" });
  });

  it("avatar has correct dimensions", () => {
    renderWithProviders(<ProfileImageUpload {...defaultProps} />);

    const avatar = screen.getByTestId("profile-avatar");
    expect(avatar).toHaveStyle({
      width: "80px",
      height: "80px"
    });
  });
});
