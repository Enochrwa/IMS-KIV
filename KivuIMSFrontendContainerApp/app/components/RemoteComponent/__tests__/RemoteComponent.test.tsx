import React from "react";
import { render } from "@testing-library/react";
import RemoteComponent from "../RemoteComponent";

jest.mock("@module-federation/utilities", () => ({
  importRemote: jest.fn()
}));

// pull the mock back out
const { importRemote } = jest.requireMock("@module-federation/utilities") as {
  importRemote: jest.Mock;
};

describe("RemoteComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("match snapshot", () => {
    (importRemote as jest.Mock).mockImplementation(() => new Promise(() => {}));

    const { asFragment } = render(
      <RemoteComponent
        scope="testScope"
        module="./TestModule"
        url="http://localhost:3001/remoteEntry.js"
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
