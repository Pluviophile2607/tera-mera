import React from 'react';

const ListingCard = ({ listing, onClaim, isRequested }) => {
  const isRequest = listing.type === 'Request';
  const tagColor = isRequest ? 'bg-secondary-container' : listing.type === 'Trade' ? 'bg-tertiary-container text-white' : 'bg-primary-container';
  const tagLabel = isRequest ? 'WANTED' : listing.type === 'Sell' ? 'TRADE' : 'GIFT';

  const buttonLabel = isRequested ? 'REQUEST SENT' : isRequest ? 'I HAVE THIS' : 'CLAIM ITEM';
  const buttonColor = isRequested 
    ? 'bg-surface-variant text-on-surface-variant opacity-60 cursor-not-allowed shadow-none' 
    : isRequest ? 'bg-primary-custom text-white' : 'bg-secondary-container text-black';

  return (
    <div className="group bg-white border-4 border-outline-custom shadow-[8px_8px_0px_0px_#000] p-4 flex flex-col h-full transform transition-all hover:-translate-y-1">
      <div className="relative overflow-hidden border-2 border-outline-custom mb-4 aspect-square bg-surface-container">
        {listing.images && listing.images.length > 0 ? (
          <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
            <span className="material-symbols-outlined text-6xl">image_not_supported</span>
          </div>
        )}
        <div className={`absolute top-2 left-2 ${tagColor} border-2 border-outline-custom px-3 py-1 font-black text-[10px] uppercase tracking-widest`}>
          {tagLabel}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <h3 className="text-2xl font-headline font-black uppercase mb-1 tracking-tight leading-none truncate">{listing.title}</h3>
        <div className="flex items-center justify-between mb-4">
           <div className="text-xs font-bold text-on-surface-variant uppercase italic flex items-center gap-1">
            <span className="material-symbols-outlined text-base">location_on</span> {listing.location}
          </div>
          {isRequested && (
            <div className="flex items-center gap-1 text-[10px] font-black text-primary-custom uppercase animate-pulse">
               <span className="material-symbols-outlined text-sm">schedule</span> Pending Admin
            </div>
          )}
        </div>
        
        <div className="mt-auto flex items-center gap-3 p-3 bg-surface-container-low border-2 border-outline-custom mb-6">
          <div className="w-10 h-10 bg-primary-container border-2 border-outline-custom flex items-center justify-center font-black">
            {(typeof listing.userId === 'string' ? listing.userId : listing.userId?._id || '').slice(-1).toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase opacity-60 leading-none">Shared by</p>
            <p className="font-bold text-xs uppercase underline decoration-primary-custom decoration-2 underline-offset-2">
              {listing.userId?.fullName || 'Neighbor'}
            </p>
          </div>
        </div>
      </div>

      <button 
        disabled={isRequested}
        onClick={() => onClaim(listing._id)}
        className={`w-full py-4 font-black uppercase shadow-[4px_4px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all border-2 border-outline-custom ${buttonColor}`}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default ListingCard;
