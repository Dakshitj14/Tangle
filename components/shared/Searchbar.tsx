"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  routeType: string;
}

function Searchbar({ routeType }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      router.push(`/${routeType}?q=${search}`);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className='searchbar'>
      <input
        placeholder='Search...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='searchbar_input'
      />
    </div>
  );
}

export default Searchbar;