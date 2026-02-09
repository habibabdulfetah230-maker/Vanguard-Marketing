import BrandingItem from "./branding.model.js";

const createBrandingItem = async ({ title, description, externalLink, imageUrl }) => {
  const brandingItem = await BrandingItem.create({
    title,
    description,
    externalLink,
    imageUrl,
  });

  return brandingItem;
};

const listBrandingItems = async () => {
  const items = await BrandingItem.find().sort({ createdAt: -1 });
  return items;
};

const updateBrandingItem = async (id, { title, description, externalLink, imageUrl }) => {
  const update = {};
  if (title !== undefined) update.title = title;
  if (description !== undefined) update.description = description;
  if (externalLink !== undefined) update.externalLink = externalLink;
  if (imageUrl !== undefined) update.imageUrl = imageUrl;

  const brandingItem = await BrandingItem.findByIdAndUpdate(id, update, { new: true });
  return brandingItem;
};

const deleteBrandingItem = async (id) => {
  await BrandingItem.findByIdAndDelete(id);
};

export { createBrandingItem, listBrandingItems, updateBrandingItem, deleteBrandingItem };
