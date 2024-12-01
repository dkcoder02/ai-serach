import SearchModel from '@/model/Serach';
import { HfInference } from "@huggingface/inference";

const inference = new HfInference(process.env.HF_API_KEY);

const documents = [
  // Example documents
  'Machine learning is amazing.',
  'Mistral models are efficient for AI tasks.',
  'MongoDB supports vector search.',
  'my name is krish desai',
  'i am learning ai and machine learning'
];

const createEmbedding = async () => {
  for (const doc of documents) {
    try {
      const response: any = await inference.featureExtraction({
        model: 'sentence-transformers/all-MiniLM-L6-v2', // Use a model designed for feature extraction
        inputs: doc,
      });

      // Ensure the response is an array of numbers
      if (Array.isArray(response) && response.every(Number.isFinite)) {
        const embedding = response;
        await SearchModel.create({ text: doc, embedding });
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error during feature extraction:", error);
    }
  }
};

export default createEmbedding;
