
// This service connects to the backend virtual try-on API.

// The backend is hosted on a different domain, so we use the full URL.
const API_URL = 'https://haizadtarik--vton-ootd-flux-vtonserver-fastapi-app.modal.run/viton';

// Helper to strip the data URL prefix (e.g., "data:image/jpeg;base64,")
// as the API likely expects raw base64 data.
const getBase64Data = (dataUrl: string) => {
    if (dataUrl.includes(',')) {
        return dataUrl.split(',')[1];
    }
    return dataUrl;
};

export const vitonApi = {
  generate: async (model_image_base64: string, garment_image_base64: string): Promise<string[]> => {
    console.log("Calling real Viton API at:", API_URL);

    const formData = new FormData();
    formData.append('model_image_base64', getBase64Data(model_image_base64));
    formData.append('garment_image_base64', getBase64Data(garment_image_base64));

    const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { error: `Request failed with status ${response.status}` };
        }
        console.error("API Error:", errorData);
        throw new Error(errorData.error || errorData.detail?.[0]?.msg || `Request failed with status ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
        console.error("API returned a specific error:", result.error);
        throw new Error(result.error);
    }

    if (!result.images_base64 || result.images_base64.length === 0) {
        console.error("API returned no images in the response.");
        throw new Error("The API did not return any images.");
    }
    
    console.log("Viton API call successful, received images.");

    // The API returns raw base64 strings. We format them as data URLs
    // so they can be rendered in <img> tags.
    return result.images_base64.map((imgBase64: string) => `data:image/jpeg;base64,${imgBase64}`);
  },
};
