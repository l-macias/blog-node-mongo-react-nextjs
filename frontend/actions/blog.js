import fetch from "isomorphic-fetch";
import { API } from "../config";

export const createBlog = async (blog, token) => {
  try {
    const response = await fetch(`${API}/blog`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: blog,
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

export const listBlogsWithCategoriesAndTags = async (skip, limit) => {
  try {
    const data = {
      limit,
      skip,
    };
    const response = await fetch(`${API}/blogs-categories-tags`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

export const singleBlog = async (slug) => {
  try {
    return fetch(`${API}/blog/${slug}`, {
      method: "GET",
    }).then((response) => {
      return response.json();
    });
  } catch (error) {
    console.log(error);
  }
};

export const listRelated = async (blog) => {
  try {
    const response = await fetch(`${API}/blogs/related`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blog),
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

export const list = async () => {
  try {
    return fetch(`${API}/blogs`, {
      method: "GET",
    }).then((response) => {
      return response.json();
    });
  } catch (error) {
    console.log(error);
  }
};

export const removeBlog = async (slug, token) => {
  try {
    const response = await fetch(`${API}/blog/${slug}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

export const udpate = async (blog, token, slug) => {
  try {
    const response = await fetch(`${API}/blog/${slug}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: blog,
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};
