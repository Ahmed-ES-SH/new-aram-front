import { navbarlinks } from "@/app/constants/_website/navbar";
import LocaleLink from "../_global/LocaleLink";
import Img from "../_global/Img";
import AuthBtns from "./AuthBtns";
import MobileMenu from "./MobileMenu";
import TopPart from "./TopPart";
import MenuButton from "./MenuButton";
import CartButton from "./CartButton";
import NavDiv from "./NavDiv";
import FetchData from "@/app/_helpers/FetchData";

/////////////////////////////////////////
// end of import lines
/////////////////////////////////////////

export default async function Navbar({ locale }: any) {
  const currencies = await FetchData(`/currencies`, false);
  return (
    <NavDiv>
      <header className="bg-white  shadow-md fixed top-0 left-0 w-full">
        {/* language buttuns + currencies */}
        <TopPart currencies={currencies} />

        {/* main nav */}
        <div className="mx-auto w-[90%] max-lg:w-[95%] max-md:w-[95%]">
          <div className="flex lg:min-h-16 min-h-14 relative items-center justify-between">
            {/* Logo */}
            <LocaleLink className="outline-none" href={"/"}>
              <Img src="/logo.png" className="lg:w-[60px] w-[50px]" />
            </LocaleLink>

            {/* Desktop Navigation */}
            <nav
              aria-label="Global"
              className="flex items-center max-lg:gap-2 lg:gap-6"
            >
              <ul className="lg:flex hidden items-center gap-6 text-sm">
                {navbarlinks.map((link, index) => (
                  <li className="relative group duration-300" key={index}>
                    <LocaleLink
                      className="text-gray-500 flex items-center gap-2  -primary transition hover:text-primary duration-200"
                      href={link.to}
                    >
                      <p>{link.label[locale]}</p>
                    </LocaleLink>
                  </li>
                ))}
              </ul>

              {/* Auth buttuns + userButtun */}
              <AuthBtns />

              {/* shopping cart button */}
              <CartButton />

              {/* menu button */}
              <MenuButton />
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu />
      </header>
    </NavDiv>
  );
}
