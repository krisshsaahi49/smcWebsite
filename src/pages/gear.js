import React from "react";
import HeaderWithSubtitle from "../components/HeaderWithSubtitle";

export default function Gear() {
  return (
	<div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white pt-[4.875rem]">
      <div className="w-full px-4 py-2"> {/* Adjusted padding for spacing */}
        <HeaderWithSubtitle
          title="Gear Calendar"
          subtitle="View the list of available gear to checkout."
        />
      </div>
      <div className="w-full h-full px-4 py-2"> {/* Adjusted padding for spacing */}
        <iframe
          src="https://baserow.io/public/gallery/ZySUDtxRoedd0ztyLBLcysKnHM-rMDF6K4MwcG4uUaI"
          frameBorder="0"
          style={{ width: '100%', height: 'calc(100vh - 5rem)' }} // Adjusted height calculation
          allowFullScreen
          title="Gear Calendar"
        ></iframe>
      </div>
    </div>
  );
}
