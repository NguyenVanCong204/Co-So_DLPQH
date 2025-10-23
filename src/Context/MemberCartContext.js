import { createContext, useEffect, useState } from "react";
const MemberCartContext = createContext();
export const UserProvider = ({ children }) => {
  let cartStorege = JSON.parse(localStorage.getItem("total")) || 0;
  const [cart, SetCart] = useState(cartStorege);
  useEffect(() => {
    localStorage.setItem("total", JSON.stringify(cart));
  }, [cart]);
  return (
    <MemberCartContext.Provider value={{ cart, SetCart }}>
      {children}
    </MemberCartContext.Provider>
  );
};
export default MemberCartContext;
