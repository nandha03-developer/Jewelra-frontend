'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { toast } from 'sonner';

const stores = [
  {
    city: 'Karaikudi',
    name: 'Jewelra Karaikudi',
    address: ' MRM ARCADE, Amman Sannathi St, Kallukatti, Karaikudi, Tamil Nadu 630001',
    phone: '+91 9894934429',
    hours: '09:30 AM - 09:00 PM',
    lunch: '2:00 PM - 4:30 PM'

  }
];

export default function StoreLocatorPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedStore, setSelectedStore] = useState<typeof stores[0] | null>(null);

  const handleEnableLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setSelectedStore(null);
        },
        (error) => {
          toast.error("Unable to retrieve your location. Please ensure location services are enabled.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const handleGetDirections = (store: typeof stores[0]) => {
    setSelectedStore(store);

    // Automatically fetch user location if not already known to show full route
    if (!userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => {
          // Silent fail or soft toast, since the store pin will still show
          toast("Enable location to see live directions from your spot to the store.");
        }
      );
    }
  };

  let mapIframeUrl = "";
  if (selectedStore && userLocation) {
    // Both user location and destination known -> Show Route Directions
    const saddr = `${userLocation.lat},${userLocation.lng}`;
    const daddr = encodeURIComponent(selectedStore.address);
    // Setting `dirflg=d` can help force driving directions
    mapIframeUrl = `https://maps.google.com/maps?saddr=${saddr}&daddr=${daddr}&output=embed`;
  } else if (selectedStore) {
    // Only destination known -> Show single pin
    const query = encodeURIComponent(selectedStore.address);
    mapIframeUrl = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  } else if (userLocation) {
    // Only user location known -> Show user location
    mapIframeUrl = `https://maps.google.com/maps?q=${userLocation.lat},${userLocation.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  return (
    <div className="min-h-screen bg-[#fcf9f6] font-[inter]">
      {/* Breadcrumb & Header Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-12 pb-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
          <Link href="/" className="hover:text-[#751A20] flex items-center gap-1 transition-colors">
            <Icon icon="solar:home-angle-linear" width="16" />
            Home
          </Link>
          <Icon icon="solar:alt-arrow-right-linear" width="14" className="text-gray-300" />
          <span className="text-gray-900 font-bold">Our Stores</span>
        </div>

        {/* Title Card */}
        <div className="bg-white rounded-[2rem] py-6 px-6 lg:py-8 lg:px-10 shadow-sm border border-gray-100 w-full flex flex-col items-center text-center space-y-3">
          <h1 className="text-4xl font-serif text-gray-900 leading-tight">Our Stores</h1>
          <p className="text-gray-500 leading-relaxed text-base max-w-3xl">
            Discover the elegance of Jewelra at a boutique near you.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-20 flex flex-col lg:flex-row gap-12">

        {/* Store Cards List */}
        <div className="lg:w-2/5 space-y-6">


          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 mt-2">
            {stores.map((store, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-[#751A20]/5 px-4 py-1 rounded-full border border-[#751A20]/10">
                    <p className="text-[#751A20] font-bold text-[10px] uppercase tracking-tighter">{store.city}</p>
                  </div>
                  <Icon icon="solar:star-linear" className="text-[#751A20]/20 group-hover:text-[#751A20] transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{store.name}</h3>
                <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
                  <div className="flex gap-3">
                    <Icon icon="solar:map-point-linear" className="text-[#751A20] shrink-0" width="18" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex gap-3">
                    <Icon icon="solar:phone-linear" className="text-[#751A20] shrink-0" width="18" />
                    <span>{store.phone}</span>
                  </div>
                  <div className="flex gap-3">
                    <Icon icon="solar:clock-circle-linear" className="text-[#751A20] shrink-0" width="18" />
                    <span>{store.hours}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleGetDirections(store)}
                  className="w-full mt-8 py-3 bg-[#fcf9f6] text-[#751A20] font-bold rounded-xl border border-[#751A20]/10 hover:bg-[#751A20] hover:text-white transition-all text-xs"
                >
                  Get Directions
                </button>
              </div>
            ))}

          </div>
        </div>

        {/* Map Placeholder or Actual Map */}
        <div className="lg:w-3/5 bg-white rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 relative min-h-[500px]">
          {mapIframeUrl ? (
            <iframe
              src={mapIframeUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              allowFullScreen={true}
              aria-hidden="false"
              tabIndex={0}
            ></iframe>
          ) : (
            <div className="absolute inset-0 bg-[#e8f0fe] flex items-center justify-center flex-col gap-6">
              {/* Abstract Map Background */}
              <div className="w-full h-full absolute opacity-20 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="#0c59cc" strokeWidth="0.5" />
                  <path d="M0,20 Q25,0 50,20 T100,20" fill="none" stroke="#0c59cc" strokeWidth="0.5" />
                  <path d="M0,80 Q25,60 50,80 T100,80" fill="none" stroke="#0c59cc" strokeWidth="0.5" />
                </svg>
              </div>

              <div className="relative z-10 text-center space-y-6 px-10">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                  <Icon icon="solar:map-point-bold-duotone" className="text-[#0c59cc]" width="40" />
                </div>
                <h3 className="text-2xl font-serif text-gray-900">Interactive Map View</h3>
                <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Real-time GPS tracking and interactive maps are ready. Enable your location to see nearby stores.
                </p>
                <button
                  onClick={handleEnableLocation}
                  className="bg-[#0c59cc] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-[#0c59cc]/20 hover:scale-105 transition-transform"
                >
                  Enable Location
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
