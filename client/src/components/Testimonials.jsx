import { motion } from "framer-motion";

const Testimonials = () => {
  const developers = [
    {
      name: "Vahid Patel",
      role: "Frontend Developer",
      description:
        "Crafting elegant user interfaces with modern frameworks and responsive design principles",
      image: "/images/dev-1.jpg",
      linkedin: "http://linkedin.com/in/vahid-patel-0a7a06260/",
    },
    {
      name: "Kaif Shaikh",
      role: "Backend Developer",
      description:
        "Engineering robust server architecture and scalable API solutions",
      image: "/images/dev-2.jpg",
      linkedin: "https://www.linkedin.com/in/mohommad-kaif-shaikh-a4294a25a/",
    },
  ];

  return (
    <section
      id="team"
      className="py-24 px-6 bg-gradient-to-b from-dark to-dark/90"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-light mb-4">
            Our Development Team
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-4"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {developers.map((developer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className="group h-full"
            >
              <div className="overflow-hidden bg-dark/40 rounded-xl shadow-xl backdrop-blur-sm border border-light/10 h-full flex flex-col">
                <div className="relative h-10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
                </div>

                <div className="p-8 relative flex-1 flex flex-col">
                  <motion.div
                    initial={{ width: "30%" }}
                    whileInView={{ width: "80%" }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                    className="h-0.5 bg-primary/70 absolute top-0 left-8"
                  ></motion.div>

                  <h3 className="text-2xl font-bold text-light mb-1">
                    {developer.name}
                  </h3>
                  <p className="text-primary font-medium tracking-wide mb-4">
                    {developer.role}
                  </p>
                  <p className="text-light/80 mb-6 leading-relaxed flex-1">
                    {developer.description}
                  </p>

                  <a
                    href={developer.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-light hover:text-primary transition-colors duration-300 mt-auto"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                    <span className="font-medium">View Profile</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
