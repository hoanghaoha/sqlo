import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconSql, IconArrowLeft } from "@tabler/icons-react"

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: April 2026</p>

        <div className="space-y-10 text-sm leading-relaxed">

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">1. Overview</h2>
            <p className="text-muted-foreground">
              Sqlo (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it. By using Sqlo, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">2. Information We Collect</h2>

            <h3 className="font-medium">Account Information</h3>
            <p className="text-muted-foreground">
              When you sign in with Google, we receive your name, email address, and profile photo from Google&apos;s OAuth service. We do not receive or store your Google password.
            </p>

            <h3 className="font-medium mt-4">Usage Data</h3>
            <p className="text-muted-foreground">
              We collect information about how you use the Service, including datasets you create, problems you attempt, SQL queries you submit, scores, and timestamps of activity. This data is used to provide the core functionality of the Service.
            </p>

            <h3 className="font-medium mt-4">User Content</h3>
            <p className="text-muted-foreground">
              Datasets, schemas, and any data you upload (e.g., CSV files) are stored to provide the Service. We do not use your uploaded data to train AI models.
            </p>

            <h3 className="font-medium mt-4">Payment Information</h3>
            <p className="text-muted-foreground">
              Payments are processed by Stripe. We do not store your credit card number or full payment details. We receive a tokenized reference and subscription status from Stripe.
            </p>

            <h3 className="font-medium mt-4">Technical Data</h3>
            <p className="text-muted-foreground">
              We automatically collect IP address, browser type, device type, and pages visited for security, debugging, and service improvement purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>To provide, maintain, and improve the Service</li>
              <li>To authenticate your identity and manage your account</li>
              <li>To process payments and manage subscriptions</li>
              <li>To send transactional emails (e.g., receipts, account alerts)</li>
              <li>To detect and prevent abuse, fraud, and security incidents</li>
              <li>To analyze usage patterns and improve the product</li>
              <li>To respond to your support requests</li>
            </ul>
            <p className="text-muted-foreground">
              We do not sell your personal information to third parties. We do not use your data for advertising.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">4. AI Processing</h2>
            <p className="text-muted-foreground">
              When you create a dataset or generate problems, your prompt and schema are sent to OpenAI&apos;s API to generate content. OpenAI processes this data according to their{" "}
              <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">privacy policy</a>.
              We do not send personal account details to OpenAI — only your dataset prompts and schemas.
            </p>
            <p className="text-muted-foreground">
              Your SQL queries submitted for grading are executed locally in a sandboxed environment and are not sent to any AI service unless you explicitly request an AI walkthrough.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">5. Data Storage and Security</h2>
            <p className="text-muted-foreground">
              Your account data is stored in Supabase (PostgreSQL) hosted on AWS infrastructure. Dataset files are stored as isolated SQLite files namespaced by your user ID. We implement row-level security to ensure you can only access your own data.
            </p>
            <p className="text-muted-foreground">
              All data in transit is encrypted using TLS. We use industry-standard security practices, but no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">6. Third-Party Services</h2>
            <p className="text-muted-foreground">We use the following third-party services:</p>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="text-left px-4 py-2 font-medium">Service</th>
                    <th className="text-left px-4 py-2 font-medium">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Google OAuth", "Authentication"],
                    ["Supabase", "Database and auth infrastructure"],
                    ["OpenAI", "AI schema and problem generation"],
                    ["Stripe", "Payment processing"],
                    ["Vercel", "Frontend hosting"],
                    ["Railway", "Backend hosting"],
                    ["Resend", "Transactional email"],
                  ].map(([service, purpose]) => (
                    <tr key={service} className="border-b last:border-0">
                      <td className="px-4 py-2 font-medium">{service}</td>
                      <td className="px-4 py-2 text-muted-foreground">{purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">7. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your data for as long as your account is active. If you delete your account, your personal data and datasets will be permanently deleted within 30 days, except where we are required to retain it for legal or financial compliance purposes (e.g., payment records are retained for 7 years as required by law).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">8. Your Rights</h2>
            <p className="text-muted-foreground">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong>Correction</strong> — request that inaccurate data be corrected</li>
              <li><strong>Deletion</strong> — request deletion of your account and associated data</li>
              <li><strong>Portability</strong> — request an export of your data in a machine-readable format</li>
              <li><strong>Objection</strong> — object to processing of your data in certain circumstances</li>
            </ul>
            <p className="text-muted-foreground">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:privacy@sqlo.io" className="text-primary hover:underline">privacy@sqlo.io</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">9. Cookies</h2>
            <p className="text-muted-foreground">
              We use essential cookies and browser storage to maintain your session and remember your sidebar preferences. We do not use advertising or tracking cookies. You can disable cookies in your browser settings, though this may affect the functionality of the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">10. Children&apos;s Privacy</h2>
            <p className="text-muted-foreground">
              The Service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us personal information, we will delete it immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">11. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by email or by posting a notice on the Service. Continued use of the Service after changes are posted constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">12. Contact</h2>
            <p className="text-muted-foreground">
              If you have questions or concerns about this Privacy Policy, contact us at{" "}
              <a href="mailto:privacy@sqlo.io" className="text-primary hover:underline">privacy@sqlo.io</a>.
            </p>
          </section>

        </div>
      </main>
    </div>
  )
}
