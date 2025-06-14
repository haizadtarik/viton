
// This is a mock API service to simulate the backend.
// In a real application, this would make a network request to the /viton endpoint.

export const vitonApi = {
  generate: async (model_image_base64: string, garment_image_base64: string): Promise<string[]> => {
    console.log("Mock API called with model and garment images.");

    // Simulate network delay and processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real scenario, you'd get back a new image.
    // Here, we'll return the garment image instead of the model image
    // to make it clearer that the mock process completed.
    console.log("Mock API processing complete.");
    return [garment_image_base64];
  },
};
