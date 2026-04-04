export const CATEGORIES = ["All", "Cleaning", "Repair", "Electrician", "Plumbing"];

export const MOCK_PROVIDERS = [
  {
    id: "1",
    name: "John's Quick Repairs",
    category: "Repair",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$25/hr",
  },
  {
    id: "2",
    name: "Sparky Electric",
    category: "Electrician",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$40/hr",
  },
  {
    id: "3",
    name: "Clean & Shine",
    category: "Cleaning",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$20/hr",
  },
  {
    id: "4",
    name: "Pipes & Flow",
    category: "Plumbing",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=761&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$35/hr",
  },
  {
    id: "5",
    name: "Elite Maid Service",
    category: "Cleaning",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "$30/hr",
  },
];

export const MOCK_APPOINTMENTS = [
  {
    id: "ap-1",
    providerName: "John's Quick Repairs",
    category: "Repair",
    date: "April 12, 2026",
    time: "10:30 AM",
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "ap-2",
    providerName: "Elite Maid Service",
    category: "Cleaning",
    date: "April 15, 2026",
    time: "02:00 PM",
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
