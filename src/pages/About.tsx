import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Target,
  Zap,
  Lightbulb,
  Rocket,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description:
      "We deliver nothing but the highest quality work that exceeds expectations.",
  },
  {
    icon: Lightbulb,
    title: "Strategy",
    description:
      "Every action is backed by data-driven insights and strategic thinking.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "We stay ahead of trends and leverage cutting-edge marketing techniques.",
  },
  {
    icon: Rocket,
    title: "Speed",
    description:
      "Fast execution without compromising quality. Time is money.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Clear communication, honest reporting, and no hidden surprises.",
  },
];

const problems = [
  "Weak digital presence that doesn't reflect your brand's quality",
  "Low engagement despite consistent posting efforts",
  "Poor content quality that fails to capture attention",
  "No clear positioning in a crowded market",
  "Inconsistent growth with no measurable results",
  "Wasted ad spend on campaigns that don't convert",
];

const solutions = [
  "Strategic brand positioning that commands attention",
  "Engagement systems that build loyal communities",
  "Professional content that elevates your brand perception",
  "Clear market differentiation and competitive advantage",
  "Data-driven growth with measurable ROI",
  "Optimized campaigns that generate real business results",
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              About Us
            </span>
            <h1 className="section-heading mt-3 text-foreground">
              We're on a Mission to{" "}
              <span className="text-gradient">Transform Businesses</span>
            </h1>
            <p className="section-subheading mt-4">
              Vanguard Marketing exists to help ambitious businesses achieve
              their full potential through strategic digital marketing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 bg-navy">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop&crop=face"
                    alt="Founder"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-2xl -z-10" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-6">
                Building the Future of Digital Marketing in Ethiopia
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Vanguard Marketing was founded with a clear vision: to bring
                  world-class digital marketing capabilities to Ethiopian
                  businesses.
                </p>
                <p>
                  We saw too many talented businesses struggling to compete in
                  the digital space—not because of their products or services,
                  but because they lacked the strategic marketing systems needed
                  to reach their audience.
                </p>
                <p>
                  Today, we're proud to have helped over 150 businesses
                  transform their digital presence and achieve real, measurable
                  growth. But we're just getting started.
                </p>
              </div>
              <div className="mt-8 p-6 card-premium">
                <p className="text-lg italic text-foreground">
                  "Our goal isn't just to provide marketing services—it's to
                  become true growth partners for every business we work with."
                </p>
                <p className="text-primary font-semibold mt-4">
                  — Founder, Vanguard Marketing
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-b from-navy to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Our Values
            </span>
            <h2 className="section-heading mt-3 text-foreground">
              What <span className="text-gradient">Drives Us</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-premium p-6 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems & Solutions */}
      <section className="py-24 bg-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              The Challenge
            </span>
            <h2 className="section-heading mt-3 text-foreground">
              Why Businesses{" "}
              <span className="text-gradient">Struggle to Grow</span>
            </h2>
            <p className="section-subheading mt-4 mx-auto">
              And how Vanguard Marketing solves these problems through systems,
              strategy, and execution.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Problems */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card-premium p-8"
            >
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-500" />
                Common Struggles
              </h3>
              <ul className="space-y-4">
                {problems.map((problem, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                    <span className="text-muted-foreground">{problem}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Solutions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card-premium p-8 border-primary/30"
            >
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                Our Solutions
              </h3>
              <ul className="space-y-4">
                {solutions.map((solution, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-muted-foreground">{solution}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-16"
          >
            <Link to="/contact">
              <Button variant="hero" size="lg" className="group">
                Let's Solve Your Challenges
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
