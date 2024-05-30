import { getServerURL } from "../../../helper/envConfig";

class CustomUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file.then(file => new Promise((resolve, reject) => {
            // Allowed image types
           // Extend allowed types to include videos
           const allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', // Images
            'video/mp4', 'video/quicktime', 'video/webm' // Videos
        ];
            // Check if the file type is allowed
            if (!allowedTypes.includes(file.type)) {
                // Reject the promise if the file type is not allowed
                alert(`Unsupported image type: ${file.type}`)
                return reject(`Unsupported image type: ${file.type}`);
            }

            const formData = new FormData();
            formData.append('chapter_images', file);

            // Use getServerURL function to dynamically set the URL
            const uploadURL = `${getServerURL()}upload-image`;

            fetch(uploadURL, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("admintoken")}`,
                }
            })
                .then(response => response.json())
                .then(result => {
                    resolve({
                        default: result.url // Assuming the server responds with the URL of the uploaded image
                    });
                })
                .catch(reject);
        }));
    }

    abort() {
        // Implementation for abort if necessary
    }
}

export default CustomUploadAdapter;
