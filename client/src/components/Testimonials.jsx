import { motion } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Coach",
      text: "The AI adaptations have revolutionized how I train my clients",
      image: "/images/testimonial-1.jpg"
    },
    {
      name: "Mike Chen",
      role: "Marathon Runner",
      text: "Best nutrition planning I've ever used - truly personalized",
      image: "/images/testimonial-2.jpg"
    },
    {
      name: "Emma Wilson",
      role: "Yoga Instructor",
      text: "Makes complex fitness science accessible to everyone",
      image: "/images/testimonial-3.jpg"
    }
  ];

  return (
    <section id="testimonials" className="py-20 px-6 bg-dark/80">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-light mb-16">
          Success Stories
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              className="bg-dark/60 p-8 rounded-xl border border-primary/20"
            >
              <div className="mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-primary"
                />
              </div>
              <h3 className="text-xl font-bold text-light text-center mb-2">
                {testimonial.name}
              </h3>
              <p className="text-primary text-center mb-4">{testimonial.role}</p>
              <p className="text-light/80 text-center">"{testimonial.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;