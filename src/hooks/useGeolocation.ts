import { getGeoLocation } from "@/app/schemaActions";
export const useGeoLocation = async (formId: string) => {
  await getGeoLocation(formId);
};
