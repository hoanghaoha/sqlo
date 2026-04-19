import NavBar from "@/components/landing/NavBar"
import Hero from "@/components/landing/Hero"
import HowItWorks from "@/components/landing/HowItWorks"
import WhySqlo from "@/components/landing/WhySqlo"
import Pricing from "@/components/landing/Pricing"
import Footer from "@/components/landing/Footer"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <WhySqlo />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
