import { dbConnect } from '@/app/lib/dbConnect';
import { NextRequest } from 'next/server';
import { HfInference } from "@huggingface/inference";
import SearchModel from '@/model/Serach';
import createEmbedding from '@/helpers/createEmbedding';

export async function POST(request: NextRequest) {
  await dbConnect();
  await createEmbedding();

  try {
    const { query } = await request.json();

    const inference = new HfInference(process.env.HF_API_KEY);
    const response: any = await inference.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: query,
    });

    const queryVector = response;

    const results = await SearchModel.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          queryVector: queryVector,
          numCandidates: 150,
          path: "embedding",
          limit: 10
        }
      },
      {
        $project: {
          _id: 1,
          text: 1,
        }
      }
    ]);

    return Response.json(
      {
        success: true,
        data: results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error", error)
    return Response.json(
      {
        success: false,
        message: 'Error seraching text',
      },
      {
        status: 500,
      }
    );
  }
}
