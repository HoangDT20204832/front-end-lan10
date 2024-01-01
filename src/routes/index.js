import HomePage from "../pages/HomePage/HomePage"
import OrderPage from "../pages/OrderPage/index"
import ProductsPage from "../pages/ProductsPage/ProductsPage"
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"
import AccountPage from "../pages/AccountPage/index"
import TypeProductPage from "../pages/TypeProductPage/index"
import SignInPage from "../pages/SignInPage/index"
import SignUpPage from "../pages/SignUpPage/index"
import ProductPageDetail from "../pages/ProductPageDetail/index"
import AdminPage from "../pages/AminPage/index"
import PaymentPage from "../pages/PaymentPage/index"
import OrderSuccess from "../pages/OrderSuccess/index"
import MyOrderPage from "../pages/MyOrderPage/index"
import DetailsOrderPage from "../pages/DetailsOrderPage/index"
import AddressUserPage from "../pages/AddressUserPage/index"
import BankUserPage from "../pages/BankUserPage/index"
import PasswordUserPage from "../pages/PasswordUserPage/index"
export const routers = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true,
    },
    {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true,
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true,
    },
    {
        path: "/product-detail/:id",
        page: ProductPageDetail,
        isShowHeader: true,
    },
    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true,
    },
    {
        path: '/orderSuccess',
        page: OrderSuccess,
        isShowHeader: true,
    },
    {
        path: '/my-order',
        page: MyOrderPage,
        isShowHeader: true,
        isShowNavbar: true

    },
    {
        path: '/details-order/:id',
        page: DetailsOrderPage,
        isShowHeader: true
    },
    {
        path: "/account",
        page: AccountPage,
        isShowHeader: true,
        isShowNavbar: true
    },
    {
        path: "/account/address",
        page: AddressUserPage,
        isShowHeader: true,
        isShowNavbar: true
    },
    {
        path: "/account/bank",
        page: BankUserPage,
        isShowHeader: true,
        isShowNavbar: true
    },
    {
        path: "/account/password",
        page: PasswordUserPage,
        isShowHeader: true,
        isShowNavbar: true
    },
    {
        path: "/sign-in",
        page: SignInPage,
    },
    {
        path: "/sign-up",
        page: SignUpPage,
    },
    {
        path: "/system/admin",
        page: AdminPage,
        isShowHeader: true,
        isPrivate: true,
    },
    {
        path: '*',
        page: NotFoundPage,
    }
]