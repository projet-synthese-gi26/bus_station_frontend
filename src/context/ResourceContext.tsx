"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export type DriverStatus = 'Available' | 'On Trip' | 'On Leave' | 'Maintenance';
export type VehicleStatus = 'Available' | 'On Trip' | 'Maintenance' | 'Out of Service';
export type TripStatus = 'Draft' | 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  photo?: string;
  age: number;
  dateOfBirth: string;
  licenseType: string;
  licenseExpiry: string;
  experienceYears: number;
  hireDate: string;
  email: string;
  phone: string;
  languages: string[];
  certifications: string[];
  rating: number;
  status: DriverStatus;
  totalTrips: number;
  currentLocation: string;
  assignedTrips?: string[];
}

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  licensePlate: string;
  year: number;
  capacity: number;
  mileage: number;
  fuelType: string;
  fuelConsumption: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  amenities: string[];
  status: VehicleStatus;
  location: string;
  image?: string;
  documents: string[];
  assignedDriver?: string;
  assignedTrips?: string[];
}

export interface Trip {
  id: string;
  name: string;
  description?: string;
  departureLocation: string;
  destination: string;
  intermediateStops?: string[];
  departureDate: string;
  departureTime: string;
  returnDate: string;
  returnTime?: string;
  estimatedDistance?: string;
  passengerCount: number;
  vehicleType?: string;
  services?: string[];
  status: TripStatus;
  vehicle: string | null;
  driver: string | null;
  createdAt: string;
}

export interface Traveler {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  job: string;
  packages: string[];
  memberCategory: string;
}

interface ResourceContextType {
  drivers: Driver[];
  vehicles: Vehicle[];
  trips: Trip[];
  travelers: Traveler[];
  
  // Driver CRUD
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  updateDriver: (id: string, driver: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
  
  // Vehicle CRUD
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  
  // Trip CRUD
  addTrip: (trip: Omit<Trip, 'id' | 'createdAt'>) => void;
  updateTrip: (id: string, trip: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  
  // Traveler CRUD
  addTraveler: (traveler: Omit<Traveler, 'id'>) => void;
  updateTraveler: (id: number, traveler: Partial<Traveler>) => void;
  deleteTraveler: (id: number) => void;
  
  // Assignment methods
  assignDriverToTrip: (driverId: string, tripId: string) => void;
  assignVehicleToTrip: (vehicleId: string, tripId: string) => void;
  unassignDriverFromTrip: (tripId: string) => void;
  unassignVehicleFromTrip: (tripId: string) => void;
  
  // Helper methods
  getAvailableDrivers: () => Driver[];
  getAvailableVehicles: (minCapacity?: number) => Vehicle[];
  getUnassignedTrips: () => Trip[];
  getTripsByDriver: (driverId: string) => Trip[];
  getTripsByVehicle: (vehicleId: string) => Trip[];
}

// Create context with default values
const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

// Mock initial data
const initialDrivers: Driver[] = [
  {
    id: 'DRV-001',
    firstName: 'Liam',
    lastName: 'Parker',
    photo: '/path/to/driver1.jpg',
    age: 32,
    dateOfBirth: '1991-06-15',
    licenseType: 'D',
    licenseExpiry: '2026-03-20',
    experienceYears: 10,
    hireDate: '2015-01-10',
    email: 'liam.parker@example.com',
    phone: '+1 (555) 111-2222',
    languages: ['English', 'Italian', 'French'],
    certifications: ['First Aid', 'Mountain Driving', 'Customer Service'],
    rating: 4.9,
    status: 'Available',
    totalTrips: 156,
    currentLocation: 'Garage HQ'
  },
  {
    id: 'DRV-002',
    firstName: 'Emma',
    lastName: 'Johnson',
    photo: '/path/to/driver2.jpg',
    age: 29,
    dateOfBirth: '1994-02-28',
    licenseType: 'B',
    licenseExpiry: '2025-07-15',
    experienceYears: 6,
    hireDate: '2018-03-22',
    email: 'emma.johnson@example.com',
    phone: '+1 (555) 222-3333',
    languages: ['English', 'Spanish'],
    certifications: ['Defensive Driving'],
    rating: 4.7,
    status: 'On Trip',
    totalTrips: 87,
    currentLocation: 'Route to Venice',
    assignedTrips: ['TRP-001']
  },
  {
    id: 'DRV-003',
    firstName: 'Noah',
    lastName: 'Brown',
    photo: '/path/to/driver3.jpg',
    age: 35,
    dateOfBirth: '1988-11-03',
    licenseType: 'D',
    licenseExpiry: '2026-12-10',
    experienceYears: 12,
    hireDate: '2013-06-15',
    email: 'noah.brown@example.com',
    phone: '+1 (555) 333-4444',
    languages: ['English', 'German'],
    certifications: ['Mountain Driving', 'Off-road Specialist'],
    rating: 4.8,
    status: 'Available',
    totalTrips: 203,
    currentLocation: 'Garage HQ'
  }
];

const initialVehicles: Vehicle[] = [
  {
    id: 'VEH-001',
    name: 'Luxury Bus VIP',
    type: 'Bus',
    brand: 'Mercedes-Benz',
    model: 'Travego',
    licensePlate: 'AB 123 CD',
    year: 2021,
    capacity: 50,
    mileage: 25000,
    fuelType: 'Diesel',
    fuelConsumption: '28 L/100km',
    lastMaintenanceDate: '2025-02-15',
    nextMaintenanceDate: '2025-05-15',
    amenities: ['Air Conditioning', 'WiFi', 'Restroom', 'Entertainment System', 'Reclining Seats'],
    status: 'Available',
    location: 'Main Depot',
    documents: ['Insurance', 'Technical Inspection']
  },
  {
    id: 'VEH-002',
    name: 'Executive Minibus',
    type: 'Minibus',
    brand: 'Toyota',
    model: 'Coaster',
    licensePlate: 'EF 456 GH',
    year: 2022,
    capacity: 23,
    mileage: 18000,
    fuelType: 'Diesel',
    fuelConsumption: '22 L/100km',
    lastMaintenanceDate: '2025-03-10',
    nextMaintenanceDate: '2025-06-10',
    amenities: ['Air Conditioning', 'WiFi', 'Reclining Seats'],
    status: 'On Trip',
    location: 'Route to Paris',
    documents: ['Insurance', 'Technical Inspection'],
    assignedDriver: 'DRV-002',
    assignedTrips: ['TRP-001']
  },
  {
    id: 'VEH-003',
    name: 'Safari Adventure Bus',
    type: 'Bus',
    brand: 'MAN',
    model: 'Lion\'s Coach',
    licensePlate: 'IJ 789 KL',
    year: 2020,
    capacity: 45,
    mileage: 35000,
    fuelType: 'Diesel',
    fuelConsumption: '30 L/100km',
    lastMaintenanceDate: '2025-01-20',
    nextMaintenanceDate: '2025-04-20',
    amenities: ['Air Conditioning', 'WiFi', 'Restroom', 'Off-road Capability'],
    status: 'Available',
    location: 'Main Depot',
    documents: ['Insurance', 'Technical Inspection', 'Special Permit']
  }
];

const initialTrips: Trip[] = [
  {
    id: 'TRP-001',
    name: 'Paris City Tour',
    description: 'A comprehensive tour of Paris landmarks',
    departureLocation: 'Charles de Gaulle Airport',
    destination: 'Eiffel Tower',
    departureDate: '2025-06-15',
    departureTime: '09:00',
    returnDate: '2025-06-15',
    returnTime: '18:00',
    estimatedDistance: '120',
    passengerCount: 20,
    vehicleType: 'Minibus',
    services: ['Guide', 'WiFi'],
    status: 'Confirmed',
    vehicle: 'VEH-002',
    driver: 'DRV-002',
    createdAt: '2025-04-10'
  },
  {
    id: 'TRP-002',
    name: 'Rome Historical Tour',
    departureLocation: 'Rome Fiumicino Airport',
    destination: 'Colosseum',
    departureDate: '2025-06-20',
    departureTime: '10:00',
    returnDate: '2025-06-20',
    estimatedDistance: '30',
    passengerCount: 42,
    status: 'Pending',
    vehicle: null,
    driver: null,
    createdAt: '2025-04-12'
  },
  {
    id: 'TRP-003',
    name: 'Tokyo Cultural Excursion',
    departureLocation: 'Narita International Airport',
    destination: 'Sensō-ji Temple',
    departureDate: '2025-07-05',
    departureTime: '08:30',
    returnDate: '2025-07-05',
    estimatedDistance: '40',
    passengerCount: 28,
    status: 'Draft',
    vehicle: null,
    driver: null,
    createdAt: '2025-04-15'
  }
];

const initialTravelers: Traveler[] = [
  {
    id: 1,
    name: 'Camelia Swan',
    email: 'camelia.swan@example.com',
    phone: '+1 (555) 123-4567',
    address: 'Bali, Indonesia',
    job: 'Marketing',
    packages: ['Venice Dreams', 'Parisian Romance'],
    memberCategory: 'Gold'
  },
  {
    id: 2,
    name: 'Raphael Goodman',
    email: 'raphael.goodman@example.com',
    phone: '+1 (555) 234-5678',
    address: 'Jakarta, Indonesia',
    job: 'IT',
    packages: ['Safari Adventure', 'Tokyo Cultural Adventure'],
    memberCategory: 'Silver'
  },
  {
    id: 3,
    name: 'Ludwig Contessa',
    email: 'ludwig.contessa@example.com',
    phone: '+1 (555) 345-6789',
    address: 'Bandung, Indonesia',
    job: 'Finance',
    packages: ['Alpine Escape'],
    memberCategory: 'Gold'
  }
];

// Provider component
export const ResourceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with our mock data
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [travelers, setTravelers] = useState<Traveler[]>(initialTravelers);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedDrivers = localStorage.getItem('drivers');
    if (storedDrivers) setDrivers(JSON.parse(storedDrivers));
    
    const storedVehicles = localStorage.getItem('vehicles');
    if (storedVehicles) setVehicles(JSON.parse(storedVehicles));
    
    const storedTrips = localStorage.getItem('trips');
    if (storedTrips) setTrips(JSON.parse(storedTrips));
    
    const storedTravelers = localStorage.getItem('travelers');
    if (storedTravelers) setTravelers(JSON.parse(storedTravelers));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('drivers', JSON.stringify(drivers));
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    localStorage.setItem('trips', JSON.stringify(trips));
    localStorage.setItem('travelers', JSON.stringify(travelers));
  }, [drivers, vehicles, trips, travelers]);

  // Driver CRUD operations
  const addDriver = (driver: Omit<Driver, 'id'>) => {
    const newDriver: Driver = {
      ...driver,
      id: `DRV-${(drivers.length + 1).toString().padStart(3, '0')}`
    };
    setDrivers([...drivers, newDriver]);
  };

  const updateDriver = (id: string, updatedFields: Partial<Driver>) => {
    setDrivers(drivers.map(driver => 
      driver.id === id ? { ...driver, ...updatedFields } : driver
    ));
  };

  const deleteDriver = (id: string) => {
    // Find if driver is assigned to trips
    const assignedTrips = trips.filter(trip => trip.driver === id);
    
    // Remove driver from any assigned trips
    if (assignedTrips.length > 0) {
      setTrips(trips.map(trip => 
        trip.driver === id ? { ...trip, driver: null } : trip
      ));
    }
    
    // Delete the driver
    setDrivers(drivers.filter(driver => driver.id !== id));
  };

  // Vehicle CRUD operations
  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `VEH-${(vehicles.length + 1).toString().padStart(3, '0')}`
    };
    setVehicles([...vehicles, newVehicle]);
  };

  const updateVehicle = (id: string, updatedFields: Partial<Vehicle>) => {
    setVehicles(vehicles.map(vehicle => 
      vehicle.id === id ? { ...vehicle, ...updatedFields } : vehicle
    ));
  };

  const deleteVehicle = (id: string) => {
    // Find if vehicle is assigned to trips
    const assignedTrips = trips.filter(trip => trip.vehicle === id);
    
    // Remove vehicle from any assigned trips
    if (assignedTrips.length > 0) {
      setTrips(trips.map(trip => 
        trip.vehicle === id ? { ...trip, vehicle: null } : trip
      ));
    }
    
    // Delete the vehicle
    setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
  };

  // Trip CRUD operations
  const addTrip = (trip: Omit<Trip, 'id' | 'createdAt'>) => {
    const newTrip: Trip = {
      ...trip,
      id: `TRP-${(trips.length + 1).toString().padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTrips([...trips, newTrip]);
  };

  const updateTrip = (id: string, updatedFields: Partial<Trip>) => {
    setTrips(trips.map(trip => 
      trip.id === id ? { ...trip, ...updatedFields } : trip
    ));
  };

  const deleteTrip = (id: string) => {
    // First, free up any assigned resources
    const tripToDelete = trips.find(trip => trip.id === id);
    
    if (tripToDelete) {
      // If driver is assigned, update driver status
      if (tripToDelete.driver) {
        setDrivers(drivers.map(driver => {
          if (driver.id === tripToDelete.driver) {
            const assignedTrips = driver.assignedTrips?.filter(tripId => tripId !== id) || [];
            return {
              ...driver,
              status: assignedTrips.length === 0 ? 'Available' : driver.status,
              assignedTrips
            };
          }
          return driver;
        }));
      }
      
      // If vehicle is assigned, update vehicle status
      if (tripToDelete.vehicle) {
        setVehicles(vehicles.map(vehicle => {
          if (vehicle.id === tripToDelete.vehicle) {
            const assignedTrips = vehicle.assignedTrips?.filter(tripId => tripId !== id) || [];
            return {
              ...vehicle,
              status: assignedTrips.length === 0 ? 'Available' : vehicle.status,
              assignedTrips
            };
          }
          return vehicle;
        }));
      }
    }
    
    // Then delete the trip
    setTrips(trips.filter(trip => trip.id !== id));
  };

  // Traveler CRUD operations
  const addTraveler = (traveler: Omit<Traveler, 'id'>) => {
    const newTraveler: Traveler = {
      ...traveler,
      id: travelers.length > 0 ? Math.max(...travelers.map(t => t.id)) + 1 : 1
    };
    setTravelers([...travelers, newTraveler]);
  };

  const updateTraveler = (id: number, updatedFields: Partial<Traveler>) => {
    setTravelers(travelers.map(traveler => 
      traveler.id === id ? { ...traveler, ...updatedFields } : traveler
    ));
  };

  const deleteTraveler = (id: number) => {
    setTravelers(travelers.filter(traveler => traveler.id !== id));
  };

  // Assignment methods
  const assignDriverToTrip = (driverId: string, tripId: string) => {
    // Update the trip with the driver ID
    setTrips(trips.map(trip => 
      trip.id === tripId ? { ...trip, driver: driverId } : trip
    ));
    
    // Update the driver's status and assigned trips
    setDrivers(drivers.map(driver => {
      if (driver.id === driverId) {
        const assignedTrips = driver.assignedTrips || [];
        return {
          ...driver,
          status: 'On Trip',
          assignedTrips: [...assignedTrips, tripId]
        };
      }
      return driver;
    }));
  };

  const assignVehicleToTrip = (vehicleId: string, tripId: string) => {
    // Update the trip with the vehicle ID
    setTrips(trips.map(trip => 
      trip.id === tripId ? { ...trip, vehicle: vehicleId } : trip
    ));
    
    // Update the vehicle's status and assigned trips
    setVehicles(vehicles.map(vehicle => {
      if (vehicle.id === vehicleId) {
        const assignedTrips = vehicle.assignedTrips || [];
        return {
          ...vehicle,
          status: 'On Trip',
          assignedTrips: [...assignedTrips, tripId]
        };
      }
      return vehicle;
    }));
  };

  const unassignDriverFromTrip = (tripId: string) => {
    // Find the trip
    const trip = trips.find(t => t.id === tripId);
    if (!trip || !trip.driver) return;
    
    // Update the driver's status and assigned trips
    setDrivers(drivers.map(driver => {
      if (driver.id === trip.driver) {
        const assignedTrips = (driver.assignedTrips || []).filter(id => id !== tripId);
        return {
          ...driver,
          status: assignedTrips.length === 0 ? 'Available' : driver.status,
          assignedTrips
        };
      }
      return driver;
    }));
    
    // Update the trip to remove the driver
    setTrips(trips.map(t => 
      t.id === tripId ? { ...t, driver: null } : t
    ));
  };

  const unassignVehicleFromTrip = (tripId: string) => {
    // Find the trip
    const trip = trips.find(t => t.id === tripId);
    if (!trip || !trip.vehicle) return;
    
    // Update the vehicle's status and assigned trips
    setVehicles(vehicles.map(vehicle => {
      if (vehicle.id === trip.vehicle) {
        const assignedTrips = (vehicle.assignedTrips || []).filter(id => id !== tripId);
        return {
          ...vehicle,
          status: assignedTrips.length === 0 ? 'Available' : vehicle.status,
          assignedTrips
        };
      }
      return vehicle;
    }));
    
    // Update the trip to remove the vehicle
    setTrips(trips.map(t => 
      t.id === tripId ? { ...t, vehicle: null } : t
    ));
  };

  // Helper methods
  const getAvailableDrivers = () => {
    return drivers.filter(driver => driver.status === 'Available');
  };

  const getAvailableVehicles = (minCapacity?: number) => {
    return vehicles.filter(vehicle => 
      vehicle.status === 'Available' && 
      (minCapacity ? vehicle.capacity >= minCapacity : true)
    );
  };

  const getUnassignedTrips = () => {
    return trips.filter(trip => 
      (trip.status === 'Draft' || trip.status === 'Pending') && 
      (!trip.driver || !trip.vehicle)
    );
  };

  const getTripsByDriver = (driverId: string) => {
    return trips.filter(trip => trip.driver === driverId);
  };

  const getTripsByVehicle = (vehicleId: string) => {
    return trips.filter(trip => trip.vehicle === vehicleId);
  };

  const value = {
    drivers,
    vehicles,
    trips,
    travelers,
    addDriver,
    updateDriver,
    deleteDriver,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addTrip,
    updateTrip,
    deleteTrip,
    addTraveler,
    updateTraveler,
    deleteTraveler,
    assignDriverToTrip,
    assignVehicleToTrip,
    unassignDriverFromTrip,
    unassignVehicleFromTrip,
    getAvailableDrivers,
    getAvailableVehicles,
    getUnassignedTrips,
    getTripsByDriver,
    getTripsByVehicle
  };

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
};

// Custom hook to use the context
export const useResourceContext = (): ResourceContextType => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResourceContext must be used within a ResourceProvider');
  }
  return context;
};