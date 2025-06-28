import { useState, useRef } from 'react';

export const useImageCropper = (onImageChangeCallback) => {
    const [imageToCrop, setImageToCrop] = useState(null);
    const [cropperOpen, setCropperOpen] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageToCrop(reader.result);
                setCropperOpen(true);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const onCropComplete = async (croppedImageBlob) => {
        const previewUrl = URL.createObjectURL(croppedImageBlob);

        if (onImageChangeCallback) {
            onImageChangeCallback(croppedImageBlob, previewUrl);
        }

        setCropperOpen(false);
        setImageToCrop(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const resetAvatar = () => {
        setImageToCrop(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return {
        imageToCrop,
        cropperOpen,
        fileInputRef,
        handleImageChange,
        onCropComplete,
        setCropperOpen,
        resetAvatar
    };
};