import { FaCode, FaServer, FaShoppingCart, FaShieldAlt, FaUserCog, FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion } from "motion/react"
import { useState } from 'react';

const developerInfo = {
    name: "Rudra Pratap Singh",
    role: "Full Stack Developer",
    bio: "Passionate about building modern web applications with clean code and great user experiences.",
    photo: "https://res.cloudinary.com/rudra-backend/image/upload/v1747919751/Rudra.png",
    github: "thakurRUDRA14",
    linkedin: "thakurrudra"
};

const About = () => {
    const [hoveredFeature, setHoveredFeature] = useState(null);

    const websiteFeatures = [
        {
            icon: <FaUserCog size={24} />,
            title: "User Authentication",
            desc: "Secure login/registration with JWT tokens and password hashing",
            color: "primary"
        },
        {
            icon: <FaShoppingCart size={24} />,
            title: "Cart Functionality",
            desc: "Full shopping cart with persistent storage and checkout",
            color: "secondary"
        },
        {
            icon: <FaServer size={24} />,
            title: "Admin Dashboard",
            desc: "Comprehensive admin interface for product/user management",
            color: "primary"
        },
        {
            icon: <FaShieldAlt size={24} />,
            title: "Secure Payments",
            desc: "Payment processing with validation and security measures",
            color: "secondary"
        },
        {
            icon: <FaCode size={24} />,
            title: "Responsive Design",
            desc: "Mobile-first approach for all devices and screen sizes",
            color: "primary"
        },
        {
            icon: <FaServer size={24} />,
            title: "RESTful API",
            desc: "Well-structured backend following REST principles",
            color: "secondary"
        }
    ]

    const techStack = [
        { name: "React", color: "bg-blue-100 text-primary" },
        { name: "Redux Toolkit", color: "bg-purple-100 text-purple-800" },
        { name: "Tailwind CSS", color: "bg-cyan-100 text-cyan-800" },
        { name: "Node.js", color: "bg-green-100 text-green-800" },
        { name: "Express", color: "bg-gray-100 text-gray-800" },
        { name: "MongoDB", color: "bg-emerald-100 text-emerald-800" },
        { name: "JWT", color: "bg-amber-100 text-amber-800" },
        { name: "Vite", color: "bg-yellow-100 text-yellow-800" },
    ]

    return (
        <div className="w-full min-h-screen bg-gray-50">
            {/* Hero Section with Parallax Effect */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative bg-gradient-to-r from-primary to-primary-800 py-32 text-white overflow-hidden"
            >
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.h1
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-6xl font-bold mb-6"
                    >
                        About ShopNest
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-xl max-w-3xl mx-auto"
                    >
                        A full-stack e-commerce showcase built with modern technologies
                    </motion.p>
                </div>
            </motion.div>

            {/* Developer Profile */}
            <div className="container mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
                >
                    <div className="md:flex">
                        <div className="md:w-1/3 bg-gradient-to-b from-primary to-primary-700 p-8 flex items-center justify-center">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative group"
                            >
                                <img
                                    src={developerInfo.photo}
                                    alt={developerInfo.name}
                                    className="w-48 h-48 object-cover rounded-full border-4 border-white shadow-lg"
                                />
                                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300"></div>
                            </motion.div>
                        </div>
                        <div className="md:w-2/3 p-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">{developerInfo.name}</h2>
                            <p className="text-secondary font-medium mb-6">{developerInfo.role}</p>
                            <p className="text-gray-600 mb-6">{developerInfo.bio}</p>

                            <div className="flex space-x-4">
                                <motion.a
                                    href={`https://github.com/${developerInfo.github}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-full transition-colors duration-300"
                                >
                                    <FaGithub size={20} />
                                </motion.a>
                                <motion.a
                                    href={`https://linkedin.com/in/${developerInfo.linkedin}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-full transition-colors duration-300"
                                >
                                    <FaLinkedin size={20} />
                                </motion.a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Features with Cool Hover Effects */}
            <div className="bg-gray-100 py-16">
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold mb-12 text-center text-gray-800"
                    >
                        Key Features
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {websiteFeatures.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                onMouseEnter={() => setHoveredFeature(index)}
                                onMouseLeave={() => setHoveredFeature(null)}
                                className={`bg-white p-6 rounded-lg shadow-md border-l-4 border-${feature.color} transition-all duration-300 ${hoveredFeature === index ? 'transform -translate-y-2 shadow-lg' : ''}`}
                            >
                                <div className={`flex items-center text-${feature.color} mb-4`}>
                                    <motion.div
                                        animate={{
                                            rotate: hoveredFeature === index ? [0, 10, -10, 0] : 0,
                                            scale: hoveredFeature === index ? 1.1 : 1
                                        }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        {feature.icon}
                                    </motion.div>
                                    <h3 className="text-xl font-semibold ml-3">{feature.title}</h3>
                                </div>
                                <p className="text-gray-600">{feature.desc}</p>
                                <div className='flex justify-center'>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: hoveredFeature === index ? '100%' : 0 }}
                                        className={`h-0.5 bg-${feature.color} mt-3 transition-all duration-300`}
                                    ></motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tech Stack with Animated Cards */}
            <div className="container mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Technology Stack</h2>

                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        {techStack.map((tech, index) => (
                            <motion.div
                                key={index}
                                whileHover={{
                                    y: -1,
                                    scale: 1.04,
                                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className={`${tech.color} px-4 py-2 rounded-full font-medium cursor-default`}
                            >
                                {tech.name}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Animated CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-primary to-primary-700 text-white py-16"
            >
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Explore?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Check out the full functionality of this e-commerce showcase.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <motion.a
                            href='https://github.com/thakurRUDRA14/ShopNest'
                            target='_blank'
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 5px 15px rgba(255, 255, 255, 0.3)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-primary font-bold py-3 px-8 rounded-lg text-lg"
                        >
                            View Live Demo
                        </motion.a>
                        <motion.a
                            href='https://github.com/thakurRUDRA14/ShopNest'
                            target='_blank'
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 5px 15px rgba(245, 158, 11, 0.3)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-secondary hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg text-lg"
                        >
                            Source Code
                        </motion.a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default About;