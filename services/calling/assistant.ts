import { VAPI_API_URL, VAPI_API_KEY, INSIGHTO_API_URL, INSIGHTO_API_KEY } from '@/lib/utils'

// Define the Assistant interface
export interface Assistant {
  id: number;
  name: string;
  prompt: string;
  voice: string;
}


const headers: any = {
  headers: {
    'Content-Type': 'application/json',
  }
}


// Generic helper to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json() as Promise<T>;
}

// Fetch the list of assistants
export async function getAssistants(): Promise<Assistant[]> {
  const userId = localStorage.getItem('userId')
  const aiType = localStorage.getItem('aiType')

  if (aiType === 'vapi') {
    headers.headers['Authorization'] = `Bearer ${VAPI_API_KEY}`
  }
  const url = aiType === 'vapi' ? `${VAPI_API_URL}/assistant` : `${INSIGHTO_API_URL}/assistant/list?api_key=${INSIGHTO_API_KEY}`
  const res = await fetch(url, headers);
  // Assuming the API returns an array of assistants or an object like { assistants: [...] }
  const data = await handleResponse<any>(res);
  return aiType === 'vapi' ? data.filter((item: any) => item.metadata?.user_id === userId) : data.data?.items.filter((item: any) => item.attributes?.user_id === userId);
}

// Create a new assistant. Note: We pass an object without the id.
export async function createAssistant(
  assistant: any
): Promise<Assistant> {
  const userId = localStorage.getItem('userId')
  const aiType = localStorage.getItem('aiType')

  if (aiType === 'vapi') {
    headers.headers['Authorization'] = `Bearer ${VAPI_API_KEY}`
    assistant.metadata = {}
    assistant.metadata.user_id = userId
  } else {
    assistant.attributes.user_id = userId
  }
  const url = aiType === 'vapi' ? `${VAPI_API_URL}/assistant` : `${INSIGHTO_API_URL}/assistant?api_key=${INSIGHTO_API_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: headers.headers,
    body: JSON.stringify(assistant),
  });
  return handleResponse<Assistant>(res);
}

// Update an existing assistant
export async function updateAssistant(
  id: number,
  assistant: any
): Promise<Assistant> {
  const aiType = localStorage.getItem('aiType')

  const url = aiType === 'vapi' ? `${VAPI_API_URL}/assistant/${id}` : `${INSIGHTO_API_URL}/assistant/${id}?api_key=${INSIGHTO_API_KEY}`
  if (aiType === 'vapi') {
  headers.headers['Authorization'] = `Bearer ${VAPI_API_KEY}`

    delete assistant.id
    delete assistant.createdAt
    delete assistant.updatedAt
    delete assistant.isServerUrlSecretSet
    delete assistant.orgId
  }
  const res = await fetch(url, {
    method: aiType === 'vapi' ? 'PATCH' : 'PUT',
    headers: headers.headers,
    body: JSON.stringify(assistant),
  });
  return handleResponse<Assistant>(res);
}

// Delete an assistant by id
export async function deleteAssistant(
  id: string
): Promise<{ message: string }> {
  const aiType = localStorage.getItem('aiType')

if (aiType === 'vapi') {
  headers.headers['Authorization'] = `Bearer ${VAPI_API_KEY}`
}
  const url = aiType === 'vapi' ? `${VAPI_API_URL}/assistant/${id}` : `${INSIGHTO_API_URL}/assistant/${id}?api_key=${INSIGHTO_API_KEY}`
  const res = await fetch(url, {
    method: 'DELETE',
    headers: headers.headers,
  });
  return handleResponse<{ message: string }>(res);
}

// 
export async function fetchLinkedDataSources(id: string) {
  const res = await fetch(`${INSIGHTO_API_URL}/assistant/${id}/list_data_sources?api_key=${INSIGHTO_API_KEY}`);
  // Assuming the API returns an array of assistants or an object like { assistants: [...] }
  const data = await handleResponse<any>(res);
  return data.data?.items;
}

export async function assignDataSourcesToAssistant(id: string, datasourceId: string) {
  const res = await fetch(`${INSIGHTO_API_URL}/assistant/${id}/add_datasource/${datasourceId}?api_key=${INSIGHTO_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse<Assistant>(res);
}