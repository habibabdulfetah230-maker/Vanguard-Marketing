import { motion } from "framer-motion";
import { Search, Lightbulb, Rocket, BarChart3 } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Audit",
    description:
      "We analyze your current digital presence, competitors, and market opportunities to identify growth potential.",
  },
  {
    step: "02",
    icon: Lightbulb,
    title: "Strategy",
    description:
      "We develop a custom marketing roadmap aligned with your business goals and target audience.",
  },
  {
    step: "03",
    icon: Rocket,
    title: "Execution",
    description:
      "Our team implements high-impact campaigns across all relevant channels with precision.",
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Growth & Reporting",
    description:
      "We continuously optimize based on data, delivering clear reports and measurable results.",
  },
];

export const GrowthSystem = () => {
  return (
    <section className="py-24 bg-navy">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            Our Process
          </span>
          <h2 className="section-heading mt-3 text-foreground">
            How Our <span className="text-gradient">Growth System</span> Works
          </h2>
          <p className="section-subheading mt-4 mx-auto">
            A proven 4-step framework that transforms businesses through
            strategic digital marketing.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="relative z-10 text-center lg:text-left">
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 mb-6">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>

                {/* Step Label */}
                <div className="text-primary text-sm font-bold mb-2">
                  Step {step.step}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
