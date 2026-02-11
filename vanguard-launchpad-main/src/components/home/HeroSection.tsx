import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchStats } from "@/lib/api";
import MediaAwareImage from "@/components/ui/MediaAwareImage";
import { useAdminAuth } from "@/context/AdminAuthContext";
import heroImage from "@/assets/hero-business.jpg";

const benefits = [
  "High-converting marketing systems",
  "Increased leads, sales & visibility",
  "Professional content & brand presence",
  "Strong, consistent positioning",
  "Data-driven growth strategies",
  "Clear reporting & measurable results",
];

export const HeroSection = () => {
  const { token } = useAdminAuth();
  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ["stats"],
    queryFn: () => fetchStats(token),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <MediaAwareImage
          src={heroImage}
          alt="Professional business team"
          className="w-full h-full object-cover"
          fallback={
            <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800" />
          }
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className="container-wide relative z-10 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6">
              Transform Your
              <span className="text-gradient">Digital Presence</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
              We help businesses scale their reach, engage their audience, and
              achieve measurable growth through strategic marketing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact">
                <Button variant="heroOutline" size="lg" className="group">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="space-y-1">
                <p className="text-3xl font-bold text-foreground">
                  {isLoading ? "150+" : (stats?.clients_scaled || "150+")}
                </p>
                <p className="text-sm text-muted-foreground">Clients Scaled</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-foreground">
                  {isLoading ? "98%" : (stats?.client_retention || "98%")}
                </p>
                <p className="text-sm text-muted-foreground">Client Retention</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-foreground">
                  {isLoading ? "5M+" : (stats?.leads_generated || "5M+")}
                </p>
                <p className="text-sm text-muted-foreground">Leads Generated</p>
              </div>
            </div>

            {/* Benefits Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card-premium p-6"
            >
              <h3 className="text-xl font-semibold mb-4">
                Why Choose <span className="text-gradient">Vanguard</span>?
              </h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs font-medium">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-2"
          >
            <div className="w-1.5 h-3 rounded-full bg-primary" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
