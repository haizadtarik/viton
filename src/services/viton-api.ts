
// This is a mock API service to simulate the backend.
// In a real application, this would make a network request to the /viton endpoint.

export const vitonApi = {
  generate: async (model_image_base64: string, garment_image_base64: string): Promise<string[]> => {
    console.log("Mock API called with model and garment images.");

    // Simulate network delay and processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real scenario, you'd get back a new image.
    // Here, we'll return a modified version of the model image for demonstration.
    // For this MVP, we just return the model image to show the flow is working.
    console.log("Mock API processing complete.");
    return [model_image_base64];
  },
};
