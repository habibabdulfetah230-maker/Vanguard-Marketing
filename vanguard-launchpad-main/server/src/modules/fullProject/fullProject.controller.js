import asyncHandler from "../../utils/asyncHandler.js";
import { createError } from "../../utils/errorResponse.js";
import { createFullProject, listFullProjects, updateFullProject, deleteFullProject, clearAllFullProjects } from "./fullProject.service.js";

const mapFullProject = (item) => {
  const plain = typeof item?.toObject === "function" ? item.toObject({ versionKey: false }) : item;
  const { _id, createdAt, updatedAt, ...rest } = plain;

  return {
    id: _id ? _id.toString() : plain.id,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    ...rest,
  };
};

const createFullProjectController = asyncHandler(async (req, res) => {
  const { body } = req.validated ?? {};
  const { file } = req;

  if (!file) {
    throw createError(400, "Image upload is required");
  }

  if (!body) {
    throw createError(400, "Invalid request payload");
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

  const project = await createFullProject({
    title: body.title,
    description: body.description ?? "",
    externalLink: body.externalLink,
    imageUrl,
  });

  res.status(201).json(mapFullProject(project));
});

const listFullProjectsController = asyncHandler(async (_req, res) => {
  const items = await listFullProjects();
  res.status(200).json(items.map(mapFullProject));
});

const updateFullProjectController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { body } = req.validated ?? {};
  const { file } = req;

  const updateData = { ...body };
  if (file) {
    updateData.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  }

  const project = await updateFullProject(id, updateData);
  if (!project) {
    throw createError(404, "Full project not found");
  }

  res.status(200).json(mapFullProject(project));
});

const deleteFullProjectController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteFullProject(id);
  res.status(204).send();
});

const clearAllFullProjectsController = asyncHandler(async (_req, res) => {
  await clearAllFullProjects();
  res.status(200).json({ message: "All full projects cleared successfully" });
});

export { createFullProjectController, listFullProjectsController, updateFullProjectController, deleteFullProjectController, clearAllFullProjectsController };
