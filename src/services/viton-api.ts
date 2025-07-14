
// This service connects to the backend virtual try-on API.

// The backend is hosted on a different domain, so we use the full URL.
const API_URL = 'https://haizadtarik--vton-ootd-flux-vtonserver-fastapi-app.modal.run/viton';

// Helper to ensure we get clean base64 data
const getBase64Data = (dataUrl: string) => {
    if (dataUrl.startsWith('data:')) {
        return dataUrl.split(',')[1];
    }
    return dataUrl;
};

export const vitonApi = {
  generate: async (model_image_base64: string, garment_image_base64: string): Promise<string[]> => {
    console.log("Calling real Viton API at:", API_URL);

    const modelBase64 = getBase64Data(model_image_base64);
    const garmentBase64 = getBase64Data(garment_image_base64);

    console.log("Model image base64 length:", modelBase64.length);
    console.log("Garment image base64 length:", garmentBase64.length);
    console.log("Model base64 starts with:", modelBase64.substring(0, 50));
    console.log("Garment base64 starts with:", garmentBase64.substring(0, 50));

    const requestBody = {
        model_image_base64: modelBase64,
        garment_image_base64: garmentBase64,
        prompt: "",
        n_samples: 1,
        n_steps: 20,
        image_scale: 2,
        seed: -1
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: JSON.stringify(requestBody),
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
