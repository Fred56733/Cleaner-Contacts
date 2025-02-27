import React from "react";

function HomePage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Fullscreen GIF */}
      <img
        src="/homepage.gif"
        alt="Demo of Contact Manager"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
    </div>
  );
}

export default HomePage;
