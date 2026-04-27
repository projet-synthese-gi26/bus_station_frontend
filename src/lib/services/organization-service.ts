import axios, {AxiosResponse} from "axios";
import {OrganizationFormType} from "@/lib/types/schema/organizationSchema";
import {Organization} from "@/lib/types/models/Organization";



const url: string = `${process.env.NEXT_PUBLIC_TRIP_AGENCY_BACKEND_API_URL}`


export async function createOrganization(data: OrganizationFormType): Promise<Organization|null>
{
    try
    {
        const response: AxiosResponse<Organization> = await axios.post(`${url}/organizations`, data);
        if(response.status === 201)
        {
            console.log(response);
            return response?.data;
        }
        else
        {
            console.warn("Unattended HTTP code", response?.data);
            return null
        }
    }
    catch (error)
    {
        console.error("Error when creating the organization ",error);
        throw error;
    }
}