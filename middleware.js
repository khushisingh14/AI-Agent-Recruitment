import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/",
    "/analytics/:path*",
    "/candidates/:path*",
    "/jd-analysis/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
};
