import dynamic from "next/dynamic";

const ResetPasswordPage = dynamic(() => import("@/app/auth/reset-password/page"), {
  ssr: false,
});

export default ResetPasswordPage;