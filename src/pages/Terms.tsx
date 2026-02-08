import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";

const Terms = () => {
  return (
    <Layout>
      <section className="pt-32 pb-24 bg-gradient-hero">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="section-heading text-foreground mb-8">
              Terms of Service
            </h1>
            
            <div className="prose prose-invert prose-lg max-w-none space-y-8">
              <p className="text-muted-foreground">
                Last updated: January 2025
              </p>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Agreement to Terms
                </h2>
                <p className="text-muted-foreground">
                  By accessing or using our services, you agree to be bound by
                  these Terms of Service. If you do not agree to these terms,
                  please do not use our services.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Services
                </h2>
                <p className="text-muted-foreground">
                  Vanguard Marketing provides digital marketing services
                  including but not limited to content creation, social media
                  management, paid advertising, branding, and reputation
                  management.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Payment Terms
                </h2>
                <p className="text-muted-foreground">
                  Payment terms and conditions will be outlined in individual
                  service agreements. All fees are non-refundable unless
                  otherwise stated in writing.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Intellectual Property
                </h2>
                <p className="text-muted-foreground">
                  All content, designs, and materials created by Vanguard
                  Marketing remain our intellectual property until full payment
                  is received, at which point ownership transfers to the client.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Limitation of Liability
                </h2>
                <p className="text-muted-foreground">
                  Vanguard Marketing shall not be liable for any indirect,
                  incidental, special, or consequential damages arising from the
                  use of our services.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Contact
                </h2>
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, please contact us
                  at hello@vanguardmarketing.com.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
