import { Link } from "react-router-dom";

const Blog = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-3 text-white-900">
          AI-Powered Fitness:
          <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
            {" "}
            Smart Health Solutions
          </span>
        </h1>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          Personalized workout and nutrition plans powered by advanced AI
        </p>
      </header>

      {/* Introduction */}
      <section className="mb-10">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 leading-relaxed">
            Our AI platform delivers{" "}
            <span className="text-blue-600 font-medium">
              personalized fitness plans
            </span>{" "}
            that adapt to your unique needs, goals, and lifestyle preferences.
          </p>
        </div>
      </section>

      {/* Problem & Solution */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Problem */}
        <div className="bg-red-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-700">
            The Challenge
          </h2>
          <ul className="space-y-3">
            {[
              "One-size-fits-all fitness plans",
              "Expensive personal training",
              "Lack of consistent motivation",
            ].map((item, index) => (
              <li key={index} className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Solution */}
        <div className="bg-green-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            Our Solution
          </h2>
          <ul className="space-y-3">
            {[
              "Adaptive AI-powered plans",
              "Health-conscious recommendations",
              "Equipment-flexible workouts",
              "Personalized nutrition",
            ].map((item, index) => (
              <li key={index} className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Features */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "📈",
              title: "Smart Planning",
              description:
                "AI-driven recommendations that adapt to your progress",
            },
            {
              icon: "🍎",
              title: "Nutrition AI",
              description: "Personalized meal plans based on your preferences",
            },
            {
              icon: "🏋️",
              title: "Workout AI",
              description: "Optimized exercise routines for any equipment",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-10 text-center">
        <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-8 px-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">
            Transform Your Fitness Journey
          </h2>
          <p className="mb-6">
            Join thousands achieving their health goals with AI assistance
          </p>

          <Link to={'/login'}>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition">
              Start Your Journey
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Blog;
