import asyncHandler from "../../utils/asyncHandler.js";
import { createError } from "../../utils/errorResponse.js";
import { createTestimonial, listTestimonials, updateTestimonial, deleteTestimonial, clearAllTestimonials } from "./testimonial.service.js";

const mapTestimonial = (item) => {
  const plain = typeof item?.toObject === "function" ? item.toObject({ versionKey: false }) : item;
  const { _id, createdAt, updatedAt, ...rest } = plain;

  return {
    id: _id ? _id.toString() : plain.id,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    ...rest,
  };
};

const createTestimonialController = asyncHandler(async (req, res) => {
  const { body } = req.validated ?? {};
  const { file } = req;

  if (!file) {
    throw createError(400, "Photo upload is required");
  }

  if (!body) {
    throw createError(400, "Invalid request payload");
  }

  const photoUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

  const testimonial = await createTestimonial({
    name: body.name,
    role: body.role,
    testimonial: body.testimonial,
    externalLink: body.externalLink ?? "",
    photoUrl,
  });

  res.status(201).json(mapTestimonial(testimonial));
});

const listTestimonialsController = asyncHandler(async (_req, res) => {
  const items = await listTestimonials();
  res.status(200).json(items.map(mapTestimonial));
});

const updateTestimonialController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { body } = req.validated ?? {};
  const { file } = req;

  const updateData = { ...body };
  if (file) {
    updateData.photoUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  }

  const testimonial = await updateTestimonial(id, updateData);
  if (!testimonial) {
    throw createError(404, "Testimonial not found");
  }

  res.status(200).json(mapTestimonial(testimonial));
});

const deleteTestimonialController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteTestimonial(id);
  res.status(204).send();
});

const clearAllTestimonialsController = asyncHandler(async (_req, res) => {
  await clearAllTestimonials();
  res.status(200).json({ message: "All testimonials cleared successfully" });
});

export { createTestimonialController, listTestimonialsController, updateTestimonialController, deleteTestimonialController, clearAllTestimonialsController };
