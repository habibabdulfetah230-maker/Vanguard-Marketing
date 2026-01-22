import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the free strategy call work?",
    answer:
      "During our 30-minute strategy call, we'll discuss your business goals, analyze your current digital presence, and identify key opportunities for growth. You'll receive actionable insights and a high-level roadmap, whether or not you decide to work with us.",
  },
  {
    question: "What services do you offer?",
    answer:
      "We offer comprehensive digital marketing services including content creation (video & photo), social media management, paid advertising (Facebook & Instagram), branding & design, and reputation management. Each service can be customized to your specific needs.",
  },
  {
    question: "Do you work with multiple industries?",
    answer:
      "Yes! We've successfully worked with businesses across various industries including hospitality, retail, tech startups, restaurants, real estate, and professional services. Our strategies are tailored to each industry's unique characteristics and audience.",
  },
  {
    question: "Do you manage TikTok accounts?",
    answer:
      "Absolutely. We create and manage TikTok content as part of our social media management services. Our team specializes in short-form video content that performs well on TikTok, Instagram Reels, and YouTube Shorts.",
  },
  {
    question: "What results can I expect?",
    answer:
      "Results vary based on your starting point and goals, but our clients typically see significant increases in engagement, leads, and brand visibility within the first 90 days. We provide clear reporting so you can track progress and ROI.",
  },
  {
    question: "How long does it take to see results?",
    answer:
      "While some improvements are visible within weeks, sustainable growth typically takes 3-6 months of consistent execution. We focus on building systems that deliver long-term results, not just quick wins that fade.",
  },
];

export const FAQ = () => {
  return (
    <section className="py-24 bg-navy-dark">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-32"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="section-heading mt-3 text-foreground">
              Frequently Asked{" "}
              <span className="text-gradient">Questions</span>
            </h2>
            <p className="section-subheading mt-4">
              Everything you need to know about working with Vanguard Marketing.
            </p>
          </motion.div>

          {/* Right Column - Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="card-premium border-border/50 px-6 data-[state=open]:border-primary/30"
                >
                  <AccordionTrigger className="text-left text-foreground hover:text-primary py-6 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
