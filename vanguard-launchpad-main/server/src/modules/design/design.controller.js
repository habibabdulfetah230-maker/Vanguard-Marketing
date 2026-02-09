import asyncHandler from "../../utils/asyncHandler.js";
import { createError } from "../../utils/errorResponse.js";
import { createDesignItem, listDesignItems, updateDesignItem, deleteDesignItem } from "./design.service.js";

const mapDesignItem = (item) => {
  const plain = typeof item?.toObject === "function" ? item.toObject({ versionKey: false }) : item;
  const { _id, createdAt, updatedAt, ...rest } = plain;

  return {
    id: _id ? _id.toString() : plain.id,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    ...rest,
  };
};

const createDesignController = asyncHandler(async (req, res) => {
  const { body } = req.validated ?? {};
  const { file } = req;

  if (!file) {
    throw createError(400, "Image upload is required");
  }

  if (!body) {
    throw createError(400, "Invalid request payload");
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

  const item = await createDesignItem({
    title: body.title,
    description: body.description ?? "",
    externalLink: body.externalLink ?? "",
    imageUrl,
  });

  res.status(201).json(mapDesignItem(item));
});

const listDesignController = asyncHandler(async (_req, res) => {
  const items = await listDesignItems();
  res.status(200).json(items.map(mapDesignItem));
});

const updateDesignController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { body } = req.validated ?? {};
  const { file } = req;

  const updateData = { ...body };
  if (file) {
    updateData.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  }

  const item = await updateDesignItem(id, updateData);
  if (!item) {
    throw createError(404, "Design item not found");
  }

  res.status(200).json(mapDesignItem(item));
});

const deleteDesignController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteDesignItem(id);
  res.status(204).send();
});

export { createDesignController, listDesignController, updateDesignController, deleteDesignController };
