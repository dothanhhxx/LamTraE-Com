import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, AuthService } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Chỉ áp dụng kiểm tra bảo mật cho các đường dẫn quản trị (/quan-tri và /api/admin)
  const isAdminPage = pathname.startsWith("/quan-tri");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  // 2. Ngoại lệ: API xác thực đăng nhập không bị chặn
  if (pathname === "/api/admin/auth") {
    return NextResponse.next();
  }

  // 3. Kiểm tra token phiên từ cookie
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = await AuthService.verifySessionToken(token);

  // 4. Nếu là trang chủ /quan-tri (màn hình nhập passcode):
  // Nếu đã đăng nhập rồi -> chuyển hướng vào trang quản lý đơn hàng
  if (pathname === "/quan-tri") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/quan-tri/don-hang", req.url));
    }
    return NextResponse.next();
  }

  // 5. Nếu chưa xác thực mà cố truy cập các trang con (/quan-tri/*) hoặc API admin:
  if (!isAuthenticated) {
    if (isAdminApi) {
      return NextResponse.json(
        { ok: false, error: "Yêu cầu quyền quản trị viên." },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/quan-tri", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/quan-tri/:path*", "/api/admin/:path*"],
};
