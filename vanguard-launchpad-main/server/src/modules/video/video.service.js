import VideoProject from "./video.model.js";
import extractYoutubeId from "../../utils/extractYoutubeId.js";
import { createError } from "../../utils/errorResponse.js";

const parseYoutubeIdOrThrow = (youtubeUrl) => {
  const videoId = extractYoutubeId(youtubeUrl);
  if (!videoId) {
    throw createError(400, "Invalid YouTube URL. Unable to extract video ID");
  }
  return videoId;
};

const createVideoProject = async ({ title, description, youtubeUrl, isPublished = false }) => {
  const youtubeVideoId = parseYoutubeIdOrThrow(youtubeUrl);

  const videoProject = await VideoProject.create({
    title,
    description,
    youtubeVideoId,
    isPublished,
  });

  return videoProject;
};

const updateVideoProject = async (id, payload) => {
  const update = { ...payload };

  if (payload.youtubeUrl) {
    update.youtubeVideoId = parseYoutubeIdOrThrow(payload.youtubeUrl);
    delete update.youtubeUrl;
  }

  const updated = await VideoProject.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    throw createError(404, "Video project not found");
  }

  return updated;
};

const deleteVideoProject = async (id) => {
  const deleted = await VideoProject.findByIdAndDelete(id);
  if (!deleted) {
    throw createError(404, "Video project not found");
  }
  return deleted;
};

const clearAllVideoProjects = async () => {
  await VideoProject.deleteMany({});
};

const listVideoProjects = async ({ includeUnpublished = false } = {}) => {
  const filter = includeUnpublished ? {} : { isPublished: true };
  const projects = await VideoProject.find(filter).sort({ createdAt: -1 });
  return projects;
};

const getVideoProjectById = async (id) => {
  const project = await VideoProject.findById(id);
  if (!project) {
    throw createError(404, "Video project not found");
  }
  return project;
};

export {
  createVideoProject,
  updateVideoProject,
  deleteVideoProject,
  clearAllVideoProjects,
  listVideoProjects,
  getVideoProjectById,
};
