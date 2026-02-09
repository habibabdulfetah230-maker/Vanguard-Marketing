import asyncHandler from "../../utils/asyncHandler.js";
import { createError } from "../../utils/errorResponse.js";
import { createContactSubmission, listContactSubmissions, markAsRead, deleteContactSubmission } from "./contact.service.js";

const mapContactSubmission = (item) => {
  const plain = typeof item?.toObject === "function" ? item.toObject({ versionKey: false }) : item;
  const { _id, createdAt, updatedAt, ...rest } = plain;

  return {
    id: _id ? _id.toString() : plain.id,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
    updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
    ...rest,
  };
};

const submitContactController = asyncHandler(async (req, res) => {
  const { body } = req.validated ?? {};

  if (!body) {
    throw createError(400, "Invalid request payload");
  }

  const submission = await createContactSubmission({
    name: body.name,
    email: body.email,
    phone: body.phone,
    company: body.company,
    message: body.message,
  });

  res.status(201).json({
    message: "Message sent successfully",
    submission: mapContactSubmission(submission),
  });
});

const listContactSubmissionsController = asyncHandler(async (_req, res) => {
  const submissions = await listContactSubmissions();
  res.status(200).json(submissions.map(mapContactSubmission));
});

const markAsReadController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const submission = await markAsRead(id);
  if (!submission) {
    throw createError(404, "Submission not found");
  }
  res.status(200).json(mapContactSubmission(submission));
});

const deleteContactSubmissionController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteContactSubmission(id);
  res.status(204).send();
});

export { submitContactController, listContactSubmissionsController, markAsReadController, deleteContactSubmissionController };
