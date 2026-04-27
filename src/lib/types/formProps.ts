export interface BusinessActorFormProps extends ContinueProps {
    changeStep: (step: number) => void
}




export interface OrganizationFormProps  extends ContinueProps{
    createAgency: boolean,
    setCreateAgency: (param: boolean) => void,
    changeStep: (step: number) => void
}



export interface TravelAgencyFormProps extends ContinueProps{
    changeStep: (step: number) => void
}



export interface ContinueProps{
    agreeTerms: boolean
    step: number
    goBack: ()=>void
    setAgreeTerms: (param: boolean)=> void,
    createAgency?: boolean
}