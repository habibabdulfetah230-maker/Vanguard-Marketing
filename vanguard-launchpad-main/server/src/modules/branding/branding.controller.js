import asyncHandler from "../../utils/asyncHandler.js";
import { createError } from "../../utils/errorResponse.js";
import { createBrandingItem, listBrandingItems, updateBrandingItem, deleteBrandingItem } from "./branding.service.js";

const mapBrandingItem = (item) => {
  const plain = typeof item?.toObject === "function" ? item.toObject({ versionKey: false }) : item;
  const { _id, createdAt, updatedAt, ...rest } = plain;

  return {
    id: _id ? _id.toString() : plain.id,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    ...rest,
  };
};

const createBrandingItemController = asyncHandler(async (req, res) => {
  const { body } = req.validated ?? {};
  const { file } = req;

  if (!file) {
    throw createError(400, "Image upload is required");
  }

  if (!body) {
    throw createError(400, "Invalid request payload");
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

  const brandingItem = await createBrandingItem({
    title: body.title,
    description: body.description ?? "",
    externalLink: body.externalLink,
    imageUrl,
  });

  res.status(201).json(mapBrandingItem(brandingItem));
});

const listBrandingItemsController = asyncHandler(async (_req, res) => {
  const items = await listBrandingItems();
  res.status(200).json(items.map(mapBrandingItem));
});

const updateBrandingItemController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { body } = req.validated ?? {};
  const { file } = req;

  const updateData = { ...body };
  if (file) {
    updateData.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  }

  const brandingItem = await updateBrandingItem(id, updateData);
  if (!brandingItem) {
    throw createError(404, "Branding item not found");
  }

  res.status(200).json(mapBrandingItem(brandingItem));
});

const deleteBrandingItemController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteBrandingItem(id);
  res.status(204).send();
});

export { createBrandingItemController, listBrandingItemsController, updateBrandingItemController, deleteBrandingItemController };
