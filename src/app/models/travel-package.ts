export interface TravelPackage {
    // packageId: string;
    packageId: number,
    title: string;
    description: string;
    destination: string;
    price: number;
    duration: number;
    itinerary: string;
    features: string;
    tripStartDate: string;
    tripEndDate: string;
    imageUrl: string;
    termsAndConditions: string;
    
country: string; // ✅ Add this
  tripType: string;
location: string;
averageRating?: number;
  }
  