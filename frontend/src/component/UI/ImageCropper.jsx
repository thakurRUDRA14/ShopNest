import { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { motion, AnimatePresence } from 'motion/react';
import getCroppedImg from '../../utils/cropImage';

const ImageCropper = ({ open, onClose, image, onCropComplete, aspect = 1 }) => {
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const imgRef = useRef(null);

    const handleSave = async () => {
        if (completedCrop && imgRef.current) {
            const croppedImage = await getCroppedImg(imgRef.current, completedCrop);
            onCropComplete(croppedImage);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={onClose}
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col z-10 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="border-b border-gray-200 p-4">
                            <h2 className="text-xl font-semibold text-gray-800">Crop your image</h2>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-auto p-4">
                            <div className="flex justify-center">
                                {image && (
                                    <ReactCrop
                                        crop={crop}
                                        onChange={(c) => setCrop(c)}
                                        onComplete={(crop) => setCompletedCrop(crop)}
                                        aspect={aspect}
                                        className="max-w-full"
                                    >
                                        <img
                                            ref={imgRef}
                                            src={image}
                                            alt="Crop me"
                                            className="max-w-full max-h-[70vh]"
                                        />
                                    </ReactCrop>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 p-4 flex justify-end space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </motion.div>
                </div >
            )}
        </AnimatePresence >
    );
};

export default ImageCropper;