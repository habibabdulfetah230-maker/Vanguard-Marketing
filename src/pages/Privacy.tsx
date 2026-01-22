import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";

const Privacy = () => {
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
              Privacy Policy
            </h1>
            
            <div className="prose prose-invert prose-lg max-w-none space-y-8">
              <p className="text-muted-foreground">
                Last updated: January 2025
              </p>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Information We Collect
                </h2>
                <p className="text-muted-foreground">
                  We collect information you provide directly to us, such as when
                  you fill out a contact form, subscribe to our newsletter, or
                  communicate with us via email or phone.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  How We Use Your Information
                </h2>
                <p className="text-muted-foreground">
                  We use the information we collect to provide, maintain, and
                  improve our services, communicate with you about our services,
                  and respond to your inquiries and requests.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Information Sharing
                </h2>
                <p className="text-muted-foreground">
                  We do not sell, trade, or otherwise transfer your personal
                  information to outside parties except when we believe release is
                  appropriate to comply with the law or protect our rights.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Data Security
                </h2>
                <p className="text-muted-foreground">
                  We implement appropriate security measures to protect your
                  personal information against unauthorized access, alteration,
                  disclosure, or destruction.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Contact Us
                </h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please
                  contact us at hello@vanguardmarketing.com.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
