import Header from "@/components/layouts/Header";
import React from "react";

function SiteLayouts({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
}

export default SiteLayouts;
