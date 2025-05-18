// import { NextRequest, NextResponse } from 'next/server';
// import { getStatusByJobId } from 'constant/ai_sdk';

// // Define interfaces for type safety
// interface ToolRequestBody {
//   tool: string;
//   input_image?: string;
//   mask_image?: string;
//   areaSelection?: string;
//   enhancementOption?: string;
//   imageSource?: string;
//   url?: string;
// }

// interface DeploymentRequestArgs {
//   [key: string]: any;
// }

// interface JobStatus {
//   error?: string;
//   status?: string;
//   files?: string | string[];
// }

// interface DeploymentResponse {
//   error?: string;
//   job_id?: string;
// }

// // Main API handler
// export async function POST(req: NextRequest) {
//   try {
//     const body: ToolRequestBody = await req.json();
//     const { tool } = body;

//     if (!tool) {
//       return NextResponse.json(
//         { success: false, message: 'Argument tool is missing' },
//         { status: 400 }
//       );
//     }

//     let result;
//     switch (tool) {
//       case 'bg-remover':
//         result = await makeDeploymentRequest(
//           'Background Remover',
//           '844218fa-c5d0-4cee-90ce-0b42d226ac8d',
//           { input: body.input_image }
//         );
//         break;
//       case 'object-removal':
//         result = await makeDeploymentRequest(
//           'Pic Eraser',
//           '6bf5c668-4f5b-4987-ac25-20f79a9d8cee',
//           {
//             Input_image: body.input_image,
//             Selected_area: body.mask_image,
//           }
//         );
//         break;
//       case 'image-booster':
//         result = await makeDeploymentRequest(
//           'Image Booster',
//           'bb3a9fc2-235e-432e-a78a-93508489dfd0',
//           {
//             creativity: 0.35,
//             downscaling: 'false',
//             downscaling_resolution: '768',
//             dynamic: '6',
//             image: body.input_image,
//             negative_prompt:
//               '(worst quality, low quality, normal quality:2) JuggernautNegative-neg',
//             num_inference_steps: 18,
//             prompt:
//               'masterpiece, best quality, highres, <lora:more_details:0.5> <lora:SDXLrender_v2.0:1>',
//             resemblance: 0.6,
//             scale_factor: '2',
//             scheduler: 'DPM++ 3M SDE Karras',
//             sd_model: 'juggernaut_reborn.safetensors [338b85bc4f]',
//             seed: '1337',
//             sharpen: '0',
//             tiling_height: '112',
//             tiling_width: '112',
//           }
//         );
//         break;
//       case 'image-enhancement':
//         result = await makeDeploymentRequest(
//           'RE Photo Improver',
//           '2ac61065-be5a-4955-a931-5d884c472119',
//           {
//             'Area Selection': body.areaSelection,
//             'Enhancement Options': body.enhancementOption,
//             'Image Source': body.input_image,
//           }
//         );
//         break;
//       case 'furniture-remover':
//         result = await makeDeploymentRequest(
//           'Furniture Remover',
//           '49ef5c08-c58a-4f8f-8ca1-10128b3d8334',
//           {
//             'Image Source': body.imageSource,
//           }
//         );
//         break;
//       case 'zillow-helper':
//         result = await makeDeploymentRequest(
//           'Zillow Helper',
//           '0f894b31-f515-4b43-b275-739ef20b7b76',
//           {
//             url: body.url,
//           },
//           true
//         );
//         break;
//       default:
//         return NextResponse.json(
//           { success: false, message: 'Tool not initialized' },
//           { status: 400 }
//         );
//     }

//     return NextResponse.json(result);
//   } catch (error: any) {
//     console.error('Error in handler:', error);
//     return NextResponse.json(
//       { error: true, message: error.message },
//       { status: 500 }
//     );
//   }
// }

// // Deployment request function
// const makeDeploymentRequest = async (
//   name: string,
//   model_id: string,
//   args: DeploymentRequestArgs,
//   multiResult: boolean = false
// ) => {
//   try {
//     const deployment = await fetch('https://api-qa.mediamagic.ai/api/v1/deployments', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-mediamagic-key': process.env.X_MEDIAMAGIC_KEY || '',
//       },
//       body: JSON.stringify({
//         name,
//         model_id,
//         args,
//       }),
//     });

//     const response: DeploymentResponse = await deployment.json();

//     if (response.error) {
//       throw new Error(response.error);
//     }

//     const statusResponse = await checkJobStatus(response.job_id!, multiResult);
//     return statusResponse;
//   } catch (error: any) {
//     console.error('Error in deployment or checking status:', error);
//     return { error: true, message: error.message };
//   }
// };

// // Job status checking function
// const checkJobStatus = async (jobId: string, multiResult: boolean = false): Promise<any> => {
//   try {
//     const status: JobStatus = await getStatusByJobId(jobId);
//     console.log('job-status', status);

//     if (status.error) {
//       return { success: false, message: status.error };
//     }

//     if (status.status === 'complete') {
//       return {
//         success: true,
//         file: multiResult ? status.files : status.files ? status.files[0] : null,
//       };
//     } else if (status.status === 'failed') {
//       return { success: false, message: 'Job failed' };
//     } else {
//       return new Promise((resolve, reject) => {
//         setTimeout(async () => {
//           try {
//             const statusResponse = await checkJobStatus(jobId, multiResult);
//             resolve(statusResponse);
//           } catch (error: any) {
//             reject({ success: false, message: error.message });
//           }
//         }, 3000);
//       });
//     }
//   } catch (error: any) {
//     console.error('Error checking job status:', error);
//     return { success: false, message: 'Error checking job status' };
//   }
// };