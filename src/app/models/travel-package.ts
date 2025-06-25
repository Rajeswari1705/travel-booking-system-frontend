export interface TravelPackage {
    packageId: string;
    title: string;
    description: string;
    destination: string;
    price: number;
    duration: number;
    itinerary: string;
    features: string;
    startDate: string;
    endDate: string;
    imageUrl: string;
    termsAndConditions: string;
    
country: string; // ✅ Add this
  tripType: string;
location: string;
  }
  