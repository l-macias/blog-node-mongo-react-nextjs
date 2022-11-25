import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
      min: 3,
      max: 140,
    },
    name: {
      type: String,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    body: {
      type: {},
      required: true,
      min: 200,
      max: 2000000,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: {},
      max: 1000,
    },
    mtitle: {
      type: String,
    },
    mdesc: {
      type: {},
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    categories: [{ type: ObjectId, ref: "Category", required: true }],
    tags: [{ type: ObjectId, ref: "Tag", required: true }],
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);
