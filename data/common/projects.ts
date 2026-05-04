export interface Project {
    title: string;
    subtitle: string;
    description: string;
    links?: { label: string; href: string }[];
    tech: string[];
}

export const projects: Project[] = [
    {
        title: "CrushView",
        subtitle: "A Dating App",
        description: "Developed CrushView, a full-stack dating platform with a React Native mobile app and microservices-based backend (Node.js, Go). Implemented real-time chat via WebSockets, enabling low-latency communication between users with a dedicated chat service. Designed an event-driven backend using Redis for caching/session management and RabbitMQ for asynchronous message processing and FCM for push notifications.",
        links: [{ label: "Play Store", href: "https://play.google.com/store/apps/details?id=com.crushview.mobileapp" }],
        tech: ["TypeScript", "React Native", "NodeJS", "MongoDB", "ExpressJS", "Redis", "RabbitMQ", "FCM"]
    },
    {
        title: "XCar",
        subtitle: "An Old Car Marketplace",
        description: "Developed a full-stack car marketplace platform with separate User and Admin panels using React.js, TypeScript, and Redux for scalable state management. Implemented features such as car listing with pagination, search/filtering, and seller contact unlocking with secure payment verification flow. Built reusable UI components and optimized client-side performance with React Hooks, modular architecture, and API-driven data fetching.",
        tech: ["TypeScript", "Next.js", "NestJS", "PostgreSQL", "PrismaORM"]
    },
    {
        title: "Tailgait",
        subtitle: "A Mobile App for NFL Fans",
        description: "Developed a production-ready mobile application for organizing and managing game events for NFL fans of the Buffalo Bills Football team. Worked as a React Native Developer, building the app using TypeScript with a focus on clean UI, performance, and scalability. Implemented reusable components, navigation flows, API integrations, and state management. Collaborated closely with backend and product teams to deliver new features and improve user experience.",
        links: [{ label: "Play Store", href: "https://play.google.com/store/apps/details?id=com.fandemonium" }],
        tech: ["TypeScript", "React Native", "Firebase - Firestore, Storage & Authentication"]
    },
    {
        title: "NoteStack",
        subtitle: "A Platform for Notes, PYQs and Articles",
        description:
            "NoteStack is a full-stack web app built using MERN ((MongoDB, Express, React, Node.js)). It allows users to download pdf notes, PYQs and learn articles. An admin panel is there to upload notes and write articles. A user has to register/login to explore more.",
        links: [{ label: "Demo", href: "https://notestack-app.vercel.app/" }, { label: "Source", href: "https://github.com/kamal-singh819/notestack-new" }],
        tech: ["ReactJS", "NodeJS", "MongoDB", "ExpressJS", "Tailwind"]
    },
    {
        title: "AgriJanch",
        subtitle: "Python & Deep Learning",
        description:
            "This is a deep learning model developed using Convolutional Neural Network and Python to test potato plants using their leaves whether the plant is healthy or not. If not then whether it is late blight or early blight.",
        links: [{ label: "Source", href: "https://github.com/kamal-singh819/Patato-Disease-Detection-Using-CNN" }],
        tech: ["Python", "Pandas", "Convolutional Neural Network"]
    },
    {
        title: "Medigen : A Pharmacy App",
        subtitle: "A Pharmacy App for Medicine Delivery",
        description:
            "Medigen is a full-stack web application built using the MERN stack (MongoDB, Express, React, Node.js) with TypeScript. It has three panels- Customer, Pharmacist and Admin. Customers can place orders then Pharmacists present in 10Km radius of the customer can bid to the order. Customer will accept one of them bids and confirm the order. Admin manages customers, medicines and Pharmacies.",
        tech: ["TypeScript", "ReactJS", "NodeJS", "MongoDB", "ExpressJS", "Tailwind CSS"]
    },
];
