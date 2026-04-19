import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconSql, IconArrowLeft } from "@tabler/icons-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconSql className="size-5 text-primary" />
          <span className="font-bold">Sqlo</span>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="gap-2 flex items-center">
            <IconArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: April 2026</p>

        <div className="prose prose-sm max-w-none space-y-10 text-sm leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using Sqlo (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service. These terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">2. Description of Service</h2>
            <p className="text-muted-foreground">
              Sqlo is an AI-powered SQL practice platform that allows users to create persistent datasets, generate practice problems using artificial intelligence, solve SQL queries in a browser-based editor, and track their progress over time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">3. User Accounts</h2>
            <p className="text-muted-foreground">
              You must sign in using a valid Google account to access the Service. You are responsible for maintaining the security of your account and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
            <p className="text-muted-foreground">
              You must be at least 13 years old to use the Service. By using the Service, you represent that you meet this requirement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">4. Acceptable Use</h2>
            <p className="text-muted-foreground">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>Use the Service for any unlawful purpose or in violation of any regulations</li>
              <li>Attempt to gain unauthorized access to any part of the Service or its systems</li>
              <li>Submit malicious SQL queries designed to damage, overload, or exploit the system</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              <li>Use automated scripts or bots to access the Service without prior written consent</li>
              <li>Share, sell, or transfer your account to another person</li>
              <li>Upload datasets containing personally identifiable information of real individuals without their consent</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">5. User Content</h2>
            <p className="text-muted-foreground">
              You retain ownership of any datasets, schemas, and content you create on the Service (&quot;User Content&quot;). By uploading or creating content, you grant Sqlo a non-exclusive, worldwide, royalty-free license to store, display, and process your content solely to provide the Service.
            </p>
            <p className="text-muted-foreground">
              You are solely responsible for ensuring that any data you upload does not violate applicable laws or third-party rights. Sqlo does not claim ownership of your User Content.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">6. AI-Generated Content</h2>
            <p className="text-muted-foreground">
              The Service uses third-party AI models (including OpenAI) to generate schemas, practice problems, hints, and feedback. AI-generated content may occasionally contain errors. Sqlo does not guarantee the accuracy, completeness, or fitness of AI-generated content for any particular purpose.
            </p>
            <p className="text-muted-foreground">
              You acknowledge that AI-generated practice problems and solutions are for educational purposes only and should not be relied upon for production database decisions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">7. Subscription and Payments</h2>
            <p className="text-muted-foreground">
              The Service offers free and paid subscription plans. Paid plans are billed monthly or annually via Stripe. You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period. We do not offer refunds for partial periods.
            </p>
            <p className="text-muted-foreground">
              Sqlo reserves the right to change pricing with 30 days&apos; notice. Continued use of the Service after a price change constitutes acceptance of the new pricing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">8. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of Sqlo. Our trademarks and trade dress may not be used in connection with any product or service without prior written consent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">9. Termination</h2>
            <p className="text-muted-foreground">
              We may suspend or terminate your account at any time for violation of these Terms. You may delete your account at any time from Settings. Upon termination, your right to use the Service ceases immediately, and your datasets will be deleted within 30 days.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">10. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied. Sqlo does not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">11. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the maximum extent permitted by law, Sqlo shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability to you for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">12. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to update these Terms at any time. We will notify users of material changes via email or a notice on the Service. Continued use after changes take effect constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">13. Contact</h2>
            <p className="text-muted-foreground">
              Questions about these Terms should be sent to{" "}
              <a href="mailto:support@sqlo.io" className="text-primary hover:underline">support@sqlo.io</a>.
            </p>
          </section>

        </div>
      </main>
    </div>
  )
}
