import DesignItem from "./design.model.js";

const createDesignItem = async ({ title, description, externalLink, imageUrl }) => {
  const item = await DesignItem.create({
    title,
    description,
    externalLink,
    imageUrl,
  });

  return item;
};

const listDesignItems = async () => {
  const items = await DesignItem.find().sort({ createdAt: -1 });
  return items;
};

const updateDesignItem = async (id, { title, description, externalLink, imageUrl }) => {
  const update = {};
  if (title !== undefined) update.title = title;
  if (description !== undefined) update.description = description;
  if (externalLink !== undefined) update.externalLink = externalLink;
  if (imageUrl !== undefined) update.imageUrl = imageUrl;

  const item = await DesignItem.findByIdAndUpdate(id, update, { new: true });
  return item;
};

const deleteDesignItem = async (id) => {
  await DesignItem.findByIdAndDelete(id);
};

export { createDesignItem, listDesignItems, updateDesignItem, deleteDesignItem };
