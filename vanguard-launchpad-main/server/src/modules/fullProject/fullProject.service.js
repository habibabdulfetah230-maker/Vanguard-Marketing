import FullProject from "./fullProject.model.js";

const createFullProject = async ({ title, description, externalLink, imageUrl }) => {
  const project = await FullProject.create({
    title,
    description,
    externalLink,
    imageUrl,
  });

  return project;
};

const listFullProjects = async () => {
  const items = await FullProject.find().sort({ createdAt: -1 });
  return items;
};

const updateFullProject = async (id, { title, description, externalLink, imageUrl }) => {
  const update = {};
  if (title !== undefined) update.title = title;
  if (description !== undefined) update.description = description;
  if (externalLink !== undefined) update.externalLink = externalLink;
  if (imageUrl !== undefined) update.imageUrl = imageUrl;

  const project = await FullProject.findByIdAndUpdate(id, update, { new: true });
  return project;
};

const deleteFullProject = async (id) => {
  await FullProject.findByIdAndDelete(id);
};

export { createFullProject, listFullProjects, updateFullProject, deleteFullProject };
