import { RealEstateAPIResponse } from '@/app/types/real-estate';

export const processMLSPropertyResults = (propertyResults: any[]) => {
  const mappedProperties = propertyResults
    .filter((data) => {
      return data.listing && data.listing.property.latitude && data.listing.property.longitude;
    })
    .map((property) => {
      let listPrice = 0;
      if (property.public.lastSaleAmount) {
        const cleanedAmount =
          typeof property.public.lastSaleAmount === 'string'
            ? property.public.lastSaleAmount.replace(/[^\d.]/g, '')
            : property.public.lastSaleAmount;
        listPrice = parseFloat(cleanedAmount) || 0;
      } else if (property.public.assessedValue) {
        listPrice = property.public.assessedValue;
      } else if (property.public.estimatedValue) {
        listPrice = property.public.estimatedValue;
      }

      const addressObj = property.public.address || {};

      // Handle different address formats
      let addressLine = 'Address unavailable';
      if (typeof addressObj === 'string') {
        addressLine = addressObj;
      } else if (addressObj.address) {
        addressLine = addressObj.address;
      } else if (property.street) {
        addressLine = property.street;
      }

      return {
        property_id: property.propertyId || property.id || '',
        status: property.listing.leadTypes.mlsStatus || 'Active',
        list_date: property.public.lastSaleDate || undefined,
        last_update_date: property.public.lastUpdateDate || undefined,
        price: {
          list: listPrice,
          estimate: property.public.estimatedValue || property.public.assessedValue || listPrice,
        },
        address: {
          line: addressLine,
          city: addressObj.city || property.city || '',
          state: addressObj.state || property.state || '',
          postal_code: addressObj.zip || addressObj.postal_code || property.zip_code || '',
          latitude: (property.listing.property.latitude || 0).toString(),
          longitude: (property.listing.property.longitude || 0).toString(),
        },
        property: {
          type: property.public.propertyType || property.public.propertyUse || 'Unknown',
          sub_type: '',
          beds: property.listing.property.bedroomsTotal || 0,
          baths: property.listing.property.bathroomsTotal || 0,
          size_sqft: property.public.squareFeet || 0,
          year_built: property.listing.property.yearBuilt || 0,
        },
        photos: [property.listing.media.primaryListingImageUrl],
        description: `${
          property.listing.property.propertyType || property.listing.property.propertyUse || ''
        } in ${addressObj.city || property.city || ''}, ${
          addressObj.state || property.state || ''
        }`,
      } as RealEstateAPIResponse;
    });

  console.log('mappedProperties::::', mappedProperties);
  return mappedProperties;
};

export function formatDateTime(date: Date | string | null): string {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export async function convertToJPEG(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const image = new Image();
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(image, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to convert canvas to blob.'));
              return;
            }
            const convertedFile = new File([blob], `${file.name.replace(/\.[^/.]+$/, '')}.jpeg`, {
              type: 'image/jpeg',
            });
            resolve(convertedFile);
          },
          'image/jpeg',
          1,
        );
      };
      if (typeof event.target?.result === 'string') {
        image.src = event.target.result;
      } else {
        reject(new Error('Failed to read file as Data URL.'));
        return;
      }
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}



export const fetchVstagePremiumData = async (roomInfo: any, roomTYpeID: any) => {
  try {
    const res = await fetch("/api/homeAi/room_ai/getArgsData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomInfo, roomTYpeID }),
    });
    const response = await res.json();
    if (!response.success) throw new Error(response.message);
    return response.data;
  } catch (error) {
   if(error){
     return { sucess: false, error: error };
   }
  }
};
