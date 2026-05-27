import { MapPin, Search } from "lucide-react";
import { useState } from "react";

export function AddressSearch({ onSearch, loading }) {
  const [address, setAddress] = useState("7620 Toscana Blvd, Orlando, FL");

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(address);
  }

  return (
    <form className="address-search" onSubmit={handleSubmit}>
      <label htmlFor="address">
        <MapPin size={18} />
        Endereco da residencia
      </label>
      <div className="address-row">
        <input
          id="address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Rua, numero, bairro, cidade"
        />
        <button type="submit" disabled={loading}>
          <Search size={18} />
          <span>{loading ? "Localizando" : "Buscar"}</span>
        </button>
      </div>
    </form>
  );
}
