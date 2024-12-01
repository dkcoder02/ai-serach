import SearchModel from '@/model/Serach';
import { HfInference } from "@huggingface/inference";

const inference = new HfInference(process.env.HF_API_KEY);

const documents = [
  // Example documents
  'Machine learning is amazing.',
  'Mistral models are efficient for AI tasks.',
  'MongoDB supports vector search.',
];

const createEmbedding = async () => {
  console.log("createEmbedding")
  for (const doc of documents) {
    const response: any = await inference.featureExtraction({
      model: 'mistralai/mistral-7b-instruct',
      inputs: doc,
    });
    const embedding = response.data;
    console.log("embedding", embedding)
    await SearchModel.create({ text: doc, embedding });
  }
};

export default createEmbedding;