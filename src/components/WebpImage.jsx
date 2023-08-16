import React, {  useState, useEffect } from 'react'

const WebpImage = ({ imageUrl }) => {
    const [webpSrc, setWebpSrc] = useState(null);

    const convertToWebp = async (url) => {
        const image = new Image();
        image.crossOrigin = "anonymous";  // This line is crucial to avoid CORS issues
        image.src = url;

        image.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth;
            canvas.height = this.naturalHeight;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(this, 0, 0);

            canvas.toBlob((blob) => {
                const newUrl = URL.createObjectURL(blob);
                setWebpSrc(newUrl);
            }, 'image/webp');
        };

        image.onerror = function() {
            console.error("Error loading the image");
        };
    }

    useEffect(() => {
        convertToWebp(imageUrl);
    }, [imageUrl]);

    if (!webpSrc) {
        return <p>Loading...</p>;
    }

    return <img src={webpSrc} alt="Converted to WebP" width="100%" />;
}

export default WebpImage;
