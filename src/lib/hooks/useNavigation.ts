export function useNavigation() {



    function setStepOnLocaleStorage()
    {
        const step: number = Number(localStorage.getItem("registrationStep") as string);
        if(!step)
        {
            localStorage.setItem("registrationStep", String(1));
        }
    }

    function navigate (route: string): void
    {
        window.location.href = route;
    }


    return {
        onGoToLogin: () => navigate("/login"),
        onGoToRegister: () => {setStepOnLocaleStorage(); navigate("/register")},
        goToHome: () => navigate("/"),
        onGoToContactUs: () => navigate("/contact-us"),
        onGoToMarketPlace: ()=> navigate("/market-place"),
        onGoToTripDetail: (idVoyage: string) => navigate(`/market-place/trip/${idVoyage}`),
        onGoToDashboard: () => navigate("/dashboard"),
        onGoToProfile: () => navigate("/profile"),
        onGoToTripPlanning: () => navigate("dashboard/trip-planning"),
        onGoTroTripPlanningEditMode: (idVoyage: string) => navigate(`dashboard/trip-planning?edit=${idVoyage}`),
        onGoToAboutUs: () => navigate("/about-us")
    };
}
