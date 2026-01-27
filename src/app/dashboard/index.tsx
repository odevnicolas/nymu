import { router } from "expo-router";
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    router.replace("/dashboard/home");
  }, []);

  return null;
}
