import { useState, useEffect } from "react";
import { Role, Passport } from "../types";
import { roles } from "../utils/mockData";

export function usePermissions() {
  const [selectedRole, setSelectedRole] = useState<Role>(roles[0]);
  const [isPassportDialogOpen, setIsPassportDialogOpen] = useState(false);
  const [passportData, setPassportData] = useState<Passport | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeKey, setThemeKey] = useState(0);

  useEffect(() => {
    const checkDarkMode = () => {
      const savedDarkMode = localStorage.getItem("darkMode") === "true";
      setIsDarkMode(savedDarkMode);
    };

    checkDarkMode();

    const handleThemeChange = () => {
      checkDarkMode();
      setThemeKey((prev) => prev + 1);
    };

    window.addEventListener("themeChanged", handleThemeChange);
    return () => window.removeEventListener("themeChanged", handleThemeChange);
  }, []);

  const simulatePassport = () => {
    const passport: Passport = {
      user_id: 52,
      global_roles: ["USER"],
      group_roles: { "59": ["AGENTS_MANAGER"] },
      permissions: ["READ", "WRITE"],
      groups: ["디딤365", "클라우드부문", "R&D그룹"],
    };
    setPassportData(passport);
    setIsPassportDialogOpen(true);
  };

  return {
    selectedRole,
    setSelectedRole,
    isPassportDialogOpen,
    setIsPassportDialogOpen,
    passportData,
    isDarkMode,
    themeKey,
    simulatePassport,
  };
}
