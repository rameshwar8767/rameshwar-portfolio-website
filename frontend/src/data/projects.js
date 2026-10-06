// 1. Import your images first
import hotelImg from "../assets/hotel.png";
import socialImg from "../assets/social.png";
// If you don't have an image for one, you can import a placeholder
// import placeholderImg from "../assets/placeholder.png";

const projects = [
  {
    title: "ShopFusion – E-Commerce with ML Recommendations",
    image: hotelImg, // Use placeholder image or actual image if available
    description: "Built a full-stack MERN application with a Python microservice for ML-based product recommendations. Containerized with Docker and configured a Jenkins CI/CD pipeline for automated build and deployment on AWS EC2.",
    tech: ["MERN", "Python", "Docker", "Jenkins", "AWS EC2", "REST APIs"],
    tags: ["Full-Stack", "Node.js", "React.js", "Cloud"],
    live: "",
    github: "https://github.com/rameshwar8767/ShopFusion",
  },
  {
    title: "Hotel Booking Web Application",
    image: hotelImg,
    description: "A full-stack booking platform following MVC architecture. Designed and implemented 10+ REST APIs covering booking management and JWT-based authentication. Deployed with environment-based configuration.",
    tech: ["React.js", "Node.js", "Express", "MongoDB", "REST APIs"],
    tags: ["React.js", "Node.js", "Full-Stack"],
    live: "https://mern-hotel-booking-website-ijwrgks1s-rameshwar8767s-projects.vercel.app/",
    github: "https://github.com/rameshwar8767/Mern-Hotel-Booking-Website",
  },
  {
    title: "LearnStack – Kubernetes-Deployed Course Catalog",
    image: socialImg,
    description: "Containerized a React.js (Vite) front end with Docker and authored Kubernetes manifests (Deployments, Services, ConfigMaps). Validated on a local kind cluster with service discovery and rolling deployments.",
    tech: ["Kubernetes", "Docker", "React.js", "Vite", "kind"],
    tags: ["DevOps", "Cloud", "Frontend"],
    live: "",
    github: "https://github.com/rameshwar8767/LearnStack",
  },
  {
    title: "Jenkins CI/CD Pipeline on AWS EC2",
    image: socialImg,
    description: "Provisioned an AWS EC2 instance and configured Jenkins and Docker to automate build, test, and deployment workflows triggered by GitHub Webhooks. Deployed a web application via Nginx.",
    tech: ["AWS EC2", "Jenkins", "Docker", "Nginx", "GitHub Webhooks"],
    tags: ["DevOps", "Cloud", "CI/CD"],
    live: "",
    github: "https://github.com/rameshwar8767/Jenkins-Pipeline",
  },
];

export default projects;