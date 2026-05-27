import { MapPin, Search } from "lucide-react";
import { useState } from "react";

export function AddressSearch({ onSearch, loading, t }) {
  const [address, setAddress] = useState("7620 Toscana Blvd, Orlando, FL");

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(address);
  }

  return (
    <form className="address-search" onSubmit={handleSubmit}>
      <label htmlFor="address">
        <MapPin size={18} />
        {t.addressLabel}
      </label>
      <div className="address-row">
        <input
          id="address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder={t.addressPlaceholder}
        />
        <button type="submit" disabled={loading}>
          <Search size={18} />
          <span>{loading ? t.locating : t.search}</span>
        </button>
      </div>
    </form>
  );
}
