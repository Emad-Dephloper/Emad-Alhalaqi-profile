export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  tags: string[];
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  content?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  iconName?: string;
}

// Initial Data
const initialProjects: Project[] = [
  {
    id: '1',
    title: 'Enterprise ERP Customization',
    category: 'Odoo',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    tags: ['Odoo 16', 'Python', 'PostgreSQL'],
    description: 'A complete overhaul of the inventory and sales modules for a large distributor, featuring automated reordering and custom reporting.'
  },
  {
    id: '2',
    title: 'AI Data Analytics Dashboard',
    category: 'AI',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    tags: ['React', 'Python', 'FastAPI', 'Pandas'],
    description: 'An interactive dashboard integrating machine learning models to predict sales trends and visualize complex datasets in real-time.'
  }
];

const initialPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Mastering Odoo: Advanced QWeb Reporting',
    category: 'Odoo',
    date: 'Oct 24, 2023',
    readTime: '8 min read',
    excerpt: 'Learn how to construct highly dynamic and visually appealing PDF reports using advanced QWeb templating techniques in Odoo 16.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'
  }
];

const initialServices: Service[] = [
  {
    id: '1',
    title: 'Odoo & ERP Development',
    description: 'Custom Odoo modules, integrations, and performance optimizations. Streamlining complex business operations into elegant digital workflows.',
    features: ['Custom Module Creation', 'QWeb Reports & Views', 'Third-party API Integration', 'Migration & Upgrades']
  }
];

// Helper to get from local storage
function getFromStorage<T>(key: string, initialData: T[]): T[] {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing local storage data for key', key, e);
    }
  }
  return initialData;
}

// Helper to save to local storage
function saveToStorage<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Data Managers
export const StorageManager = {
  getProjects: () => getFromStorage<Project>('emad_projects', initialProjects),
  saveProjects: (projects: Project[]) => saveToStorage('emad_projects', projects),
  
  getPosts: () => getFromStorage<BlogPost>('emad_posts', initialPosts),
  savePosts: (posts: BlogPost[]) => saveToStorage('emad_posts', posts),
  
  getServices: () => getFromStorage<Service>('emad_services', initialServices),
  saveServices: (services: Service[]) => saveToStorage('emad_services', services),
};
