import "@styles/globals.scss";
import { Toaster } from "react-hot-toast";
export default function App({ Component, pageProps }) {
    return (
        <>
            <Component {...pageProps} />
            <Toaster />
        </>
    );
}
