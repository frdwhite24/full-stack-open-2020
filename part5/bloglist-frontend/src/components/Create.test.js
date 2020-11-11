import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import Create from "./Create";

test("correctly submits new blog form", () => {
  const blog = {
    title: "This is a test blog",
    author: "John Smith",
    url: "www.url.com",
  };
  const mockHandler = jest.fn();
  const component = render(<Create createNewBlog={mockHandler} />);

  const title = component.container.querySelector("#title");
  const author = component.container.querySelector("#author");
  const url = component.container.querySelector("#url");

  const form = component.container.querySelector("form");

  fireEvent.change(title, {
    target: { value: blog.title },
  });
  fireEvent.change(author, {
    target: { value: blog.author },
  });
  fireEvent.change(url, {
    target: { value: blog.url },
  });

  fireEvent.submit(form);

  expect(mockHandler.mock.calls).toHaveLength(1);
  expect(mockHandler.mock.calls[0][0]).toEqual(blog);
});
