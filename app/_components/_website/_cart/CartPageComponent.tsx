import { directionMap } from "@/app/constants/_website/global";
import CartSidebar from "./CartSidebar";
import CartTableofData from "./CartTableofData";
import ProductAuthRoutes from "../../_productRoutes/ProductAuthRoutes";

export default async function CartPageComponent({
  locale,
}: {
  locale: "en" | "ar";
}) {
  return (
    <ProductAuthRoutes locale={locale}>
      <div
        dir={directionMap[locale]}
        className="flex min-h-screen items-start max-xl:flex-col-reverse gap-4 max-xl:gap-2 p-6 max-md:p-2  mt-20 bg-white"
      >
        {/* cart table items  */}
        <CartTableofData />
        {/* cart sidebar summary */}
        <CartSidebar />
      </div>
    </ProductAuthRoutes>
  );
}
