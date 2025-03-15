import Header from "@/components/Header/Header";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return;
  <>
    <Header />
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>;
}
