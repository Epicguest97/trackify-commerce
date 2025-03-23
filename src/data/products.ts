
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
  stock: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Minimal Desk Lamp",
    description: "A beautifully crafted desk lamp with a minimalist design. Perfect for your workspace or bedside table.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Lighting",
    featured: true,
    stock: 15
  },
  {
    id: "2",
    name: "Ergonomic Chair",
    description: "Premium ergonomic chair designed for comfort during long working hours. Adjustable height and lumbar support.",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Furniture",
    featured: true,
    stock: 8
  },
  {
    id: "3",
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones with exceptional sound quality and 30-hour battery life.",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    featured: true,
    stock: 12
  },
  {
    id: "4",
    name: "Smart Watch",
    description: "Advanced smartwatch with health tracking, notifications, and a sleek design. Water-resistant and long battery life.",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    stock: 20
  },
  {
    id: "5",
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with rich sound and 24-hour battery life. Perfect for home or outdoor use.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    stock: 18
  },
  {
    id: "6",
    name: "Ceramic Coffee Mug",
    description: "Handcrafted ceramic coffee mug with a modern design. Durable and perfect for your morning coffee.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Kitchenware",
    stock: 30
  },
  {
    id: "7",
    name: "Leather Wallet",
    description: "Premium leather wallet with multiple card slots and a sleek design. Perfect for everyday use.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    stock: 25
  },
  {
    id: "8",
    name: "Minimalist Backpack",
    description: "Stylish and functional backpack with multiple compartments. Perfect for work, travel, or everyday use.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1622560480605-d83c361de739?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    stock: 14
  }
];
