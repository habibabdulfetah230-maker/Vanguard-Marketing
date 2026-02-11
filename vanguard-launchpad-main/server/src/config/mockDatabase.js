// Mock database for development without MongoDB
const mockData = {
  admins: [
    {
      _id: '1',
      email: 'admin@vanguard.com',
      name: 'Super Admin',
      role: 'superadmin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  videos: [],
  branding: [],
  testimonials: [],
  stats: {
    clients_scaled: '150+',
    client_retention: '98%',
    leads_generated: '5M+'
  }
};

export default mockData;
