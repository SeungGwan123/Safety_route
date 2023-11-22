import React from "react";
const Nav = ({ handleAddressChange, address, setAddress }) => {
  return (
    <div className="nav">
      <input
        className="input-address"
        type="text"
        placeholder="주소를 입력해 주변 cctv를 확인하세요!"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddressChange(address);
          }
        }}
      />
      <div className="Search" onClick={() => handleAddressChange(address)}>
        검색
      </div>
    </div>
  );
};
export default Nav;
