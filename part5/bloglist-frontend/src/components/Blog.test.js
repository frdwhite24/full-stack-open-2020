import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

test("renders content correctly not full info", () => {
  const blog = {
    title: "This is a test blog",
    author: "John Smith",
    url: "www.url.com",
  };

  const component = render(<Blog blog={blog} />);
  const element = component.container.querySelector(".JS__no-info-blog");
  const fullElement = component.container.querySelector(".JS__full-info-blog");

  expect(element).toHaveTextContent("This is a test blog");
  expect(element).toHaveTextContent("John Smith");
  expect(element).not.toHaveTextContent("www.url.com");
  expect(fullElement).toBeNull();
});

test("renders content correctly full info", () => {
  const blog = {
    title: "This is a test blog",
    author: "John Smith",
    url: "www.url.com",
    likes: 0,
  };

  const component = render(<Blog blog={blog} />);

  const button = component.getByText("view");
  fireEvent.click(button);

  const element = component.container.querySelector(".JS__no-info-blog");
  const fullElement = component.container.querySelector(".JS__full-info-blog");

  expect(fullElement).toHaveTextContent("This is a test blog");
  expect(fullElement).toHaveTextContent("John Smith");
  expect(fullElement).toHaveTextContent("www.url.com");
  expect(fullElement).toHaveTextContent("likes 0");
  expect(element).toBeNull();
});

test("registers like button press twice", () => {
  const blog = {
    title: "This is a test blog",
    author: "John Smith",
    url: "www.url.com",
    likes: 0,
    user: {
      id: 1,
    },
  };

  const mockHandler = jest.fn();
  const component = render(<Blog blog={blog} addLike={mockHandler} />);

  const viewButton = component.getByText("view");
  fireEvent.click(viewButton);

  const likeButton = component.getByText("like");
  fireEvent.click(likeButton);
  fireEvent.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
