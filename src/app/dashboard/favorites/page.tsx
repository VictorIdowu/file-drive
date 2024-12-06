"use client";

import FilesBrowser from "@/components/FilesBrowser";

const Favorites = () => {
  return (
    <div>
      <FilesBrowser title="Favorites" favs={true} />
    </div>
  );
};

export default Favorites;
