"use client";

import { useLoginLogic } from "./useLoginLogic";
import LoginUI from "./LoginUI";

export default function LoginPage() {
  const logic = useLoginLogic();
  return <LoginUI {...logic} />;
}
