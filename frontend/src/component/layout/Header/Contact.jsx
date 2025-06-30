import { FaPaperPlane, FaMapMarkerAlt, FaPhone, FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';
import { motion } from 'motion/react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import MetaData from '../MetaData';

const developerInfo = {
    name: "Rudra Pratap Singh",
    role: "Full Stack Developer",
    email: "engrudra14@gmail.com",
    phoneNo: "+91 1234567890",
    location: "Ghaziabad, India",
    github: "thakurRUDRA14",
    linkedin: "thakurrudra",
    locationURL: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.223234168045!2d77.4971332!3d28.7526004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf47204fb9241%3A0xd11ed4123c7691fe!2sKIET%20GROUP%20OF%20INSTITUTIONS!5e0!3m2!1sen!2sin!4v1716361234567!5m2!1sen!2sin"
};

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // TODO: not working
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axios.post("http://localhost:4000/api/v1/user/contact",
                formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(response.message || 'Something went wrong');
            }
            setFormData({ name: '', email: '', message: '' });
            toast.success(response.message);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <MetaData title="Contact Us -- ShopNest" />
            <div className="w-full bg-gray-50">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative bg-gradient-to-r from-primary to-primary-800 py-28 text-white overflow-hidden"
                >
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <motion.h1
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            Contact Us
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-xl max-w-3xl mx-auto"
                        >
                            Have questions or want to discuss a project? We'd love to hear from you!
                        </motion.p>
                    </div>
                </motion.div>

                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2"
                        >
                            <div className="bg-white h-full rounded-xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-8">
                                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div className="mb-8">
                                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Your Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div className="mb-8">
                                        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows="9"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        ></textarea>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-primary hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
                                    >
                                        {isSubmitting ? (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <FaPaperPlane className="mr-2" />
                                        )}
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2"
                        >
                            <div className="bg-white rounded-xl shadow-lg p-8 h-full">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Get In Touch</h2>

                                <div className="space-y-6">
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-start"
                                    >
                                        <div className="bg-primary-100 p-3 rounded-full mr-4">
                                            <FaMapMarkerAlt className="text-primary text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Location</h3>
                                            <a href="https://www.google.com/maps/place/KIET+GROUP+OF+INSTITUTIONS,+Muradnagar,+Uttar+Pradesh+201206/@28.7526004,77.4971332,18z/data=!3m1!4b1!4m6!3m5!1s0x390cf47204fb9241:0xd11ed4123c7691fe!8m2!3d28.7522471!4d77.4987903!16s%2Fg%2F11b8txj61f?entry=ttu&g_ep=EgoyMDI1MDUxNS4xIKXMDSoASAFQAw%3D%3D"
                                                target='_blank'
                                                className="text-gray-600 hover:text-primary transition-colors"
                                            >
                                                {developerInfo.location}
                                            </a>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-start"
                                    >
                                        <div className="bg-primary-100 p-3 rounded-full mr-4">
                                            <FaEnvelope className="text-primary text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Email</h3>
                                            <a href={`mailto:${developerInfo.email}`} className="text-gray-600 hover:text-primary transition-colors">
                                                {developerInfo.email}
                                            </a>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-start"
                                    >
                                        <div className="bg-primary-100 p-3 rounded-full mr-4">
                                            <FaPhone className="text-primary text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Phone</h3>
                                            <a href={`tel:${developerInfo.phoneNo}`} className="text-gray-600 hover:text-primary transition-colors">
                                                {developerInfo.phoneNo}
                                            </a>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect With Me</h3>
                                    <div className="flex space-x-4">
                                        <motion.a
                                            href={`https://github.com/${developerInfo.github}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ y: -2, scale: 1.1 }}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-full transition-colors duration-300"
                                        >
                                            <FaGithub size={20} />
                                        </motion.a>
                                        <motion.a
                                            href={`https://linkedin.com/in/${developerInfo.linkedin}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ y: -2, scale: 1.1 }}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-full transition-colors duration-300"
                                        >
                                            <FaLinkedin size={20} />
                                        </motion.a>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Availability for Internship & Remote Jobs</h3>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex justify-between">
                                            <span>Monday - Friday</span>
                                            <span>Flexible hours</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Saturday</span>
                                            <span>Available</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Sunday</span>
                                            <span>Available</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Immediate</span>
                                            <span className="text-primary font-medium">Available to start</span>
                                        </li>
                                    </ul>
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <p className="text-blue-800">
                                            Currently seeking internship opportunities. Flexible with timing to accommodate project requirements.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="container mx-auto px-4 pb-16"
                >
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <iframe
                            src={developerInfo.locationURL}
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="rounded-xl"
                            title="Location Map"
                        ></iframe>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default ContactUs;