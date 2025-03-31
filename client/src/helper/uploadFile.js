const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

// console.log("Cloudinary Upload URL:", url); // Debugging

const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append("upload_preset", "chat-app-file");

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

export default uploadFile;
