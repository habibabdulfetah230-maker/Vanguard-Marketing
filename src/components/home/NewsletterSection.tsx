import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";

const emailSchema = z.string().email({ message: "Please enter a valid email address" });

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call (replace with actual email service integration)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSuccess(true);
    setEmail("");
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background via-navy to-background">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/30"
          >
            <Send className="w-7 h-7 text-primary-foreground" />
          </motion.div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get Growth Insights{" "}
            <span className="text-gradient">Straight to Your Inbox</span>
          </h2>

          {/* Sub-headline */}
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            No spam. Just proven marketing strategies, trends, and insights.
          </p>

          {/* Form */}
          {!isSuccess ? (
            <motion.form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex-1 relative">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  className={`h-14 bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary ${
                    error ? "border-destructive focus:border-destructive" : ""
                  }`}
                  disabled={isSubmitting}
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-6 left-0 text-destructive text-sm"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
              <Button
                type="submit"
                variant="cta"
                size="lg"
                className="h-14 px-8 group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-4"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <p className="text-xl font-semibold text-foreground mb-1">
                  You're subscribed!
                </p>
                <p className="text-muted-foreground">
                  Check your inbox for a confirmation email.
                </p>
              </div>
            </motion.div>
          )}

          {/* GDPR Text */}
          {!isSuccess && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-muted-foreground/60 text-xs mt-8"
            >
              You can unsubscribe at any time. We respect your privacy.
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
};
