import React, { useState } from 'react';
import { v2 as Cloudinary } from 'cloudinary-react';

const UploadImage = () => {
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'YOUR_UPLOAD_PRESET');

        fetch(cloudinaryUrl, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            setImage(data.secure_url); // Set the image URL
            console.log('Uploaded Image URL:', data.secure_url);
        })
        .catch(error => {
            console.error('Error uploading image:', error);
        });
    };

    return (
        <div>
            <input type="file" onChange={handleImageChange} />
            {image && <img src={image} alt="Uploaded" />}
        </div>
    );
};

export default UploadImage;
