import { dbConnect } from '@/app/lib/dbConnect';
import { NextRequest } from 'next/server';
import { HfInference } from "@huggingface/inference";
import SearchModel from '@/model/Serach';
import createEmbedding from '@/helpers/createEmbedding';

export async function POST(request: NextRequest) {
  await dbConnect();
  await createEmbedding();


  console.log("go next")

  try {
    const { query } = await request.json();

    console.log('query', query);


    const inference = new HfInference(process.env.HF_API_KEY);
    const response = await inference.featureExtraction({
      model: 'mistralai/mistral-7b-instruct',
      inputs: query,
    });
    const queryVector = response.data;

    const results = await SearchModel.aggregate([
      {
        $match: {
          queryVector: queryVector,
          path: 'embedding',
          numCandidates: 100,
          limit: 5,
        },
      },
    ]);

    return Response.json(
      {
        success: true,
        data: results,
      },
      { status: 200 }
    );
  } catch (error) {
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
