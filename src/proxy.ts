import { auth } from "@/lib/auth-middleware";
export default auth(() => {
  return;
});

export const config = {
  matcher: [
    "/profile/:path*",
    "/events/:path*",
    "/attendance/:path*",
    "/admin/:path*",
    "/api/checkin",
    "/api/admin/:path*",
  ],
};
